import base64
import hashlib
import os

import bip32utils
import ecdsa
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Util.Padding import pad, unpad
from flask import current_app as app
from mnemonic import Mnemonic
from sqlalchemy.orm import Session
import hashlib
import base58
from mnemonic import Mnemonic
from ecdsa import SigningKey, SECP256k1

from bip32utils import BIP32Key, BIP32_HARDEN

from app.api.models import AssetNFT


class CryptoData:
    def __init__(
        self,
        private_key,
        public_key,
        seed_phrase,
        salt,
        # private_key_wif,
        # public_key_address,
    ):
        self.private_key = private_key
        self.public_key = public_key
        self.seed_phrase = seed_phrase
        self.salt = salt
        # self.private_key_wif = private_key_wif
        # self.public_key_address = public_key_address
        # self.private_key_str = base58.b58encode(private_key).decode("utf-8")
        # self.public_key_str = base58.b58encode(public_key).decode("utf-8")
        # self.private_key_wif = None  # Implement this based on your requirements
        # self.public_key_wif = None  # Implement this based on your requirements
        # self.encrypted_private_key_str = base58.b58encode(encrypted_private_key).decode(
        #     "utf-8"
        # )
        # self.encrypted_public_key_str = base58.b58encode(encrypted_public_key).decode(
        #     "utf-8"
        # )
        # self.encrypted_private_key = encrypted_private_key
        # self.encrypted_public_key = encrypted_public_key
        # self.encrypted_seed_phrase = encrypted_seed_phrase
        # self.encrypted_seed_phrase_str = encrypted_seed_phrase_str


class BlockchainAPI:
    def __init__(self, session: Session):
        self.session = session

    def transfer_nft(self, nft_id: int, current_user_id: int, new_user_id: int):
        nft = self.session.query(AssetNFT).filter_by(id=nft_id).first()
        if nft:
            try:
                nft.transfer(current_user_id, new_user_id, session)
                self.session.commit()
                print("NFT transferred successfully.")
            except PermissionError as e:
                print(str(e))

    def destroy_nft(self, nft_id: int, user_id: int):
        nft = self.session.query(AssetNFT).filter_by(id=nft_id).first()
        if nft:
            try:
                nft.destroy(user_id, self.session)
                self.session.commit()
                print("NFT destroyed successfully.")
            except PermissionError as e:
                print(str(e))

    def get_nfts_by_user(self, user_id: int):
        nfts = self.session.query(AssetNFT).filter_by(user_id=user_id).all()
        valid_nfts = [nft.to_dict() for nft in nfts if not nft.is_expired()]
        return valid_nfts

    def derive_keys_from_seed_phrase(self, seed_phrase: str):
        mnemo = Mnemonic("english")
        seed = mnemo.to_seed(seed_phrase, passphrase="")
        bip32_root_key = bip32utils.BIP32Key.fromEntropy(seed)
        private_key = bip32_root_key.WalletImportFormat()
        public_key = bip32_root_key.PublicKey().hex()
        return private_key, public_key

    def generate_seed_phrase(self) -> CryptoData:
        mnemo = Mnemonic("english")

        seed_phrase = mnemo.generate(strength=256)
        seed_phrase_bin = base58.b58encode(seed_phrase)
        seed = mnemo.to_seed(seed_phrase, passphrase="")

        bip32_root_key = bip32utils.BIP32Key.fromEntropy(seed)

        private_key = bip32_root_key.WalletImportFormat()
        public_key = bip32_root_key.PublicKey().hex()

        private_key_bin = base58.b58encode(private_key)
        private_key_wif = self.private_key_to_wif(private_key_bin)
        private_key_wif_str = base58.b58encode(private_key_wif)

        public_key_bin = base58.b58encode(public_key)
        public_key_address = self.public_key_to_address(public_key_bin)
        public_key_address_str = base58.b58encode(public_key_address)

        salt = os.urandom(16)
        salt_bin = base58.b58encode(salt)
        salt_str = salt_bin.decode("utf-8")

        password = app.config.get("SECRET_KEY")

        key_iv = PBKDF2(password, salt, dkLen=32 + 16)
        key = key_iv[:32]
        iv = key_iv[32:]
        cipher = AES.new(key, AES.MODE_CBC, iv)

        encrypted_private_key = ""
        encrypted_public_key = ""
        encrypted_seed_phrase = ""

        encrypted_private_key = base58.b58encode(
            cipher.encrypt(pad(private_key_wif_str, AES.block_size))
        ).decode("utf-8")
        encrypted_public_key = base58.b58encode(
            cipher.encrypt(pad(public_key_address_str, AES.block_size))
        ).decode("utf-8")
        encrypted_seed_phrase = base58.b58encode(
            cipher.encrypt(pad(salt_bin, AES.block_size))
        ).decode("utf-8")

        # seed = b"your_seed_bytes"
        # root_key = BIP32Key.fromEntropy(base58.b58encode(seed_phrase))

        # # Derive a child key (e.g., m/0/1)
        # child_key = root_key.ChildKey(0).ChildKey(1)

        # # Print the child key information
        # print("Child Private Key (WIF):", child_key.WalletImportFormat())
        # print("Child Public Key:", child_key.PublicKey().hex())
        # print("Child Address:", child_key.Address())

        # # Example usage: Generate a new address for each transaction
        # transaction_addresses = [root_key.ChildKey(i).Address() for i in range(10)]
        # print("Transaction Addresses:", transaction_addresses)

        # # Step 4 (Optional): Derive child keys
        # # For example, derive the first child key
        # child_key = bip32_root_key.ChildKey(0)
        # child_private_key = child_key.WalletImportFormat()
        # child_public_key = child_key.PublicKey().hex()

        # print(f"Child Private Key (WIF): {child_private_key}")
        # print(f"Child Public Key: {child_public_key}")

        # private_key_bin = base58.b58encode(private_key)
        # private_key_wif_bin = self.convert_key_to_wif(private_key_bin)
        # private_key_wif = private_key_wif_bin.decode("utf-8")
        # private_key_str = private_key_bin.decode("utf-8")

        # public_key_bin = base58.b58encode(public_key)
        # public_key_wif_bin = self.convert_key_to_wif(public_key_bin)
        # public_key_wif = public_key_wif_bin.decode("utf-8")
        # public_key_str = public_key_bin.decode("utf-8")

        # password = app.config.get("SECRET_KEY")

        # key_iv = PBKDF2(password, salt, dkLen=32 + 16)
        # key = key_iv[:32]
        # iv = key_iv[32:]

        # cipher = AES.new(key, AES.MODE_CBC, iv)
        # encrypted_private_key = cipher.encrypt(pad(private_key_wif_bin, AES.block_size))
        # encrypted_public_key = cipher.encrypt(pad(public_key_wif_bin, AES.block_size))

        # encrypted_private_key_str = base58.b58encode(encrypted_private_key).decode(
        #     "utf-8"
        # )
        # encrypted_public_key_str = base58.b58encode(encrypted_public_key).decode(
        #     "utf-8"
        # )

        # encrypted_seed_phrase = cipher.encrypt(
        #     pad(seed_phrase.encode("utf-8"), AES.block_size)
        # )
        # encrypted_seed_phrase_str = base58.b58encode(encrypted_seed_phrase).decode(
        #     "utf8"
        # )

        return CryptoData(
            encrypted_private_key,
            encrypted_public_key,
            encrypted_seed_phrase,
            salt_str,
            # private_key_wif,
            # public_key_address,
        )

    def private_key_to_wif(self, private_key, compressed=True):
        # Step 1: Add prefix 0x80
        prefixed_key = b"\x80" + private_key

        # Step 2: Add suffix 0x01 if compressed
        if compressed:
            prefixed_key += b"\x01"

        # Step 3: Calculate checksum (first 4 bytes of double SHA-256 hash)
        checksum = hashlib.sha256(hashlib.sha256(prefixed_key).digest()).digest()[:4]

        # Step 4: Concatenate prefixed key and checksum
        final_key = prefixed_key + checksum

        # Step 5: Encode using Base58Check
        wif = base58.b58encode(final_key)

        return wif

    def public_key_to_address(self, public_key):
        # Step 1: SHA-256
        sha256 = hashlib.sha256(public_key).digest()

        # Step 2: RIPEMD-160
        ripemd160 = hashlib.new("ripemd160")
        ripemd160.update(sha256)
        public_key_hash = ripemd160.digest()

        # Step 3: Add version byte (0x00 for mainnet)
        versioned_key = b"\x00" + public_key_hash

        # Step 4: Calculate checksum (first 4 bytes of double SHA-256 hash)
        checksum = hashlib.sha256(hashlib.sha256(versioned_key).digest()).digest()[:4]

        # Step 5: Concatenate versioned key and checksum
        final_key = versioned_key + checksum

        # Step 6: Encode using Base58Check
        address = base58.b58encode(final_key)

        return address

    # def convert_key_to_wif(self, key):
    #     # Add prefix '80' for mainnet
    #     extended_key = b"\x80" + key

    #     # Add suffix '01' if the key should correspond to a compressed public key
    #     extended_key += b"\x01"

    #     # Perform double SHA-256 hash
    #     hash1 = hashlib.sha256(extended_key).digest()
    #     hash2 = hashlib.sha256(hash1).digest()

    #     # Append first 4 bytes of the second hash as checksum
    #     wif_key = extended_key + hash2[:4]

    #     # Convert to base58
    #     return base58.b58encode(wif_key)

    def decrypt_word(encrypted_word, salt, password):
        key_iv = PBKDF2(password, salt, dkLen=32 + 16)
        key = key_iv[:32]
        iv = key_iv[32:]

        cipher = AES.new(key, AES.MODE_CBC, iv)
        word = unpad(cipher.decrypt(encrypted_word), AES.block_size)

        return word

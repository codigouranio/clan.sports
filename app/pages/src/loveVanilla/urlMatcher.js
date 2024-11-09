export class UrlMatcher {
  constructor(pathname = "", search = "", hash = "") {
    this.pathname = pathname;
    this.search = search;
    this.hash = hash;
  }

  isMatch(that) {
    if (this.pathname !== that.pathname) {
      return false;
    }

    const thisUrlParams = new URLSearchParams(this.search);
    const thatUrlParams = new URLSearchParams(that.search);

    for (const [key, value] of thisUrlParams) {
      if (
        !thatUrlParams.has(key) ||
        (thatUrlParams.get(key) !== value &&
          thisUrlParams.get(key) !== "*" &&
          thatUrlParams.get(key) !== "*")
      ) {
        return false;
      }
    }

    return true;
  }
}

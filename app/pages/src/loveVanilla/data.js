import { murmurhash3_32_gc } from "./crypto";

const source = {
  data: {
    form: {},
    requestedCode: null,
  },
  dataHashCode: null,
};

const setData = (value, noTrigger = false, force = false) => {
  const newData = Object.assign({}, source.data, value);

  const newDataHashCode = murmurhash3_32_gc(JSON.stringify(newData));
  const oldDataHashCode = source.dataHashCode;

  // if (!force && newDataHashCode === oldDataHashCode) {
  //   return;
  // }

  source.data = Object.assign({}, source.data, value);
  source.dataHashCode = newDataHashCode;

  if (!noTrigger) {
    window.dispatchEvent(new Event("__@_updated_data"));
  }
};
const getData = () => source.data;
const getDataHashCode = () => source.dataHashCode;
const setDataHashCode = (hashCode) => (source.dataHashCode = hashCode);

export { setData, getData, getDataHashCode, setDataHashCode };

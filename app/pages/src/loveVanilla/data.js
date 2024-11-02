const source = {
  data: {
    form: {},
    requestedCode: null,
  },
};

const setData = (value, noTrigger = true) => {
  source.data = Object.assign({}, source.data, value);
  if (noTrigger) {
    window.dispatchEvent(new Event("__popstate__"));
  }
};
const getData = () => source.data;

export { setData, getData };

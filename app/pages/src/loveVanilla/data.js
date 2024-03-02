const source = {
  data: {
    form: {},
    requestedCode: null,
  },
};

const setData = (value) => {
  source.data = Object.assign({}, source.data, value);
  window.dispatchEvent(new Event("__popstate__"));
};
const getData = () => source.data;

export { setData, getData };

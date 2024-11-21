function asyncDebounce(func, delay) {
  let timeoutId;

  return async function (...args) {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

function getUrlParams(paramName) {
  const params = new URLSearchParams(window.location.search);

  if (paramName && paramName.length > 0) {
    if (params.has(paramName)) {
      return params.get(paramName);
    }
    return "";
  }

  return params;
}

export { asyncDebounce, getUrlParams };

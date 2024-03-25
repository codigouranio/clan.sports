import { useContext, useEffect } from 'react';
import { ActionType, Storage } from './Storage';

// Custom hook for fetching data
function useDataFetching(url: string, method = 'GET', body = null) {

  const { storageState, dispatch } = useContext(Storage);

  console.log(storageState);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: true
      });
      try {
        const options = {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : null
        };
        const response = await fetch(url, options);
        const data = await response.json();
        dispatch({ type: ActionType.SET_DATA, payload: data });
      } catch (error: any) {
        dispatch({ type: ActionType.SET_ERROR, payload: error.message });
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [url, method, body, dispatch]); // Dependency array including 'url', 'method', and 'body'
}

export default useDataFetching;


// import React from 'react';
// import useDataFetching from './useDataFetching';

// function Component1() {
//   const { data, loading, error } = useDataFetching('https://api.example.com/data1');

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return <div>Data: {JSON.stringify(data)}</div>;
// }

// function Component2() {
//   const { data, loading, error } = useDataFetching('https://api.example.com/data2');

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return <div>Data: {JSON.stringify(data)}</div>;
// }

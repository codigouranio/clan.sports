import { useContext, useEffect, useMemo } from 'react';
import { ActionType, Storage } from './Storage';

// Custom hook for fetching data
function useDataFetching(url: string, method = 'GET', body = null) {

  const { storageState, dispatch } = useContext(Storage);

  const fetchData = async () => {

    dispatch({
      type: ActionType.SET_LOADING,
      payload: true
    });

    try {
      const options: RequestInit = {
        credentials: 'include',
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null
      };
      const response = await fetch(url, options);
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      const data = await response.json();
      dispatch({ type: ActionType.SET_DATA, payload: data });
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.message });
    }
  };

  const memoizedFetchData = useMemo(() => fetchData, [url, method, body, dispatch]);

  useEffect(() => {

    memoizedFetchData();

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [memoizedFetchData]);

  return storageState;
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

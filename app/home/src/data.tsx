import { useEffect, useReducer } from 'react';

// Define action types
const FETCH_REQUEST = 'FETCH_REQUEST';
const FETCH_SUCCESS = 'FETCH_SUCCESS';
const FETCH_FAILURE = 'FETCH_FAILURE';

// Define a reducer function
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return { ...state, loading: true };
    case FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Custom hook for fetching data
function useDataFetching(url: string, method = 'GET', body = null) {
  // Initialize state using useReducer
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: FETCH_REQUEST });
      try {
        const options = {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: body ? JSON.stringify(body) : null
        };
        const response = await fetch(url, options);
        const data = await response.json();
        dispatch({ type: FETCH_SUCCESS, payload: data });
      } catch (error) {
        dispatch({ type: FETCH_FAILURE, payload: error.message });
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [url, method, body]); // Dependency array including 'url', 'method', and 'body'

  return state;
}

export default useDataFetching;
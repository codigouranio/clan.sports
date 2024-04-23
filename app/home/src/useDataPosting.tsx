import { useContext } from 'react';
import { ActionType, Storage } from './Storage';

// Custom hook for posting data from a form
function useFormPosting(url: string, params: any = { timeout: 500 }) {

  const { storageState, dispatch } = useContext(Storage);

  let timeout: NodeJS.Timeout;

  const postData = async (formData: any) => {
    try {
      // console.log(formData);

      const options: RequestInit = {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      };

      const response = await fetch(url, options);
      const data = await response.json();
      dispatch({ type: ActionType.SET_DATA, payload: data });
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.message });
    }
  };

  const prePostData = async (formData: any) => {
    clearTimeout(timeout);

    dispatch({
      type: ActionType.SET_LOADING,
      payload: true
    });

    timeout = setTimeout(() => postData(formData), params.timeout);
  };

  return {
    state: storageState,
    postData: async (formData: any) => prePostData(formData)
  };
}

export default useFormPosting;

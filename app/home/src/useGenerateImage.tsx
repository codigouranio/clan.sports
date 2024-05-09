import { useContext } from 'react';
import { ActionType, Storage } from './Storage';

function useGenerateImage(
  url: string = '/api/trophy/generate',
  params: any = { timeout: 1500 }
) {

  const { storageState, dispatch } = useContext(Storage);

  let timeout: NodeJS.Timeout;

  const postGenerate = async (payload: any) => {
    try {
      const response = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const blob = await response.blob();
      dispatch({
        type: ActionType.SET_DATA, payload: {
          items: {
            generatedImage: {
              url: URL.createObjectURL(blob)
            }
          }
        }
      });
    } catch (error: any) {
      dispatch({ type: ActionType.SET_ERROR, payload: error.message });
    }
  };

  const preGenerate = async (payload: any) => {
    clearTimeout(timeout);
    dispatch({
      type: ActionType.SET_LOADING,
      payload: true
    });
    timeout = setTimeout(() => postGenerate(payload), params.timeout);
  };

  return {
    state: storageState,
    generateImage: async (payload: any, dataTemplate: (img: any) => ({})) => preGenerate(payload)
  };
}

export default useGenerateImage;
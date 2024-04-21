import { Dispatch, ReactNode, createContext, useContext, useReducer } from 'react';
import * as _ from 'lodash';

// Define the shape of your state
interface StorageState {
  data: any;
  loading: boolean;
  error: string | null;
}

// Define action types
export enum ActionType {
  SET_DATA = 'SET_DATA',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR'
}

// Define action interfaces
interface SetDataAction {
  type: ActionType.SET_DATA;
  payload: any; // Update payload type as per your requirements
}

interface SetLoadingAction {
  type: ActionType.SET_LOADING;
  payload: boolean;
}

interface SetErrorAction {
  type: ActionType.SET_ERROR;
  payload: string | null;
}

type Action = SetDataAction | SetLoadingAction | SetErrorAction;

function storageReducer(state: StorageState, action: Action): StorageState {
  switch (action.type) {
    case ActionType.SET_DATA:
      const items: Record<string, any> = {};
      for (let key in action.payload?.items) {
        items[key] = { ...state.data.items[key], ...action.payload.items[key] };
      }
      const data = { ...state?.data, ...{ items } };
      return { ...state, ...{ data }, ...{ loading: false } };
    case ActionType.SET_LOADING:
      return { ...state, ...{ loading: action.payload || true } };
    case ActionType.SET_ERROR:
      return { ...state, ...{ error: action.payload }, ...{ loading: false } };
    default:
      return state;
  }
}

// Create a context with a default value
interface StorageStateContextType {
  storageState: any;
  dispatch: Dispatch<Action>;
}

export const Storage = createContext<StorageStateContextType>({
  storageState: {},
  dispatch: () => { } // A no-op function
});

function initStorageState(): StorageState {
  return {
    data: {
      items: {
        profiles: []
      },
      settings: {}
    },
    loading: false,
    error: null
  };
}

export function Provider({ children }: { children: ReactNode }) {
  const [storageState, dispatch] = useReducer(storageReducer, initStorageState());

  return (
    <Storage.Provider value={{ storageState, dispatch }}>
      {children}
    </Storage.Provider>
  );
}

export function useStorage() {
  return useContext(Storage);
}
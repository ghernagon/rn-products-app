import React, {createContext, useEffect, useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from '../api/cafeApi';
import {
  LoginData,
  LoginResponse,
  RegisterData,
  Usuario,
} from '../interfaces/appInterfaces';
import {AuthReducer, AuthState} from './AuthReducer';

type AuthContextProps = {
  errorMsg: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (registerData: RegisterData) => void;
  signIn: (loginData: LoginData) => void;
  removeError: () => void;
  logOut: () => void;
};

type Props = {
  children: JSX.Element | JSX.Element[];
};

const authInitialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMsg: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(AuthReducer, authInitialState);

  useEffect(() => {
    // AsyncStorage.removeItem('token');
    checkToken();
  }, []);

  /**
   * If there's a token in AsyncStorage, send it to the server to validate it. If the server says it's
   * valid, dispatch an action to set the user's state to authenticated. If the server says it's
   * invalid, dispatch an action to set the user's state to not authenticated.
   */
  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return dispatch({type: 'notAuthenticated'});
      }

      const {data, status} = await cafeApi.get<LoginResponse>('/auth');

      if (status !== 200) {
        return dispatch({type: 'notAuthenticated'});
      }

      // Save token
      await AsyncStorage.setItem('token', data.token);

      dispatch({
        type: 'signUp',
        payload: {token: data.token, user: data.usuario},
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * It consumes the API, dispatches a state change, and saves the token
   * @param {LoginData}  - LoginData: This is the type of the data that we're going to send to the API.
   */
  const signIn = async ({correo, password}: LoginData) => {
    try {
      // Consume API
      const resp = await cafeApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });

      // Dispatch state change
      dispatch({
        type: 'signUp',
        payload: {token: resp.data.token, user: resp.data.usuario},
      });

      // Save token
      await AsyncStorage.setItem('token', resp.data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.msg || 'Wrong credentials',
      });
    }
  };

  /**
   * It creates a new user, and
   * if the request is successful, it saves the token in the app's storage and dispatches a state
   * change
   * @param {RegisterData}  - RegisterData
   */
  const signUp = async ({nombre, correo, password}: RegisterData) => {
    try {
      const resp = await cafeApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password,
      });

      // Dispatch state change
      dispatch({
        type: 'signUp',
        payload: {token: resp.data.token, user: resp.data.usuario},
      });

      // Save token
      await AsyncStorage.setItem('token', resp.data.token);
    } catch (error) {
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Something went wrong',
      });
    }
  };

  /**
   * It dispatches an action to the reducer to remove the error
   */
  const removeError = () => {
    dispatch({
      type: 'removeError',
    });
  };

  /**
   * It dispatches an action to the reducer that will change the
   * state of the user to logged out.
   */
  const logOut = async () => {
    // Removes token
    await AsyncStorage.removeItem('token');
    dispatch({type: 'logout'});
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        removeError,
        logOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

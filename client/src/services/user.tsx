import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../../shared/types.shared';
import { useSocket } from './socket';

export type User = Player & {
  telegramCode: string;
};

interface UserContextType {
  user: User | undefined;
  createNewUser: (user: Omit<User, 'uuid'>) => void;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  createNewUser: () => undefined,
  logout: () => undefined,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [tempUser, setTempUser] = useState<User>();
  const [user, setUser] = useLocalStorage<User | undefined>('user', undefined);
  const socket = useSocket();

  useEffect(() => {
    if (tempUser !== undefined) {
      console.log('INITING', tempUser);
      socket.emit(
        'init',
        tempUser,
        (res: { success: boolean; error: string }) => {
          console.log('INIT error', res.error);
          console.log('INIT success', res.success);
          if (res.success) {
            console.log('LOGIN SUCCESS!!!!');
            setUser(tempUser);
          }
          if (res.error) {
            alert(res.error);
          }
        }
      );
    }
  }, [tempUser]);

  useEffect(() => {
    if (tempUser !== undefined) return;
    if (user !== undefined) {
      console.log('INITING', user);
      socket.emit('init', user, (res: { success: boolean; error: string }) => {
        console.log('INIT error', res.error);
        console.log('INIT success', res.success);
        if (res.success) {
          console.log('LOGIN SUCCESS!!!!');
          setUser(user);
        }
        if (res.error) {
          // alert(res.error);
          if (res.error.includes('Invalid telegram code')) {
            alert('Invalid telegram code. Please login again.');
            logout();
          }
          if (res.error.includes('banned')) {
            alert('You have been banned hahaha :DD');
            logout();
          }
        }
      });
    }
  }, [user]);

  const createNewUser = (userData: Omit<User, 'uuid'>) => {
    console.log('USER DATA', userData);
    const newUser = {
      uuid: uuidv4(),
      ...userData,
    };
    setTempUser(newUser);
    // setUser(newUser);
  };

  // set User when socket 'login-success' is received
  // useEffect(() => {
  //   socket.on('login-success', (user: User) => {
  //     console.log('LOGIN SUCCESS', user);
  //     setUser(user);
  //   });

  //   return () => {
  //     socket.off('login-success');
  //   };
  // }, [socket]);

  // useEffect(() => {
  //   socket.on('login-fail', (reason: string) => {
  //     alert(reason);
  //   });

  //   return () => {
  //     socket.off('login-fail');
  //   };
  // }, [socket]);

  const logout = () => {
    setTempUser(undefined);
    setUser(undefined);
  };

  return (
    <UserContext.Provider value={{ user, createNewUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

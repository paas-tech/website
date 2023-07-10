import { usersApi } from '@/api/api';
import { useState, useEffect } from 'react';
import { accessExpired } from './accessHelper';
import { UserType } from '@/typings/user.type';

export function useUser() {
  const [user, setUser] = useState<UserType | null>(null);

  const getAuthenticatedUser = (): Promise<UserType | null> => {
    if (accessExpired()) {
      return (async () => null)();
    }

    return usersApi
      .usersControllerGetProfile()
      .then((response) => {
        if (!response.data || !(response.data as UserType).username) return null;
        const user = response.data as UserType;

        return {
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      })
      .catch(() => null);
  };

  useEffect(() => {
    async function getUserDetails() {
      getAuthenticatedUser()
        .then((user) => {
          setUser(user);
        })
        .catch();
    }
    getUserDetails();
  }, []);

  return user;
}
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './user';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  if (!user) {
    // user is not logged in
    return <Navigate to="/select-guild" />;
  }
  return <>{children}</>;
};

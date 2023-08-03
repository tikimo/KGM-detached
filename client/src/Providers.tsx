import { SocketProvider } from './services/socket';
import { UserProvider } from './services/user';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <UserProvider>{children}</UserProvider>
    </SocketProvider>
  );
}

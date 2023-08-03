import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { Outlet } from 'react-router-dom';
import { TopBar } from './components/TopBar';

export function Root() {
  const handle = useFullScreenHandle();

  return (
    <>
      <FullScreen handle={handle} className="fullscreen">
        <div style={{ flex: '0 1 auto' }}>
          <TopBar fullScreenHandle={handle} />
        </div>
        <div style={{ flex: '1 1 auto' }}>
          <Outlet />
        </div>
      </FullScreen>
    </>
  );
}

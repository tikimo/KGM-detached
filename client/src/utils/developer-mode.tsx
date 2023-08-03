import { useState } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type DeveloperModeStore = {
  enabled: boolean;
  toggle: () => void;
};

const useDeveloperModeStore = create<DeveloperModeStore>()(
  persist((set) => ({
    enabled: false,
    toggle: () => set((state) => ({ enabled: !state.enabled })),
  }))
);

export const useDeveloperMode = () => {
  return useDeveloperModeStore((s) => s.enabled);
};

export const DeveloperModeButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // press 7 times to enable developer mode
  const [pressCount, setPressCount] = useState(0);
  const [pressingStartedAt, setPressingStartedAt] = useState(0);
  const toggle = useDeveloperModeStore((s) => s.toggle);
  const enabled = useDeveloperModeStore((s) => s.enabled);

  const handleClick = () => {
    if (pressingStartedAt === 0) {
      setPressingStartedAt(Date.now());
    }
    if (Date.now() - pressingStartedAt > 2000) {
      setPressingStartedAt(0);
      setPressCount(0);
    }
    setPressCount(pressCount + 1);
    if (pressCount >= 6) {
      console.log(`Developer mode ${!enabled ? 'enabled!' : 'disabled'}`);
      toggle();
      setPressCount(0);
    }
  };

  return <div onClick={handleClick}>{children}</div>;
};

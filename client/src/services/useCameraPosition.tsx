// Use this to scroll the camera to a player

import create from 'zustand';

type CameraPositionStore = {
  position: {
    /**
     * From 0 to 100
     */
    x: number;
    /**
     * From 0 to 100
     */
    y: number;
  };
  setPosition: (position: { x: number; y: number }) => void;
};

export const useManualCameraPosition = create<CameraPositionStore>((set) => ({
  position: {
    x: 50,
    y: 50,
  },
  setPosition: (position: { x: number; y: number }) => set({ position }),
}));

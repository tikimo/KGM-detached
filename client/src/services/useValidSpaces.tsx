import create from 'zustand';

type ValidSpacesStore = {
  validSpaces: Set<string>;
  setValidSpaces: (validSpaces: Set<string>) => void;
};

export const useValidSpaces = create<ValidSpacesStore>((set) => ({
  validSpaces: new Set(),
  setValidSpaces: (validSpaces: Set<string>) => {
    set(() => ({
      validSpaces,
    }));
  },
}));

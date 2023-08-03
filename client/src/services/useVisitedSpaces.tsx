import create from 'zustand';

type VisitedSpacesStore = {
  visitedSpaceIds: Set<string>;
  addVisitedSpace: (spaceId: string) => void;
  clearVisitedSpaces: () => void;
};

export const useVisitedSpaces = create<VisitedSpacesStore>((set) => ({
  visitedSpaceIds: new Set(),
  addVisitedSpace: (spaceId) => {
    set((state) => ({
      visitedSpaceIds: new Set(state.visitedSpaceIds).add(spaceId),
    }));
  },
  clearVisitedSpaces: () => {
    set(() => ({
      visitedSpaceIds: new Set(),
    }));
  },
}));

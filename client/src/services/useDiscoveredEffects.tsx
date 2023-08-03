import create from 'zustand';

type SpaceId = string;
type Discovery = string;

type VisitedSpacesStore = {
  discoveredSpaces: Map<SpaceId, Discovery>;
  addDiscoveredSpace: (spaceId: string, discovery: string) => void;
  clearDiscoveredSpaces: () => void;
};

export const useDiscoveredSpaces = create<VisitedSpacesStore>((set) => ({
  discoveredSpaces: new Map(),
  addDiscoveredSpace: (spaceId, discovery) => {
    set((state) => ({
      discoveredSpaces: getNewDiscoveredSpaces(
        state.discoveredSpaces,
        spaceId,
        discovery
      ),
    }));
  },
  clearDiscoveredSpaces: () => {
    set(() => ({
      discoveredSpaces: new Map(),
    }));
  },
}));

function getNewDiscoveredSpaces(
  oldDiscoveredSpaces: Map<SpaceId, Discovery>,
  spaceId: string,
  newDiscovery: string
) {
  const oldDiscovery = oldDiscoveredSpaces.get(spaceId);

  // Do not overwrite a discovered space with a "visited" space
  if (newDiscovery === 'visited' && oldDiscovery !== undefined) {
    return oldDiscoveredSpaces;
  }

  const newDiscoveredSpaces = new Map(oldDiscoveredSpaces);
  newDiscoveredSpaces.set(spaceId, newDiscovery);
  return newDiscoveredSpaces;
}

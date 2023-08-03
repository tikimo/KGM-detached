import create from 'zustand';
import { Effect } from '../../shared/types.shared';

type CurrentEffectsStore = {
  effects: Effect[];
  addEffect: (effect: Effect) => void;
  removeEffect: (effect: Effect) => void;
  setEffects: (effects: Effect[]) => void;
};

export const useEffectStore = create<CurrentEffectsStore>((set) => ({
  effects: [],
  addEffect: (effect: Effect) => {
    set((state) => ({
      effects: [...state.effects, effect],
    }));
  },
  removeEffect: (effect: Effect) => {
    set((state) => ({
      effects: state.effects.filter((e) => e.id !== effect.id),
    }));
  },
  setEffects: (effects: Effect[]) => {
    set(() => ({
      effects,
    }));
  },
}));

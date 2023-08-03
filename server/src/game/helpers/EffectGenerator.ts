import { Effects, ServerEffect } from '../Effects';
import { SPACES } from '../Spaces';

export function generateEffects(effects: Map<string, ServerEffect>) {
  // set dynamic effects
  addXPEffects(effects, { small: 8, medium: 6, large: 3 });

  // Set semi-static effects
  addSausages(effects);
  addGlassShards(effects);
  addScooters(effects);
  addDrunks(effects);

  // Set static effects
  addStaticEffects(effects);

  // debugger block
  let space_effects_debug: { e: string; s: string }[] = [];
  effects.forEach((effect, space) => {
    space_effects_debug.push({ e: effect.name, s: space });
  });
  space_effects_debug.sort((a, b) => a.e.localeCompare(b.e));
  null;
}

function addStaticEffects(effects: Map<string, ServerEffect>) {
  // Scooters
  effects.set('q-talo', Effects.E_SCOOTER);
  effects.set('k-market', Effects.E_SCOOTER);

  // Buses
  effects.set('aitiopaikka-kaakko', Effects.BUS);
  effects.set('urheilu-k-market-risteys', Effects.BUS);
  effects.set('simolankatu-25', Effects.BUS);
  effects.set('pappilanmaki-c', Effects.BUS);
}


function addSausages(effects: Map<string, ServerEffect>) {
  effects.set('urheilukentta', Effects.SAUSAGE);
  effects.set('tyyssija', Effects.SAUSAGE);
}

function addGlassShards(effects: Map<string, ServerEffect>) {
  // Set shards near aitiopaikka
  applyNear(effects, 'aitiopaikka', Effects.GLASS_SHARD, 10, 0.2);
  applyNear(effects, 'posankka', Effects.GLASS_SHARD, 4, 0.3);

  effects.set('vpk-metsa-syva', Effects.GLASS_SHARD);
}

function addScooters(effects: Map<string, ServerEffect>) {
  applyNear(effects, 'pappilanmaki-c', Effects.E_SCOOTER, 10, 0.2);
  applyNear(effects, 'kuikkulankatu-3', Effects.E_SCOOTER, 6, 0.3);
  applyNear(effects, 'hautausmaa-etela', Effects.E_SCOOTER, 6, 0.3);
  applyNear(effects, 'kuuvuori', Effects.E_SCOOTER, 3, 0.3);
  applyNear(effects, 'aurajoki', Effects.E_SCOOTER, 3, 0.8);

  effects.set('ikituuri', Effects.E_SCOOTER);
}

function addDrunks(effects: Map<string, ServerEffect>) {
  applyNear(effects, 'hautausmaa', Effects.DRUNK, 10, 0.2);
  applyNear(effects, 'k-market', Effects.DRUNK, 10, 0.2);
  applyNear(effects, 'yo-kyla-ulkokuntosali', Effects.DRUNK, 10, 0.1);
}

function addXPEffects(
  effects: Map<string, ServerEffect>,
  xps: { small: number; medium: number; large: number }
) {
  for (let i = 0; i <= xps.small; i++) {
    // small XP
    let space = SPACES[Math.floor(Math.random() * SPACES.length)];
    effects.set(space.id, Effects.XP_SMALL);
  }
  for (let i = 0; i <= xps.medium; i++) {
    // medium XP
    let space = SPACES[Math.floor(Math.random() * SPACES.length)];
    effects.set(space.id, Effects.XP_MEDIUM);
  }
  for (let i = 0; i <= xps.large; i++) {
    // large XP
    let space = SPACES[Math.floor(Math.random() * SPACES.length)];
    effects.set(space.id, Effects.XP_LARGE);
  }
}

// Probability is 0-1
function applyNear(
  effects: Map<string, ServerEffect>,
  spaceId: string,
  effect: ServerEffect,
  radius: number,
  probability: number
) {
  let space = SPACES.find((s) => s.id === spaceId);
  if (space) {
    let minx = space.x - radius;
    let maxx = space.x + radius;
    let miny = space.y - radius;
    let maxy = space.y + radius;

    let nearSpaces = SPACES.filter(
      (s) => s.x >= minx && s.x <= maxx && s.y >= miny && s.y <= maxy
    );
    nearSpaces.forEach((s) => {
      let quantifier = Math.random();
      if (quantifier <= probability) {
        effects.set(s.id, effect);
      }
    });
  }
}

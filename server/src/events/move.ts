import {
  getGame,
  getGamePlayer,
  movePlayer,
  updateStatusList,
} from './../game/Games';
import { Game, GamePlayer, Space } from './../../shared/types.shared';
import { io } from './../app';
import { getPlayerBySocket } from '../game/Players';
import { registerEvent } from './../socket-events';
import { handleGameEnd, isWinningMove, saveXPToDB } from '../game/GameEnd';
import { lobbies } from '../game/Lobbies';
import { applyGambittiKokousEffect, Effects, getEffect } from '../game/Effects';

type MoveEventParams = {
  to: Space;
};

registerEvent('move', (socket, move: MoveEventParams) => {
  const player = getPlayerBySocket(socket);
  if (!player) {
    console.log("[Move] Player doesn't exist");
    return;
  }
  if (!player.lobbyName) {
    console.log("[Move] Lobby doesn't exist");
    return;
  }

  const game = movePlayer(player, move.to);
  if (!game) {
    // console.log('[Move] Can not move');
    return;
  }

  console.log(
    `[Move] Player ${player.name} in ${player.lobbyName} moved to ${move.to.id}`
  );

  if (isWinningMove(player.lobbyName, move.to)) {
    io.in(player.lobbyName).emit('game-update', { game });

    io.in(player.lobbyName).emit('game-end', {
      winner: player,
    });

    getGame(player.lobbyName)?.log.commit({
      topic: 'End',
      player: player,
      content: 'Won the game with a move',
    });

    handleGameEnd(player, true);
    io.emit('lobbies-update', { lobbies });
    return;
  }

  // Gambittikokous
  const otherPlayers = game.players.filter((p) => p.uuid !== player.uuid);
  const playerInSpace = otherPlayers.find((p) => p.location.id === move.to.id);
  if (playerInSpace) {
    io.in(player.lobbyName).emit('effect', {
      effect: Effects.GAMBITTIKOKOUS,
      targets: [player, playerInSpace],
    });
    applyGambittiKokousEffect(
      getGamePlayer(game, player) as GamePlayer,
      playerInSpace
    );
  }

  const effect = getEffect(player.lobbyName, move.to);
  const gamePlayer = getGamePlayer(game, player);
  if (!gamePlayer) return;
  const currentEffects = [...gamePlayer.statusList];
  let canHaveEffect: boolean = false;

  if (effect) {
    // dont give bus to players who just had it
    canHaveEffect =
      effect.condition === undefined || effect.condition(gamePlayer);

    if (canHaveEffect) {
      io.in(player.lobbyName).emit('effect', {
        effect: {
          id: effect.id,
          name: effect.name,
          messageToAll: effect.messageToAll,
          messageToSelf: effect.messageToSelf,
        },
        discovery: {
          spaceId: move.to.id,
          effectId: effect.id,
        },
        targets: [player],
      });
    }
  }

  updateStatusList(gamePlayer);
  if (canHaveEffect) effect?.handler(gamePlayer);
  io.in(player.lobbyName).emit('game-update', { game });
});

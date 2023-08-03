import { IS_DEVELOPMENT_MODE } from './../development-mode';
import { isTelegramUuidInUse } from './../game/Players';
import { Player } from './../../shared/types.shared';
import { addPlayer, isPlayer } from '../game/Players';
import { registerEvent } from '../socket-events';
import { alertAdminsHtml, getTelegramIdFromCode } from '../telegram/bot';
import { isBanned } from '../telegram/admin-functions';
import { TelegramModel } from '../db';

registerEvent('init', async (socket, data, callback) => {
  const telegramCode = data.telegramCode;
  console.log('TELEGRAM CODE: ', telegramCode);

  // check if callback function is valid and exists
  if (!callback || typeof callback !== 'function') {
    console.log('Invalid callback function');
    alertAdminsHtml(
      `Invalid init callback function for player ${data.name} tg<code>${telegramCode}</code>`
    );
    return;
  }

  if (!telegramCode || !isPlayer(data)) {
    console.log('Invalid player data: ', data);
    // socket.disconnect();
    callback?.({ error: 'Invalid player data' });
    return;
  }

  if (data.name.length > 16) {
    callback?.({ error: 'Username is too long' });
    return;
  }

  const telegramId = getTelegramIdFromCode(telegramCode);
  console.log('TELEGRAM UUID: ', telegramId);

  if (!telegramId) {
    console.log('Invalid telegram code or something', data);
    // socket.disconnect();
    callback?.({ error: 'Invalid telegram code or something' });
    return;
  }

  if (isTelegramUuidInUse(telegramId)) {
    console.log('Telegram id already in use', data);
    // socket.disconnect();
    callback?.({ error: 'Telegram id already in use' });
    return;
  }

  /*  // Print referer and origin ip
  console.log(`RemoteAddress: ${socket.request.socket.remoteAddress}`);
  console.log(`localAddress: ${socket.request.socket.localAddress}`);
  console.log(`address() : ${socket.request.socket.address().toString()}`);*/

  const hasActiveBan = IS_DEVELOPMENT_MODE
    ? false
    : await isBanned(data.name, telegramId);

  if (hasActiveBan) {
    callback?.({ error: 'You are banned from the game :DD' });
    return;
  } else {
    console.log('Player is not banned');
  }

  const player: Player = {
    uuid: data.uuid,
    name: data.name,
    guild: data.guild,
    telegramUuid: telegramId,
  };
  const { success } = addPlayer(socket, player);

  if (!success) {
    console.log('Could not add player: ', player);
    callback?.({ error: 'Could not add player' });
    // socket.disconnect();
    return;
  }

  // Associate gamertag to telegram id
  TelegramModel.find({ telegramId: telegramId }, (err: any, docs: any[]) => {
    if (err) {
      console.log('Error getting telegram user from db: ', err);
      return;
    }
    if (docs.length > 0) {
      console.log(`Associating gamertag \'${player.name}\' to TG DB entry`);
      docs[0].gamerTag = player.name;
      docs[0].save();
      return;
    } else {
      console.log(
        "[Associate gamertag with tg] User's TG not registered yet (??)."
      );
    }
  });

  socket.emit('login-success', {
    uuid: player.uuid,
    name: player.name,
    guild: player.guild,
    telegramCode: telegramCode,
  });

  callback?.({ success: true });
  console.log('Player added: ', player);
});

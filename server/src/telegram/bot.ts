import { IS_DEVELOPMENT_MODE } from './../development-mode';
import { Context, NarrowedContext, Scenes, Telegraf } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { seededRandomNumber } from './helpers';
import getUuid from 'uuid-by-string';
import { TelegramModel } from '../db';
import {
  banPlayer,
  getAllBannedPlayers,
  getAssociatedTg,
  getGameLog,
  getGuildLog,
  getLatestGameLog,
  getTop10Performers,
  hardResetLobby,
  unbanPlayer,
} from './admin-functions';
import { resolve } from 'path';

type ContextType = NarrowedContext<
  Context<Update>,
  {
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
  }
>;
// TODO: hide this?
// DEV bot: @titeeni_testi_bot
// PROD bot: @titeeni_bot
const token = IS_DEVELOPMENT_MODE
  ? '6040784898:AAHKo8Vma-VmsOH0jhusb7_t_jI_gXDcZW4'
  : '6187670072:AAELk8xPgyy_l_2mmFrJxG568qe4uH6C9i0';
const bot = new Telegraf(token);
export type Bot = Telegraf<Context<Update>>;
console.log('Bot created');

const DEV_ADMIN_GROUP_ID = '-985940756';
const PROD_ADMIN_GROUP_ID = '-928025755';

const ADMIN_GROUP_IDS = new Set([
  DEV_ADMIN_GROUP_ID, // testi
  PROD_ADMIN_GROUP_ID, // prod
]);

const CURRENT_ADMIN_GROUP_ID = IS_DEVELOPMENT_MODE
  ? DEV_ADMIN_GROUP_ID
  : PROD_ADMIN_GROUP_ID;

export const isAdminGroup = (ctx: Context) => {
  if (ctx.chat?.id === undefined) return false;
  return ADMIN_GROUP_IDS.has(ctx.chat?.id.toString());
};
// // get current url
// bot.telegram.setWebhook('https://localhost:3086/secret-path');

/***********************
 * Registering
 **********************/
// telegramId, registeredCode
const REGISTERED_USERS = new Map<string, string>();

if (IS_DEVELOPMENT_MODE) {
  console.log("ADDING DEV TELEGRAM USER: 'dev' => 'dev12345'");
  REGISTERED_USERS.set('dev', 'dev12345');
}

export function getTelegramIdFromCode(code: string) {
  for (const [telegramId, registeredCode] of REGISTERED_USERS.entries()) {
    if (registeredCode === code) {
      return telegramId;
    }
  }
  return undefined;
}
/*************************
 * Bot actions
 *************************/

bot.command('start', async (ctx) => {
  console.log('start');
  const telegramId = ctx.from.id.toString();

  const telegramUuid = getUuid(telegramId, 5);

  const randomCode = getUuid(telegramUuid, 5).substring(0, 8);

  REGISTERED_USERS.set(telegramUuid, `${randomCode}`);
  console.log('ADDING ', telegramUuid, ' => ', randomCode);
  console.log(REGISTERED_USERS);

  // Add to DB aswell
  // chekc that code is not already in db
  TelegramModel.find({ telegramId: telegramUuid }, (err: any, docs: any[]) => {
    if (err) {
      console.log('Error getting telegram user from db: ', err);
      return;
    }
    if (docs.length > 0) {
      console.log('User TG already registered. Proceeding');
      return;
    } else {
      console.log('User not registered yet, adding to DB and proceeding.');
      new TelegramModel({
        telegramId: telegramUuid,
        registeredCode: `${randomCode}`,
        admin: false,
      }).save();
    }
  });

  // ctx.reply(`Your login code is: ${randomCode}`);
  // reply with html messaeg with bold and large code on own line
  await ctx.replyWithHTML(`Your login code is: 

  <b><code>${randomCode}</code></b>
  
  ↑ copy (or click to copy) ↑
  `);
});

// simple hello hommand
bot.command('hello', async (ctx) => {
  console.log('hello2');
  ctx.reply('Hello2!');
  console.log(ctx.update.message.text);
  console.log(ctx.update.message.chat);
});

/*************************
 * ADMIN Bot actions
 *************************/
bot.command('clear', async (ctx) => {
  console.log('Telegram: /clear');

  if (isAdminGroup(ctx) === false) {
    ctx.reply('Not admin group');
    return;
  }

  const roomNameArg = getFirstArg(ctx.update.message.text);
  if (!roomNameArg) {
    ctx.reply('No room number given');
    return;
  }

  const res = hardResetLobby('room_' + roomNameArg);
  ctx.reply('Response: ' + res);
});

bot.command('ban', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const name = handleGetFirstArg(ctx);
  if (!name) return;

  const res = await banPlayer(name);
  ctx.reply('Banned: ' + JSON.stringify(res));
});

bot.command('unban', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const name = handleGetFirstArg(ctx);
  if (!name) return;

  const res = await unbanPlayer(name);
  ctx.reply('Unbanned: ' + JSON.stringify(res));
});

bot.command('banTg', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const telegramId = handleGetFirstArg(ctx);
  if (!telegramId) return;

  banPlayer(undefined, telegramId)
    .then((res) => {
      ctx.replyWithHTML(
        'Banned  tg: ' +
          `<code>${
            (res as { telegramId: string; banned: boolean; gamerTag: string })
              .telegramId
          }</code>`
      );
    })
    .catch((err) => {
      ctx.replyWithHTML('Error banning tg: ' + `<code>${err}</code>`);
    });
});

bot.command('unbanTg', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const telegramId = handleGetFirstArg(ctx);
  if (!telegramId) return;

  unbanPlayer(undefined, telegramId)
    .then((res) => {
      ctx.replyWithHTML(
        'Unbanned  tg: ' +
          `<code>${
            (res as { telegramId: string; banned: boolean; gamerTag: string })
              .telegramId
          }</code>`
      );
    })
    .catch((err) => {
      ctx.replyWithHTML('Error banning tg: ' + `<code>${err}</code>`);
    });
});

bot.command('listBanned', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const res = await getAllBannedPlayers();
  ctx.reply(
    `Banned:\n\n${res
      .map((r: any) =>
        r.gamerTag ? `name: ${r.gamerTag}` : `tg: ${r.telegramId}`
      )
      .join('\n')}`
  );
});

bot.command('listBannedRaw', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const res = await getAllBannedPlayers();
  ctx.reply('Banned players: ' + JSON.stringify(res));
  ctx.reply(`Names: ${res.map((r: any) => r?.gamerTag).join(', ')}`);
});

bot.command('getTop10', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  getTop10Performers()
    .then((res) => {
      ctx.reply(
        `Top 10 performances:\n\n${res
          .map(
            (r: any) => `${r.guildName} - ${r.playerName} - ${r.pointsDelta}`
          )
          .join('\n')}`
      );
    })
    .catch((err) => {
      ctx.reply('Error getting top 10: ' + err);
    });
});

bot.command('getLatestGameLog', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const name = handleGetFirstArg(ctx);
  if (!name) return;

  getLatestGameLog(name)
    .then((res) => {
      let response = `Latest game log for ${name}:\n\n${
          (res as {gameId:string, log:string}[]).map((r:{gameId:string, log:string}) => `<code>${r.gameId}</code>\n${r.log}`).join('\n')
      }`
      ctx.replyWithHTML(response);
    })
    .catch((err) => {
      ctx.reply('Error getting latest game log: ' + err);
    });
});

bot.command('getGameLog', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const name = handleGetFirstArg(ctx);
  if (!name) return;

  getGameLog(name)
    .then((res) => {
      ctx.replyWithHTML(`Game log for <code>${name}</code>:\n\n${res}`);
    })
    .catch((err) => {
      ctx.reply('Error getting game log: ' + err);
    });
});

bot.command('getGuildLog', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const guildName = handleGetFirstArg(ctx);
  if (!guildName) return;

  getGuildLog(guildName)
    .then((res) => {
      let response = `Guild log for <code>${guildName}</code>:
<b>XP</b> - <b>Player</b> - <b>Game ID</b>
----------------------
${(res as { name: string; points: number; gameId: string }[])
  .map(
    (r: { name: string; points: number; gameId: string }) =>
      `${r.points} - <code>${r.name}</code> - <code>${r.gameId}</code>`
  )
  .join('\n')}
`;
      ctx.replyWithHTML(response);
    })
    .catch((err) => {
      ctx.reply('Error getting guild log: ' + err);
    });
});

bot.command('getAssociatedTg', async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  const name = handleGetFirstArg(ctx);
  if (!name) return;

  getAssociatedTg(name)
    .then((res) => {
      ctx.replyWithHTML(`Associated tg for ${name}:\n<code>${res}</code>`);
    })
    .catch((err) => {
      ctx.reply('Error getting associated tg: ' + err);
    });
});

bot.command(['admin', 'help'], async (ctx) => {
  if (!handleAdminCheck(ctx)) return;

  ctx.reply(`Admin commands:

/listBanned
/listBannedRaw
/ban <name>
/unban <name>
/banTg <tgId>
/unbanTg <tgId>
/getTop10 (gets top 10 performances)
/getLatestGameLog <gamerTag>
/getGameLog <game id>
/getGuildLog <guild name>
/getAssociatedTg <gamerTag>
  `);
});

// TODO: removePointsFromGuild <points> <guildName>

/*********************
 *  HELPERS
 *********************/

function handleAdminCheck(ctx: ContextType) {
  console.log('Command: ', ctx.update.message.text);
  if (isAdminGroup(ctx) === false) {
    ctx.reply('Not admin');
    return false;
  }
  return true;
}

function handleGetFirstArg(ctx: ContextType) {
  const args = ctx.update.message.text.split(' ') ?? [];
  if (args.length < 2) {
    ctx.reply('No args given');
    return;
  }
  return args.at(1);
}

function getFirstArg(text: string) {
  const args = text.split(' ') ?? [];
  return args.at(1);
}

// Stateless start using db
export const startTelegramBot = () => {
  // Before launching, populate the registered users map from the database
  TelegramModel.find({}, (err: any, docs: any[]) => {
    if (err) {
      console.log('Error getting telegram users from db: ', err);
      return;
    }
    for (const doc of docs) {
      REGISTERED_USERS.set(doc.telegramId, doc.registeredCode);
      console.log(
        'ADDING ',
        doc.telegramId,
        ' => ',
        doc.registeredCode,
        ' FROM DB to stateful TG bot'
      );
    }
  });

  console.log('Starting bot with token: ', token);
  bot.launch();
};

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

export function alertAdmins(message: string) {
  bot.telegram.sendMessage(CURRENT_ADMIN_GROUP_ID, message);
}

export function alertAdminsHtml(htmlMessage: string) {
  bot.telegram.sendMessage(CURRENT_ADMIN_GROUP_ID, htmlMessage, {
    parse_mode: 'HTML',
  });
}

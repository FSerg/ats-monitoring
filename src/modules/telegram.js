import TelegramBot from 'node-telegram-bot-api';
import Agent from 'socks5-https-client/lib/Agent';
import config from '../config/config';

const bot = new TelegramBot(config.tg_token, {
  polling: true,
  request: {
    agentClass: Agent,
    agentOptions: {
      socksHost: config.tg_proxy_host,
      socksPort: parseInt(config.tg_proxy_port, 10),
      socksUsername: config.tg_proxy_login,
      socksPassword: config.tg_proxy_pass
    }
  }
});

const SendMessage = text => {
  bot.sendMessage(config.tg_chatid, text).catch(error => {
    console.log(error);
  });
};

export default SendMessage;

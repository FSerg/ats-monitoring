import Telegram from 'telegram-bot-api';
import config from '../config/config';

const api = new Telegram({
  token: config.tg_token,
  http_proxy: {
    host: config.tg_proxy_host,
    port: config.tg_proxy_port,
    username: config.tg_proxy_login,
    password: config.tg_proxy_pass,
    https: true
  },
  updates: {
    enabled: true,
    get_interval: 2000
  }
});

const SendMessage = text => {
  api
    .sendMessage({
      chat_id: config.tg_chatid,
      text
    })
    .catch(err => {
      console.log(err);
    });
};

export default SendMessage;

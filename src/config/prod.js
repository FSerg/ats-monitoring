module.exports = {
  port: process.env.PORT || 5000,
  ami_port: process.env.AMI_PORT,
  ami_host: process.env.AMI_HOST,
  ami_login: process.env.AMI_LOGIN,
  ami_pass: process.env.AMI_PASS,
  mikro_host: process.env.MIKRO_HOST,
  mikro_login: process.env.MIKRO_LOGIN,
  mikro_pass: process.env.MIKRO_PASS,
  timeout: process.env.TIMOUT || '5000',
  tg_token: process.env.TG_TOKEN,
  tg_chatid: process.env.TG_CHATID,
  tg_proxy_host: process.env.TG_PROXY_HOST,
  tg_proxy_port: process.env.TG_PROXY_PORT,
  tg_proxy_login: process.env.TG_PROXY_LOGIN,
  tg_proxy_pass: process.env.TG_PROXY_PASS
};

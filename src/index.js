import AMI from 'asterisk-manager';
import express from 'express';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import config from './config/config';
import ResetSip from './modules/mikrotik';
import SendMessage from './modules/telegram';

const app = express();
const ami = new AMI(
  config.ami_port,
  config.ami_host,
  config.ami_login,
  config.ami_pass,
  true
);
ami.keepConnected();

const adapter = new FileSync('log.json');
const db = low(adapter);
// Set some defaults
db.defaults({ log: [] }).write();
let TimeOfLastChanges = new Date();
const TimeoutMs = parseInt(config.timeout, 10);

ami.on('disconnect', () => {
  console.log('ATS disconnected!');
});

ami.on('connect', () => {
  console.log('==========================================================');
  console.log('ATS connected!');
});

const FixRegistration = res => {
  console.log(`Start fixing after ${TimeoutMs} ms`);
  TimeOfLastChanges = new Date();

  ResetSip((err, result) => {
    if (err) {
      res.status(404).send({ result: err });
    }
    res.send({ result });
  });
};

ami.on('peerstatus', evt => {
  if (!evt.peer.includes('PROVIDER')) {
    return;
  }

  console.log('PeerStatus!');
  console.log(evt);

  db.get('log')
    .push({ timestamp: new Date(), provider: evt.peer, status: evt.peerstatus })
    .write();

  if (evt.peerstatus === 'Registered' || evt.peerstatus === 'Reachable') {
    return;
  }

  const TimeOfCurrentChanges = new Date();
  const DiffMs = parseInt(TimeOfCurrentChanges - TimeOfLastChanges);
  console.log('DiffMs: ', DiffMs);
  if (DiffMs < TimeoutMs) {
    console.log(`Status changed less than ${DiffMs} ms ago`);
    return;
  }

  console.log('FIX PROVIDER REGISTRATION!');
  TimeOfLastChanges = new Date();
  SendMessage(
    `Пропала регистрация провайдера телефонии:\n${evt.peer}\nстатус: ${
      evt.peerstatus
    }`
  );

  setTimeout(() => {
    ResetSip((err, result) => {
      if (err) {
        console.log('Send error to telegram', err);
        SendMessage(
          `Ошибка при попытке сбросить регистрации провайдеров в роутере:\n${err}`
        );
      }
      SendMessage('Регистрации провайдеров в роутере успешно сброшены!');
    });
  }, TimeoutMs);
});

app.get('/reset', (req, res) => {
  // FixRegistration(res);
  console.log('GET reset conmand');
  setTimeout(() => {
    FixRegistration(res);
  }, TimeoutMs);
});

app.listen(config.port, () => {
  console.log(`Server started (port: ${config.port})`);
});

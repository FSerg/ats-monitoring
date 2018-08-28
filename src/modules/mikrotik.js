import API from 'mikronode';
import config from '../config/config';

const device = new API(config.mikro_host);
const ResetSip = callback => {
  device
    .connect()
    .then(([login]) => login(config.mikro_login, config.mikro_pass))
    .then(conn => {
      console.log('Mikrotik connected');
      conn.closeOnDone(true);
      const actionChannel = conn.openChannel();
      actionChannel.sync(true);

      // These will run synchronsously
      actionChannel.write('/system/script/run', { '.id': 'sip_reset' });
      actionChannel.on('done', () => {
        console.log('Mikrotik run script: success!');
        actionChannel.close();
        callback(null, 'done');
      });

      actionChannel.on('trap', trap => {
        console.log('Mikrotik run script trap: ', trap);
        callback(trap);
      });

      actionChannel.on('error', error => {
        console.log('Mikrotik run script error: ', error);
        callback(error);
      });

      actionChannel.close(); // The above commands will complete before this is closed.
    });
};

export default ResetSip;

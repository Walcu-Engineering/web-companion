'use strict';
const path       = require('path');
const express    = require('express');
const bodyParser = require('body-parser');
const getSystemData = require('./getSystemData');

process.on('unhandledRejection', (reason, p) => {
  console.error('Error: Unhandled Rejection at:', p, '\nReason:', reason);
});

const init = async () => {
  const { mfetch, MAPI_URL, MAPPEX_URL, debug } = await getSystemData();

  const app = express();
  app.use(bodyParser.json());
  app.set('trust proxy', true);

  app.get('/health', (_, res) => {
    res.status(200).send('OK');
  });

  app.use('/', require('./server/routes/index.js')({ mfetch, MAPI_URL, MAPPEX_URL, debug }));
  app.use('/', express.static(path.join(__dirname, 'client')));

  const PORT = process.env.PORT;
  if (!PORT) throw new Error('PORT environment variable is not defined');

  app.listen(PORT, () => {
    debug('web-companion listening on port %s', PORT);
    console.log('web-companion started and listening on port %s', PORT);
  });
};

init();

const express = require('express');
const { join } = require('path');

const app = express();
const PORT = 3001;

app.use(express.static(join(__dirname, 'public')));

// Serve SDKs directly from packages/ so no manual copying is needed
app.use('/js/CallWidget.js', express.static(join(__dirname, '../../packages/sdk-call/CallWidget.js')));
app.use('/js/UICallWidget.js', express.static(join(__dirname, '../../packages/sdk-ui/UICallWidget.js')));

app.listen(PORT, () => {
  console.log(`coches.net clone running at http://localhost:${PORT}`);
});

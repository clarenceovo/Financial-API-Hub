const express = require('express');
const helmet = require("helmet");
const cors = require('cors');
const port = 3000
const app = express();
/* Declare necessary module and applications */
app.use(require('./router/routeController'))
app.use(cors());
app.use(helmet({
    referrerPolicy: { policy: "no-referrer" },
  }));
app.listen(3000, () => console.log(`App listening on port 3000`))
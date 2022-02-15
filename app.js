const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const helmet = require("helmet");
const cors = require('cors');
const port = 9888
const app = express();
app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
/* Declare necessary module and applications */
app.use(require('./router/routeController'))
app.use(cors());
app.use(helmet({
    referrerPolicy: { policy: "no-referrer" },
  }));
app.listen(port, () => console.log(`App listening on port:`+port))

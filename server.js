import debug from 'debug';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import sharify from 'sharify';
import mongo from './lib/mongo';

// Middleware
import locals from './middleware/locals';
import assets from './middleware/assets';

// Apps
import cities from './apps/cities';
import places from './apps/places';

const app = express();
const { PORT } = process.env;
const port = PORT || 5000;

app
  // Configuration
  .set('view engine', 'jade')

  // Middleware
  .use(sharify)
  .use(locals)
  .use(assets)
  .use(morgan('combined'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))

  // Apps
  .use(express.static('public'))
  .use(cities)
  .use(places)

  // Root
  .get('/', (req, res) => {
    res.render('index');
  });

Promise.all([
  mongo.start(),
  new Promise(resolve => {
    app.listen(port, resolve);
  })
]).then(() => {
  debug('info')(`Listening on ${port}`);
});

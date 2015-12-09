import express from 'express';
import page from '../../middleware/page';
import City from '../../schema/city';

const app = express();

app
  .set('views', `${__dirname}/views`)

  .use((req, res, next) => {
    res.locals.sd.APP = 'cities';
    next();
  })

  // Index
  .get('/cities', page('index'), (req, res, next) => {
    City.find({}).sort({ sort_key: 1 }).exec()
      .then(cities => {
        res.render('index', {
          cities: cities
        });
      }, next);
  })

  // New
  .get('/cities/new', page('new'), (req, res) => {
    res.render('new');
  })

  // Create
  .post('/cities', (req, res, next) => {
    City.create(req.body, (err, city) => {
      if (err) return next(err);
      res.send(city);
    });
  })

  // Show
  .get('/cities/:id', page('show'), (req, res, next) => {
    City.findOne({ _id: req.params.id }).exec()
      .then(city => {
        res.locals.sd.CITY = city;
        res.render('show', {
          city: city
        });
      }, next);
  })

  // Update
  .post('/cities/:id', (req, res, next) => {
    City.findByIdAndUpdate(req.body._id, { $set: req.body }, (err, city) => {
      if (err) return next(err);
      res.send(city);
    });
  })

export default app;

import express from 'express';
import page from '../../middleware/page';
import Place from '../../schema/place';

const app = express();

app
  .set('views', `${__dirname}/views`)

  .use((req, res, next) => {
    res.locals.sd.APP = 'places';
    next();
  })

  // Index
  .get('/places', page('index'), (req, res, next) => {
    Place.find({}).sort({ sort_key: 1 }).exec()
      .then(places => {
        res.render('index', {
          places: places
        });
      }, next);
  })

  // New
  .get('/places/new', page('new'), (req, res) => {
    res.render('new');
  })

  // Create
  .post('/places', (req, res, next) => {
    Place.create(req.body, (err, place) => {
      if (err) return next(err);
      res.send(place);
    });
  })

  // Update
  .post('/places/:id', (req, res, next) => {
    Place.findByIdAndUpdate(req.body._id, { $set: req.body }, (err, place) => {
      if (err) return next(err);
      res.send(place);
    });
  })

  // Show / Edit
  .get('/places/:id', page('show'), (req, res, next) => {
    Place.findOne({ _id: req.params.id }).exec()
      .then(place => {
        res.locals.sd.PLACE = place;
        res.render('show', {
          place: place
        });
      }, next);
  })

  // Destroy
  .delete('/places/:id', (req, res, next) => {
    Place.findByIdAndRemove(req.params.id, (err) => {
      if (err) return next(err);
      res.send('/places');
    });
  });

export default app;

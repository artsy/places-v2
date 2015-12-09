import { default as mongoose, Schema } from 'mongoose';
import slug from 'mongoose-slug';

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  coordinates: [{
    lat: Number,
    lng: Number
  }],
  featured: {
    type: Boolean,
    default: false
  }
});

schema.plugin(slug('name'));

export default mongoose.model('Place', schema);

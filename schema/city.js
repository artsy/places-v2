import { default as mongoose, Schema } from 'mongoose';
import slug from 'mongoose-slug';

const schema = new Schema({
  name: {
    type: String,
    required: true
  },
  sort_key: {
    type: Number,
    default: 1000,
    required: true
  },
  coordinates: {
    lat: Number,
    lng: Number
  },
  featured: {
    type: Boolean,
    default: false
  }
});

schema.plugin(slug('name'));

export default mongoose.model('City', schema);

import MongoConnection from './mongo_connection';
const { MONGOLAB_URI } = process.env;

export default new MongoConnection(MONGOLAB_URI);

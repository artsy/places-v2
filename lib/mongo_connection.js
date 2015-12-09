import debug from 'debug';
import mongoose from 'mongoose';

class MongoConnection {
  constructor(uri) {
    this.uri = uri;
  }

  connect() {
    return mongoose.connect(this.uri, {
      server: {
        socketOptions: {
          keepAlive: 1
        }
      }
    });
  }

  start() {
    mongoose.connection.on('error', debug('error'));
    mongoose.connection.on('disconnected', this.connect.bind(this));
    let connection = new Promise(resolve => {
      mongoose.connection.once('open', resolve);
    });
    this.connect();
    return connection;
  }
};

export default MongoConnection;

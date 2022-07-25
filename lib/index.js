const mime = require('mime-types');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const log = require('../utils/log');

class GridfsPipe {
  constructor() {
    this.gridFs = null;
    this.connection = null;
  }
  connect({ DB_URL }) {
    return new Promise((resolve) => {
      log('Waiting for the connection ......')
      log(DB_URL);
      const conn = mongoose.createConnection(DB_URL);
      this.connection = conn;
      conn.once('open', () => {
        this.gridFs = Grid(conn.db, mongoose.mongo);
        log('=========== Connection succeeded. ========')
        resolve();
      })
    })
  }
  upload({ file, filename, id }) {
    return new Promise((resolve, reject) => {
      const contentType = mime.lookup(filename);
      const options = {
        content_type: contentType,
        filename: filename
      }
      if (id)
        options._id = id;

      const writeStream = this.gridFs.createWriteStream(options)
      writeStream.on('close', (file) => {
        const info = JSON.stringify(file);
        log(info);
        resolve(file)
      })
      file.pipe(writeStream)
    })
  }
  download({ id }) {
    return new Promise((resolve, reject) => {
      this.gridFs.findOne({ _id: id }, (err, file) => {
        if (err) {
          reject({ err, status: 400 })
        }
        else if (!file) {
          reject({
            err: 'Error on the database looking for the file.',
            status: 404
          })
        }
        const readstream = this.gridFs.createReadStream({
          _id: id
        });
        resolve({
          readstream,
          file
        })

      })
    })
  }
}

module.exports = new GridfsPipe;

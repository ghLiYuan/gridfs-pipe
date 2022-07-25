# gridfs-pipe
a tool for upload download mongodb gridfs.

## Installation
```sh
$ npm install gridfs-pipe
```

## Usage
```javascript
const gridfsPipe = require('gridfs-pipe');
gridfsPipe.connect({
  DB_URL: ''
}).then(() => {
  /*
  const testFile = path.resolve(__dirname, './test.png');
  gridfsPipe.upload({
    file: fs.createReadStream(testFile),
    filename: 'test.png',
    id: 'test.png'
  })
   */
  
  /*
  gridfsPipe.download({
    id: _id
  })
  */
})
```

const gridfsPipe = require('../lib/index');
const fs = require('fs');
const path = require('path');

gridfsPipe.connect({
  DB_URL: 'mongodb://172.30.240.90:27016/portal'
}).then(async () => {
  const testFile = path.resolve(__dirname, './test.png');
  const { _id } = await gridfsPipe.upload({
    file: fs.createReadStream(testFile),
    filename: 'test.png',
    id: 'test.png'
  })
  const { readstream, file: { filename } } = await gridfsPipe.download({
    id: _id
  })
  const downloadTestFile = path.resolve(__dirname, `./download/${filename}`);
  fs.writeFile(downloadTestFile, '', (err) => {
    if (err) {
      console.log(err)
      return;
    }
    const ws = fs.createWriteStream(downloadTestFile)
    readstream.pipe(ws);
  })
})

const zlib = require('zlib');
const json = require('./test-event-unzipped.json');
const fs = require('fs');

(async () => {
  const val = await zip(JSON.stringify(json));
  fs.writeFileSync(`./test-event.json`, JSON.stringify({
    awsLogs: {
      data: val.toString('base64')
    }
  }, null, 2));
})();

async function zip(payload) {
  return new Promise((resolve, reject) => {
    zlib.gzip(payload, (e, result) => {
      if (e) {
        reject(e);
      } else {
        resolve(result);
      }
    });
  });
}
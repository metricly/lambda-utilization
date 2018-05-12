import * as Lambda from 'aws-lambda';
import * as AWS from 'aws-sdk';

// tslint:disable-next-line:no-var-requires
const zlib = require('zlib');

exports.handler = async (input: Lambda.CloudWatchLogsEvent, context: Lambda.Context) => {
  const payload = new Buffer(input.awslogs.data, 'base64');
  try {
    const result = await unzip(payload);
    const data: any = JSON.parse(result.toString('ascii'));
    const functionName = data.logGroup.split('/').pop();
    const version = /\[(.*)\]/g.exec(data.logStream)[1];
    const metrics = data.logEvents.map((event) => {
      const matches = /Memory Size: ([0-9].+) MB\tMax Memory Used: ([0-9].+)MB/g.exec(event.message);
      return {
        billed: parseInt(matches[1], 10),
        used: parseInt(matches[2], 10)
      };
    });
    console.log(`Function Name: ${functionName}`);
    console.log(`Version: ${version}`);
    console.log(`Metrics: ${JSON.stringify(metrics, null, 2)}`);
    context.done();
  } catch (e) {
    context.fail(e);
  }
};

async function unzip(payload: Buffer): Promise<any> {
  return new Promise((resolve, reject) => {
    zlib.gunzip(payload, (e, result) => {
      if (e) {
        reject(e);
      } else {
        resolve(result);
      }
    });
  });
}

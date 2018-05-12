import * as Lambda from 'aws-lambda';
import * as AWS from 'aws-sdk';

// tslint:disable-next-line:no-var-requires
const zlib = require('zlib');

exports.handler = (input: Lambda.CloudWatchLogsEvent, context: Lambda.Context) => {
  const payload = new Buffer(input.awslogs.data, 'base64');
  zlib.gunzip(payload, (e, result) => {
    if (e) {
      context.fail(e);
    } else {
      result = JSON.parse(result.toString('ascii'));
      console.log('Event Data:', JSON.stringify(result, null, 2));
      context.done();
    }
  });
};

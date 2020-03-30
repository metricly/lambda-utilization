import { OutputLogEvent } from 'aws-sdk/clients/cloudwatchlogs';

import logger from '../config/Logger';
import { Sample } from '../model/Sample';

export class ParsingService {

  // tslint:disable-next-line
  private static REPORT_PATTERN = 'Billed Duration: ([0-9].+) ms\tMemory Size: ([0-9].+) MB\tMax Memory Used: ([0-9].+) MB';
  private static VERSION_PATTERN = '\\[(.*)\\]';

  /**
   * Parse an array of CloudWatch logs and return an array of Lambda metric samples
   */
  public parseLogs(logs: OutputLogEvent[]): Sample[] {
    return logs.reduce((allSamples, log) => {
      try {
        const version = new RegExp(ParsingService.VERSION_PATTERN).exec((log as any).logStreamName)[1];
        const matches = new RegExp(ParsingService.REPORT_PATTERN).exec(log.message);
        const billedMs = parseFloat(matches[1]);
        const billedMemory = parseFloat(matches[2]);
        const usedMemory = parseFloat(matches[3]);
        const samples = [
          new Sample('aws.lambda.memory.utilization', log.timestamp, 100 * usedMemory / billedMemory, version),
          new Sample('aws.lambda.billed', log.timestamp, (billedMemory / 1024) * (billedMs / 1000), version)
        ];
        return allSamples.concat(samples);
      } catch (e) {
        logger.error(`Error parsing log line: ${e.message}`);
        return allSamples;
      }
    }, []);
  }
}

export default new ParsingService();

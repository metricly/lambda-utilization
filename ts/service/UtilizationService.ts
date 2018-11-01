import cloudWatchService from './CloudWatchService';
import metriclyService from './MetriclyService';
import parsingService from './ParsingService';

import logger from '../config/Logger';

export class UtilizationService {

  public async calculate(
      invokedArn: string,
      functionNames: string[],
      endTime: number,
      durationMs: number): Promise<void> {
    await Promise.all(functionNames.map(async (functionName) => {
      try {
        logger.debug(`Starting collection for function ${functionName}`);
        const logs = await cloudWatchService.fetchLogs(functionName, endTime, durationMs, null);
        logger.debug(`Collected ${logs.length} logs for function ${functionName}`);
        if (logs.length !== 0) {
          const samples = parsingService.parseLogs(logs);
          logger.debug(`Parsed ${samples.length} samples for function ${functionName}`);
          await metriclyService.submitSamples(invokedArn, functionName, samples);
          logger.debug(`Submitted samples for function ${functionName}`);
        }
      } catch (e) {
        logger.error('Error parsing and posting logs', e);
      }
    }));
  }

}

export default new UtilizationService();

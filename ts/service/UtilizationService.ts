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
        const logs = await cloudWatchService.fetchLogs(functionName, endTime, durationMs, null);
        if (logs.length !== 0) {
          const samples = parsingService.parseLogs(logs);
          await metriclyService.submitSamples(invokedArn, functionName, samples);
        }
      } catch (e) {
        logger.error('Error parsing and posting logs', e);
      }
    }));
  }

}

export default new UtilizationService();

import cloudWatchService from './CloudWatchService';
import parsingService from './ParsingService';

export class UtilizationService {

  public async calculate(functionNames: string[], endTime: number, durationMs: number): Promise<void> {
    await Promise.all(functionNames.map(async (functionName) => {
      try {
        const logs = await cloudWatchService.fetchLogs(functionName, endTime, durationMs);
        if (logs.length !== 0) {
          const samples = parsingService.parseLogs(logs);
          await cloudWatchService.postCloudWatchMetrics(functionName, samples);
        }
      } catch (e) {
        console.error('Error parsing and posting logs', e);
      }
    }));
  }

}

export default new UtilizationService();

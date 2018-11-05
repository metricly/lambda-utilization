import * as AWS from 'aws-sdk';
import { OutputLogEvent } from 'aws-sdk/clients/cloudwatchlogs';

export class CloudWatchService {

  private cloudWatchClient = new AWS.CloudWatch();
  private cloudWatchLogsClient = new AWS.CloudWatchLogs();

  /**
   * Fetch CloudWatch logs for the given function filtered by REPORT.
   * Logs are fetched for one period back as logs take a few moments to populate in CloudWatch.
   */
  public async fetchLogs(
      functionName: string,
      endTime: number,
      durationMs: number,
      nextToken: string): Promise<OutputLogEvent[]> {
    const response = await this.cloudWatchLogsClient.filterLogEvents({
      endTime: endTime - durationMs,
      logGroupName: `/aws/lambda/${functionName}`,
      filterPattern: 'REPORT ',
      startTime: endTime - 2 * durationMs,
      nextToken
    }).promise();
    if (response.nextToken) {
      const additionalEvents = await this.fetchLogs(functionName, endTime, durationMs, response.nextToken);
      return response.events.concat(additionalEvents);
    }
    return response.events;
  }
}

export default new CloudWatchService();

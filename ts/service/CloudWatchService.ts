import * as AWS from 'aws-sdk';
import { OutputLogEvent } from 'aws-sdk/clients/cloudwatchlogs';
import { Sample } from '../model/Sample';

export class CloudWatchService {

  private cloudWatchClient = new AWS.CloudWatch();
  private cloudWatchLogsClient = new AWS.CloudWatchLogs();

  /**
   * Fetch CloudWatch logs for the given function filtered by REPORT.
   * Logs are fetched for one period back as logs take a few moments to populate in CloudWatch.
   */
  public async fetchLogs(functionName: string, endTime: number, durationMs: number): Promise<OutputLogEvent[]> {
    const response = await this.cloudWatchLogsClient.filterLogEvents({
      endTime: endTime - durationMs,
      logGroupName: `/aws/lambda/${functionName}`,
      filterPattern: 'REPORT ',
      startTime: endTime - 2 * durationMs
    }).promise();
    return response.events;
  }

  /**
   * Post samples from the parsed Lambda logs to CloudWatch.
   *
   * This will be replaced by posting data to Metricly.
   */
  public async postCloudWatchMetrics(functionName: string, samples: Sample[]) {
    return await this.cloudWatchClient.putMetricData({
      MetricData: samples.map((sample) => {
        return {
          Dimensions: [{
            Name: 'Version',
            Value: sample.version
          }, {
            Name: 'Function',
            Value: functionName
          }],
          MetricName: sample.metric,
          Timestamp: new Date(sample.date),
          Value: sample.value
        };
      }),
      Namespace: 'Metricly'
    }).promise();
  }
}

export default new CloudWatchService();

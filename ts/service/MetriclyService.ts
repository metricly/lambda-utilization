import * as request from 'request-promise';
import { Sample } from '../model/Sample';
import AWSUtils from '../util/AWSUtils';

import logger from '../config/Logger';

export class MetriclyService {

  private static API_KEY = process.env.METRICLY_API_KEY;
  private static API_ENDPOINT = process.env.METRICLY_ENDPOINT || 'https://api.app.metricly.com';

  public async submitSamples(arn: string, functionName: string, samples: Sample[]): Promise<void> {
    if (!MetriclyService.API_KEY) {
      throw new Error(`The Metricly API key is not configured. Please add the METRICLY_API_KEY environment variable.`);
    }
    const metrics: any[] = [...new Set(samples.map((sample) => sample.metric))].map((metricName) => {
      return {
        id: metricName,
        tags: [{
          name: 'utilization',
          value: metricName.includes('utilization')
        }]
      };
    });
    try {
      await request.post(`${MetriclyService.API_ENDPOINT}/ingest/${MetriclyService.API_KEY}`, {
        body: [{
          id: AWSUtils.constructFunctionFqn(arn, functionName),
          name: functionName,
          metrics,
          samples: samples.map((sample) => {
            return {
              metricId: sample.metric,
              timestamp: sample.date,
              val: sample.value
            };
          }),
          type: 'Lambda'
        }],
        json: true,
        simple: true // Simple=true causes non-2xx responses to throw an error
      }).promise();
    } catch (e) {
      logger.error(`Error posting to Metricly`, e);
      throw e;
    }
  }
}

export default new MetriclyService();

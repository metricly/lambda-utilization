import * as r2 from 'r2';
import { Sample } from '../model/Sample';
import AWSUtils from '../util/AWSUtils';

import logger from '../config/Logger';

export class MetriclyService {

  private static API_KEY = process.env.METRICLY_API_KEY;
  private static API_ENDPOINT = process.env.METRICLY_ENDPOINT || 'https://api.app.metricly.com';

  public async submitSamples(arn: string, functionName: string, samples: Sample[]): Promise<void> {
    if (!MetriclyService.API_KEY) {
      logger.warn(`The Metricly API key is not configured. Please add the METRICLY_API_KEY environment variable.`);
      return;
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
    const response = await r2.post(`${MetriclyService.API_ENDPOINT}/ingest/${MetriclyService.API_KEY}`, {
      json: [{
        id: AWSUtils.constructFunctionFqn(arn, functionName),
        name: functionName,
        metrics,
        samples: samples.map((sample) => {
          return {
            metricId: sample.metric,
            timestamp: sample.date,
            val: sample.value
          };
        })
      }]
    }).response;
    if (response.status !== 202) {
      const json = await response.json();
      logger.error(`Error posting samples to Metricly (status ${response.status}): ${json.detail}`);
    }
  }
}

export default new MetriclyService();

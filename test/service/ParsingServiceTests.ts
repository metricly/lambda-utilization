import { expect } from 'chai';
import 'mocha';

import service from '../../ts/service/ParsingService';

import * as logs from '../resources/logs.json';

describe('ParsingService', () => {

  it('should parse samples from logs', async () => {
    // when
    const samples = service.parseLogs(logs as any);

    // then
    expect(samples).to.have.lengthOf(2);
    expect(samples.map((sample) => sample.metric)).to.include('metricly.aws.lambda.billed');
    expect(samples.map((sample) => sample.value)).to.include(1.4);
  });
});

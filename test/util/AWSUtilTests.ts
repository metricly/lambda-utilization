import { expect } from 'chai';
import 'mocha';

import AWSUtils from '../../ts/util/AWSUtils';

describe('AWSUtils', () => {

  it('should construct a Metricly FQN', async () => {
    // given
    const arn = 'arn:aws:lambda:us-east-1:123456789012:function:lambda-utilization';
    const functionName = 'other-function';

    // when
    const fqn = AWSUtils.constructFunctionFqn(arn, functionName);

    // then
    expect(fqn).to.be.equal(`123456789012:Lambda:us-east-1:other-function`);
  });
});

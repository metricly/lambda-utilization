# Lambda Utilization

## Setup

### Lambda

Run the following:
```
yarn install
yarn run build
yarn run zip
```

You will get a local zip. Upload this to AWS Lambda with an execution role which has CloudWatch Full Access. Configure it with 128 MB of RAM.

### CloudWatch Log Stream

On your new Lambda function create a CloudWatch Log trigger. Hook up which Lambda function you want to monitor, name the log stream `Metricly-Lambda-Utilization` and use the filter `REPORT`.

Once the log stream is hooked up you'll start getting custom CloudWatch metrics under the namespace `Metricly`.

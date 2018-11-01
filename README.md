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

### CloudWatch Event Setup

This project runs best on a cron schedule. It will query and parse logs for each function name you provide. Running on a 5 minute rate is recommended.

To set up the CloudWatch Event go to the Lambda Utilization function in the AWS console and add a "CloudWatch Events" trigger to the function. Create a name for the trigger and configure a rate such as `rate(5 minute)`. This duration is needed in the environment variables below. After setting up the trigger enable it and save the function.

### Environment Variables

- **DURATION** (default: 60000) - Rate, in milliseconds, the lambda function is configured to run at
- **FUNCTION_NAMES** - Comma-delimited list of function names Lambda Utilization should monitor

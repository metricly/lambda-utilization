export default class AWSUtils {

  public static constructFunctionFqn(arn: string, functionName: string): string {
    return [this.getAccountId(arn), 'Lambda', this.getRegion(arn), functionName].join(':');
  }

  private static getAccountId(arn: string): string {
    return arn.split(':')[4];
  }

  private static getRegion(arn: string): string {
    return arn.split(':')[3];
  }
}

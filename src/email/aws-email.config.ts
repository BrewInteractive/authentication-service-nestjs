import config from "../utils/config";
import { IAwsEmailConfig } from "./interfaces/aws-email.config.interface";

const AwsEmailConfig: IAwsEmailConfig = {
  region: config().awsSesRegion,
  accessKeyId: config().awsSesAccessKey,
  secretAccessKey: config().awsSesSecretKey,
};

export default AwsEmailConfig;

import AwsEmailConfig from "./aws-email.config";
import config from "../utils/config";

jest.mock("../utils/config", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    awsSesRegion: "fake-region",
    awsSesAccessKey: "fake-ses-access-key",
    awsSesSecretKey: "fake-ses-secret-key",
  })),
}));

describe("AwsEmailConfig", () => {
  it("should have the correct configuration properties", () => {
    const awsEmailConfig = AwsEmailConfig;
    expect(awsEmailConfig.region).toEqual(config().awsSesRegion);
    expect(awsEmailConfig.accessKeyId).toEqual(config().awsSesAccessKey);
    expect(awsEmailConfig.secretAccessKey).toEqual(config().awsSesSecretKey);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});

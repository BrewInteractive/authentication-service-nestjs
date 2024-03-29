import { Test, TestingModule } from "@nestjs/testing";

import { ApiKeyGuard } from "./api-key.guard";
import { faker } from "@faker-js/faker";
import { ConfigService } from "@nestjs/config";

describe("ApiKeyGuard", () => {
  let apiKeyGuard: ApiKeyGuard;
  let configService: ConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();
    configService = module.get<ConfigService>(ConfigService);
    apiKeyGuard = module.get<ApiKeyGuard>(ApiKeyGuard);
  });

  it("Should be defined", () => {
    expect(apiKeyGuard).toBeDefined();
  });

  it("Should operate without an api key", async () => {
    (configService.get as jest.Mock).mockReturnValueOnce(undefined);

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(true);
  });

  it("Api key should be approved", async () => {
    (configService.get as jest.Mock).mockReturnValue((key: string) => {
      switch (key) {
        case "apiKey":
          return faker.datatype.string(8);
      }
    });

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            "x-api-key": configService.get("apiKey"),
          },
        }),
      })),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(true);
  });

  it("Api key should be not approved", async () => {
    (configService.get as jest.Mock).mockReturnValue((key: string) => {
      switch (key) {
        case "apiKey":
          return faker.datatype.string(8);
      }
    });

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            "x-api-key": faker.datatype.string(6),
          },
        }),
      })),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(false);
  });

  it("If the api key is not sent, it should be approved", async () => {
    (configService.get as jest.Mock).mockReturnValue((key: string) => {
      switch (key) {
        case "apiKey":
          return faker.datatype.string(8);
      }
    });
    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {},
        }),
      })),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(false);
  });
});

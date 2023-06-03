import { ApiKeyGuard } from './api-key.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Reflector } from '@nestjs/core';
import config from '../../config';

jest.mock('../../config', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('ApiKeyGuard', () => {
  let apiKeyGuard: ApiKeyGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyGuard],
    }).compile();

    apiKeyGuard = module.get<ApiKeyGuard>(ApiKeyGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('Should be defined', () => {
    expect(apiKeyGuard).toBeDefined();
  });

  it('Should operate without an api key', async () => {
    (config as jest.Mock).mockImplementation(() => ({
      apiKey: null,
    }));

    jest.spyOn(reflector, 'get').mockReturnValue(false);

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(true);
  });

  it('The api key control should be bypassed', async () => {
    (config as jest.Mock).mockImplementation(() => ({
      apiKey: faker.datatype.string(8),
    }));

    jest.spyOn(reflector, 'get').mockReturnValue(true);

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(true);
  });

  it('Api key should be approved', async () => {
    const apiKey = faker.datatype.string(8);

    (config as jest.Mock).mockImplementation(() => ({
      apiKey,
    }));

    jest.spyOn(reflector, 'get').mockReturnValue(false);

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'x-api-key': apiKey,
          },
        }),
      })),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(true);
  });

  it('Api key should be not approved', async () => {
    (config as jest.Mock).mockImplementation(() => ({
      apiKey: faker.datatype.string(8),
    }));

    jest.spyOn(reflector, 'get').mockReturnValue(false);

    const context = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'x-api-key': faker.datatype.string(6),
          },
        }),
      })),
    } as any;

    await expect(apiKeyGuard.canActivate(context)).toEqual(false);
  });

  it('If the api key is not sent, it should be approved', async () => {
    (config as jest.Mock).mockImplementation(() => ({
      apiKey: faker.datatype.string(8),
    }));

    jest.spyOn(reflector, 'get').mockReturnValue(false);

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

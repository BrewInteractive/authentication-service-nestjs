import {
    OtpFixture,
    SendLoginOtpEmailRequestFixture,
    SendOtpResultFixture,
    TokensFixture,
    UserFixture,
  } from "../../test/fixtures";
  import {
    Otp,
    RefreshToken,
    User,
    UserResetPasswordRequest,
    UserRole,
  } from "../entities";
  import { Test, TestingModule } from "@nestjs/testing";
  
  import { AutomapperModule } from "@automapper/nestjs";
  import { ConfigModule } from "@nestjs/config";
  import { SendLoginOtpEmailController } from "./send-otp-email-login.controller";
  import { MockFactory } from "mockingbird";
  import { OtpModule } from "../otp/otp.module";
  import { OtpService } from "../otp/otp.service";
  import { TokenModule } from "../token/token.module";
  import { TokenService } from "../token/token.service";
  import { UnauthorizedException } from "@nestjs/common";
  import { UserModule } from "../user/user.module";
  import { UserService } from "../user/user.service";
  import { classes } from "@automapper/classes";
  import { getRepositoryToken } from "@nestjs/typeorm";
  import {EventEmitterModule} from '@nestjs/event-emitter';
import { Email } from "src/email/dto/email.dto";
import { SendOtpResult } from "src/otp/dto";
import { faker } from "@faker-js/faker";
  
  describe("SendLoginOtpEmailController", () => {
    let sendLoginOtpEmailController: SendLoginOtpEmailController;
    let otpService: OtpService;
    let userService: UserService;
    let tokenService: TokenService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          AutomapperModule.forRoot({
            strategyInitializer: classes(),
          }),
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          TokenModule,
          UserModule,
          OtpModule,
          EventEmitterModule.forRoot()
        ],
        controllers: [SendLoginOtpEmailController],
      })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          findOne: jest.fn(),
          save: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(UserRole))
        .useValue({
          save: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(UserResetPasswordRequest))
        .useValue({
          save: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(RefreshToken))
        .useValue({
          save: jest.fn(),
          findOne: jest.fn(),
        })
        .overrideProvider(getRepositoryToken(Otp))
        .useValue({
          save: jest.fn(),
          findOne: jest.fn(),
        })
        .compile();
  
        sendLoginOtpEmailController = module.get<SendLoginOtpEmailController>(
            SendLoginOtpEmailController
      );
      tokenService = module.get<TokenService>("TokenService");
      userService = module.get<UserService>("UserService");
      otpService = module.get<OtpService>(OtpService);
    });
  
    it("should be defined", () => {
      expect(sendLoginOtpEmailController).toBeDefined();
    });

    it("should return error if there is no user", async () => {
        const mockSendLoginOtpEmailRequestDto = MockFactory(
            SendLoginOtpEmailRequestFixture
        ).one();
    
        const expectedResult = new UnauthorizedException("User doesn't exist.");
    
        jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(null);
    
        await expect(
            sendLoginOtpEmailController.sendLoginOtpEmailAsync(mockSendLoginOtpEmailRequestDto)
        ).rejects.toThrow(expectedResult);
    });

    it("should return send otp result with no active otp", async () => {
        const mockSendLoginOtpEmailRequestDto = MockFactory(
            SendLoginOtpEmailRequestFixture
        ).one();
    
        const mockUser = MockFactory(UserFixture).mutate({
            email: mockSendLoginOtpEmailRequestDto.email
        }).one();

        const mockSendOtpResult = MockFactory(SendOtpResultFixture).mutate({
            isSent: true,
            expiresAt: faker.date.future(),
            otpValue: faker.word.noun(),
        }).one();
    
        jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(mockUser);
        jest.spyOn(otpService, "createEmailOtpAsync").mockResolvedValueOnce(mockSendOtpResult)
    
        await expect(
            sendLoginOtpEmailController.sendLoginOtpEmailAsync(mockSendLoginOtpEmailRequestDto)
        ).resolves.toEqual(mockSendOtpResult);
    });

    it("should return send otp result with active otp", async () => {
        const mockSendLoginOtpEmailRequestDto = MockFactory(
            SendLoginOtpEmailRequestFixture
        ).one();
    
        const mockUser = MockFactory(UserFixture).mutate({
            email: mockSendLoginOtpEmailRequestDto.email
        }).one();

        const mockSendOtpResult = MockFactory(SendOtpResultFixture).mutate({
            isSent: false,
            expiresAt: faker.date.future()
        }).one();
    
        jest.spyOn(userService, "getUserAsync").mockResolvedValueOnce(mockUser);
        jest.spyOn(otpService, "createEmailOtpAsync").mockResolvedValueOnce(mockSendOtpResult)
    
        await expect(
            sendLoginOtpEmailController.sendLoginOtpEmailAsync(mockSendLoginOtpEmailRequestDto)
        ).resolves.toEqual(mockSendOtpResult);
    });
  });
  
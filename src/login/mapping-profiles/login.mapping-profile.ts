import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Mapper, createMap } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { User } from "../../entities/user.entity";
import { LoginRequest } from "../dto/login-request.dto";
import { LoginOtpPhoneRequest } from "../dto/login-otp-phone-request.dto";

@Injectable()
export class LoginProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, LoginRequest, User);
    };
  }
}

@Injectable()
export class LoginPhoneOtpProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, LoginOtpPhoneRequest);
    };
  }
}

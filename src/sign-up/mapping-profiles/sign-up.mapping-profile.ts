import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { SignUpRequest } from "../dto/sign-up-request.dto";
import { SignUpOtpEmailRequest } from "../dto/sign-up-otp-email-request.dto";
import { User } from "../../entities/user.entity";
import * as bcrypt from "bcrypt";
import { authenticationConfig } from "../../config";
import { SignUpOtpPhoneRequest } from "../dto";

@Injectable()
export class SignUpProfile extends AutomapperProfile {
  private readonly salt: string;

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
    this.salt = bcrypt.genSaltSync();
  }

  private mapRoles<T>() {
    return mapFrom<
      T,
      User,
      {
        role: {
          name: string;
        };
      }[]
    >(() => {
      if (!authenticationConfig().userDefaultRole) return null;
      else
        return [
          {
            role: {
              name: authenticationConfig().userDefaultRole,
            },
          },
        ];
    });
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SignUpRequest,
        User,
        forMember(
          (dest) => dest.passwordSalt,
          mapFrom(() => {
            return this.salt;
          })
        ),
        forMember(
          (dest) => dest.passwordHash,
          mapFrom((src: SignUpRequest) => {
            const salt = this.salt;
            const hash = bcrypt.hashSync(src.password, salt);
            return hash;
          })
        ),
        forMember((dest) => dest.roles, this.mapRoles<SignUpRequest>()),
        forMember(
          (dest) => dest.phoneNumber,
          mapFrom((src) => {
            if (src.phone) {
              return src.phone.number;
            }
          })
        ),
        forMember(
          (dest) => dest.countryCode,
          mapFrom((src) => {
            if (src.phone) {
              return src.phone.countryCode;
            }
          })
        )
      );
      createMap(
        mapper,
        SignUpOtpEmailRequest,
        User,
        forMember((dest) => dest.roles, this.mapRoles<SignUpOtpEmailRequest>()),
        forMember(
          (dest) => dest.phoneNumber,
          mapFrom((src) => {
            if (src.phone) {
              return src.phone?.number;
            }
          })
        ),
        forMember(
          (dest) => dest.countryCode,
          mapFrom((src) => {
            if (src.phone) {
              return src.phone?.countryCode;
            }
          })
        )
      );
      createMap(
        mapper,
        SignUpOtpPhoneRequest,
        User,
        forMember((dest) => dest.roles, this.mapRoles<SignUpOtpPhoneRequest>()),
        forMember(
          (dest) => dest.phoneNumber,
          mapFrom((src) => {
            if (src.phone) {
              return src.phone.number;
            }
          })
        ),
        forMember(
          (dest) => dest.countryCode,
          mapFrom((src) => {
            if (src.phone) {
              return src.phone.countryCode;
            }
          })
        )
      );
    };
  }
}

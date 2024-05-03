import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { SignUpRequest } from "../dto/sign-up-request.dto";
import { User } from "../../entities/user.entity";
import * as bcrypt from "bcrypt";
import { authenticationConfig } from "../../config";

@Injectable()
export class SignUpProfile extends AutomapperProfile {
  private readonly salt: string;

  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
    this.salt = bcrypt.genSaltSync();
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
        forMember(
          (dest) => dest.roles,
          mapFrom(() => {
            if (!authenticationConfig().userDefaultRole) return null;
            else
              return [
                {
                  role: {
                    name: authenticationConfig().userDefaultRole,
                  },
                },
              ];
          })
        )
      );
    };
  }
}

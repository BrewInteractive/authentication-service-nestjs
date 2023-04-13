import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Mapper, createMap } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { SignUpDto } from "../dto/sign-up.dto";
import { User } from "../../models/user.entity";

@Injectable()
export class SignUpProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, SignUpDto, User);
    };
  }
}

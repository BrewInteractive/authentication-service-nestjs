import { SendEmailCommand, SendEmailCommandInput } from "@aws-sdk/client-ses";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Mapper, createMap, forMember, mapFrom } from "@automapper/core";
import { Injectable } from "@nestjs/common";
import { Email } from "../dto/email.dto";

@Injectable()
export class EmailProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Email,
        SendEmailCommand,
        forMember(
          (dest) => dest.input,
          mapFrom(
            (email) =>
              ({
                Source: email.from,
                Destination: {
                  CcAddresses: email.cc,
                  BccAddresses: email.bcc,
                  ToAddresses: [email.to],
                },
                Message: {
                  Subject: {
                    Data: email.subject,
                  },
                  Body: {
                    Text: {
                      Data: email.content,
                    },
                  },
                },
              } as SendEmailCommandInput)
          )
        )
      );
    };
  }
}

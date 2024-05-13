import { ApiProperty } from "@nestjs/swagger";
import { ErrorExtensions } from "./error-extensions.dto";

export abstract class ExtendedError<T extends ErrorExtensions> extends Error {
  @ApiProperty({
    required: false,
  })
  extensions?: T;
}

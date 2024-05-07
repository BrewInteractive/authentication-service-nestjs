import { ErrorExtensions } from "../../../src/dto/error-extensions.dto";
import { Mock } from "mockingbird";

export class ErrorExtensionsFixture extends ErrorExtensions{
  @Mock((faker) => faker.datatype.string(4))
  code: string;
  @Mock((faker) => faker.datatype.string())
  additionalProperty: string;
}
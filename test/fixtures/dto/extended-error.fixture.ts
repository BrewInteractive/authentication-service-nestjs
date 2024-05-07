import { ErrorExtensionsFixture } from "./error-extensions.fixture";
import { ExtendedError } from "../../../src/dto/extended-error.dto";
import { Mock } from "mockingbird";

export class ExtendedErrorFixture extends ExtendedError<ErrorExtensionsFixture>{
    @Mock((faker) => faker.lorem.sentence())
    message: string;
    @Mock()
    extensions?: ErrorExtensionsFixture;
    
}
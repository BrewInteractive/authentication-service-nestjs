import { ErrorExtensionsFixture } from '../../test/fixtures/dto/error-extensions.fixture';
import { ErrorResponse } from './error-response.dto';
import { MockFactory } from 'mockingbird';

describe('ErrorResponse', () => {
  it('should correctly assign the message and extensions properties', () => {
    const message = 'An error occurred';
    const code = 'ERR001';
    const extensions = MockFactory(ErrorExtensionsFixture).mutate({code}).one();
    
    const errorResponse = new ErrorResponse();
    errorResponse.message = message;
    errorResponse.extensions = extensions;

    expect(errorResponse.message).toBe(message);
    expect(errorResponse.extensions).toBe(extensions);
    expect(errorResponse.extensions.code).toBe(code);
  });

  it('should allow instantiation without extensions', () => {
    const message = 'An error occurred';

    const errorResponse = new ErrorResponse();
    errorResponse.message = message;

    expect(errorResponse.message).toBe(message);
    expect(errorResponse.extensions).toBeUndefined();
  });
});
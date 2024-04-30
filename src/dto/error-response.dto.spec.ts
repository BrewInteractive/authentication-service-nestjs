import { ErrorExtensions } from './error-extensions.dto';
import { ErrorResponse } from './error-response.dto';

class FakeErrorExtensions extends ErrorExtensions {

}

describe('ErrorResponse', () => {
  it('should correctly assign the message and extensions properties', () => {
    const message = 'An error occurred';
    const code = 'ERR001';
    const extensions = new FakeErrorExtensions();
    extensions.code = code;

    const errorResponse = new ErrorResponse();
    errorResponse.message = message;
    errorResponse.extensions = extensions;

    expect(errorResponse.message).toBe(message);
    expect(errorResponse.extensions).toBe(extensions);
    // Specifically test the extension's code to ensure proper assignment
    expect(errorResponse.extensions.code).toBe(code);
  });

  it('should allow instantiation without extensions', () => {
    const message = 'An error occurred';

    const errorResponse = new ErrorResponse();
    errorResponse.message = message;

    expect(errorResponse.message).toBe(message);
    expect(errorResponse.extensions).toBeUndefined(); // ensures extensions can be optional
  });
});
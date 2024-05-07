import { ErrorExtensionsFixture } from '../../test/fixtures/dto/error-extensions.fixture';
import { ExtendedErrorFixture } from '../../test/fixtures/dto/extended-error.fixture';
import { MockFactory } from 'mockingbird';
describe('MyExtendedError', () => {
    it('should correctly assign a message and extensions', () => {
      const errorMessage = 'Error message';
      const errorCode = 'ERR123';
      const errorAdditionalProperty = 'Additional info';

      const extensions = MockFactory(ErrorExtensionsFixture).mutate({code: errorCode, additionalProperty: errorAdditionalProperty}).one();
      
      const extendedError = MockFactory(ExtendedErrorFixture).mutate({message: errorMessage, extensions}).one();
      
      expect(extendedError.message).toBe(errorMessage);
      expect(extendedError.extensions).toBeDefined();
      expect(extendedError.extensions.code).toBe(errorCode);
      expect(extendedError.extensions.additionalProperty).toBe(errorAdditionalProperty);
    });
  
    it('should allow instantiation without extensions', () => {
      const errorMessage = 'Error occurred';
  
      const extendedError = MockFactory(ExtendedErrorFixture).mutate({message: errorMessage}).one();
  
      expect(extendedError.message).toBe(errorMessage);
      expect(extendedError.extensions).toBeUndefined();
    });
  });
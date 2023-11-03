import { TemplateService } from './template.service';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';

// Mock the fs and mjml2html dependencies for testing
jest.mock('fs');
jest.mock('mjml');

describe('TemplateService', () => {
  let templateService: TemplateService;

  beforeEach(() => {
    templateService = new TemplateService();
  });

  describe('getResetPasswordEmail', () => {
    it('should return the email content with injected data', () => {
      (readFileSync as jest.Mock).mockReturnValue('<mjml>Mock MJML Template</mjml>');

      const mockHtmlOutput = {
        html: '<html>Mock HTML Template</html>',
      };
      require('mjml').default.mockReturnValue(mockHtmlOutput);

      const data = {resetLink: "https://www.google.com"};
      const emailContent = templateService.getResetPasswordEmail(data);

      expect(emailContent).toBe(mockHtmlOutput.html);
    });
  });
});

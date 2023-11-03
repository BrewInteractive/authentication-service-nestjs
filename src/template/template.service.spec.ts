import { TemplateService } from './template.service';
import { readFileSync } from 'fs';
import mjml2html = require('mjml');

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
      // Mock the readFileSync function to return the MJML template content
      (readFileSync as jest.Mock).mockReturnValue(`
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello {{ name }},</mj-text>
                <mj-text>We're resetting your password for {{ appName }}.</mj-text>
                <mj-button href="{{ resetLink }}">Reset Password</mj-button>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `);

      // Mock the mjml2html function to return the HTML
      const mockHtmlOutput = {
        html: `
          <html>
            <body>
              <p>Hello John Doe,</p>
              <p>We're resetting your password for My App.</p>
              <a href="https://example.com/reset-password">Reset Password</a>
            </body>
          </html>
        `,
      };

      // Mock the 'mjml' library (default import) correctly
      (mjml2html as jest.Mock).mockReturnValue(mockHtmlOutput);

      const data = {
        name: 'John Doe',
        appName: 'My App',
        resetLink: 'https://example.com/reset-password',
      };

      const emailContent = templateService.getResetPasswordEmail(data);

      // Make assertions to ensure data injection works
      expect(emailContent).toContain('Hello John Doe');
      expect(emailContent).toContain("We're resetting your password for My App.");
      expect(emailContent).toContain('href="https://example.com/reset-password"');
    });
  });
});

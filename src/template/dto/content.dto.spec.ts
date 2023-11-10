import { Content } from "./content.dto";
import { faker } from "@faker-js/faker";
import { validate } from "class-validator";

describe("Content Dto Validation", () => {
    
    it("should success validation if html is empty but not mjm", async () => {
        const content = new Content();
        content.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Simple HTML</title>
        </head>
        <body>
            <h1>Hello, World!</h1>
            <p>This is a simple HTML document.</p>
        </body>
        </html>
        `;
        const errors = await validate(content);
    
        expect(errors.length).toBe(0);
      });
    
      it("should success validation if mjml is empty but not html", async () => {
        const content = new Content();
        content.mjml = `
        <mjml>
          <mj-body>
            <mj-section>
              <mj-column>
                <mj-text>Hello, MJML!</mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
        `;
        const errors = await validate(content);
    
        expect(errors.length).toBe(0);
      });
});
import * as Handlebars from "handlebars";

import { TemplateService } from "./template.service";
import { faker } from "@faker-js/faker";
import { readFileSync } from "fs";

import mjml2html = require("mjml");

jest.mock("fs");
jest.mock("mjml");
jest.mock("handlebars");

describe("TemplateService", () => {
  let templateService: TemplateService;

  beforeEach(() => {
    templateService = new TemplateService();
  });

  describe("getResetPasswordEmailTemplate", () => {
    it("should return user invite email template", () => {
      // Arrange
      const locale = faker.locale;
      const mockMjmlTemplate: string = faker.lorem.paragraphs(3);
      const mockHtmlOutput = {
        html: faker.lorem.paragraphs(3),
      };
      const mockReadFileSync = readFileSync as jest.Mock;
      mockReadFileSync.mockReturnValue(mockMjmlTemplate);
      const mockedMjml2html = mjml2html as jest.Mock;
      mockedMjml2html.mockReturnValue(mockHtmlOutput);
      // Act
      const html = templateService.getResetPasswordEmailTemplate(locale);
      // Assert
      expect(html).toBeDefined();
      expect(html).toEqual(mockHtmlOutput.html);
      expect(mockReadFileSync).toHaveBeenCalledWith(
        `${__dirname}/templates/${locale}/reset-password.mjml`,
        "utf8"
      );
    });
  });

  describe("injectData", () => {
    it("should return the email content with injected data html", () => {
      // Arrange
      const mochHtmlTemplate: string = faker.lorem.paragraphs(3);
      const data = {
        name: faker.name.fullName(),
        appName: faker.music.songName(),
        resetLink: faker.internet.url(),
      };
      const mockCompiledHtmlOutput = faker.lorem.paragraphs(3);
      const mockHandleBarsDelegate: HandlebarsTemplateDelegate<any> = jest.fn(
        (x) => (x == data ? mockCompiledHtmlOutput : null)
      );
      const mockCompile = jest.fn((x) => mockHandleBarsDelegate);
      const spyOnCompile = jest
        .spyOn(Handlebars, "compile")
        .mockImplementation(mockCompile);
      // Act
      const emailContent = templateService.injectData(mochHtmlTemplate, data);
      // Assert
      expect(spyOnCompile).toHaveBeenCalled();
      expect(emailContent).toEqual(mockCompiledHtmlOutput);
      expect(mockCompile).toHaveBeenCalledWith(mochHtmlTemplate);
    });
  });
});

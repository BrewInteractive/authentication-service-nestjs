import * as Handlebars from "handlebars";

import { TemplateService } from "./template.service";
import { faker } from "@faker-js/faker";
import { readFileSync } from "fs";

jest.mock("fs");
jest.mock("handlebars");

describe("TemplateService", () => {
  let templateService: TemplateService;

  beforeEach(() => {
    templateService = new TemplateService();
  });

  describe("getResetPasswordEmailTemplate", () => {
    it("should return reset password email template", () => {
      // Arrange
      const locale = faker.locale;
      const mockHtmlTemplate: string = faker.lorem.paragraphs(3);
      const mockReadFileSync = readFileSync as jest.Mock;
      mockReadFileSync.mockReturnValue(mockHtmlTemplate);
      // Act
      const html = templateService.getResetPasswordEmailTemplate(locale);
      // Assert
      expect(html).toBeDefined();
      expect(mockReadFileSync).toHaveBeenCalledWith(
        `${__dirname}/dist-templates/${locale}/reset-password.html`,
        "utf8"
      );
    });
  });

  describe("injectData", () => {
    it("should return the email content with injected data html", () => {
      // Arrange
      const mockHtmlTemplate: string = faker.lorem.paragraphs(3);
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
      const emailContent = templateService.injectData(mockHtmlTemplate, data);
      // Assert
      expect(spyOnCompile).toHaveBeenCalled();
      expect(emailContent).toEqual(mockCompiledHtmlOutput);
      expect(mockCompile).toHaveBeenCalledWith(mockHtmlTemplate);
    });
  });
});

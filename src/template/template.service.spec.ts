import { TemplateService } from "./template.service";
import { readFileSync } from "fs";
import mjml2html from "mjml";
import { TemplateContent } from "./dto/template-content.dto";
import { faker } from "@faker-js/faker";
import * as Handlebars from "handlebars";

jest.mock("fs");
jest.mock("mjml", () => ({
  __esModule: true,
  default: jest.fn(),
}));
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
      const mockMjmlTemplate: string = faker.lorem.paragraphs(3);
      const mockReadFileSync = readFileSync as jest.Mock;
      mockReadFileSync.mockReturnValue(mockMjmlTemplate);
      // Act
      const content = templateService.getResetPasswordEmailTemplate(locale);
      // Assert
      expect(content).toBeDefined();
      expect(content.mjml).toEqual(mockMjmlTemplate);
      expect(mockReadFileSync).toHaveBeenCalledWith(
        `${__dirname}/templates/${locale}/user-invite.mjml`,
        "utf8"
      );
    });
  });

  describe("injectData", () => {
    it("should return the email content with injected data mjml", () => {
      // Arrange
      const mockMjmlTemplate: string = faker.lorem.paragraphs(3);
      const templateContent = new TemplateContent();
      templateContent.mjml = mockMjmlTemplate;
      const mockHtmlOutput = {
        html: faker.lorem.paragraphs(3),
      };
      const data = {
        name: faker.name.fullName(),
        appName: faker.music.songName(),
        resetLink: faker.internet.url(),
      };
      const mockCompiledHtmlOutput = faker.lorem.paragraphs(3);
      const mockMjml2Html = mjml2html as jest.Mock;
      mockMjml2Html.mockReturnValue(mockHtmlOutput);
      const mockHandleBarsDelegate: HandlebarsTemplateDelegate<any> = jest.fn(
        (x) => (x == data ? mockCompiledHtmlOutput : null)
      );
      const mockCompile = jest.fn((x) => mockHandleBarsDelegate);
      const spyOnCompile = jest
        .spyOn(Handlebars, "compile")
        .mockImplementation(mockCompile);
      // Act
      const emailContent = templateService.injectData(templateContent, data);
      // Assert
      expect(spyOnCompile).toHaveBeenCalled();
      expect(emailContent).toEqual(mockCompiledHtmlOutput);
      expect(mockCompile).toHaveBeenCalledWith(mockHtmlOutput.html);
      expect(mockMjml2Html).toHaveBeenCalledWith(templateContent.mjml, {
        validationLevel: "strict",
      });
    });
    it("should return the email content with injected data html", () => {
      // Arrange
      const mockMjmlTemplate: string = faker.lorem.paragraphs(3);
      const templateContent = new TemplateContent();
      templateContent.html = mockMjmlTemplate;
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
      const emailContent = templateService.injectData(templateContent, data);
      // Assert
      expect(spyOnCompile).toHaveBeenCalled();
      expect(emailContent).toEqual(mockCompiledHtmlOutput);
      expect(mockCompile).toHaveBeenCalledWith(templateContent.html);
    });
  });
});

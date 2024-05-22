import { Test, TestingModule } from "@nestjs/testing";
import { MutluCellSmsService } from "./";
import * as js2xmlparser from "js2xmlparser";
import {
    MutluCellSmsConfigFixture,
    SmsFixture,
} from "../../../../test/fixtures/sms";
import { MockFactory } from "mockingbird";

jest.mock("js2xmlparser", () => ({
    parse: jest.fn(),
}));

describe("MutluCellSmsService", () => {
    let mutluCellSmsService: MutluCellSmsService;
    const mockMutluCellSmsConfig = MockFactory(MutluCellSmsConfigFixture).one();

    beforeEach(async () => {
        jest.clearAllMocks();
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MutluCellSmsService,
                {
                    provide: "MutluCellSmsConfig",
                    useValue: mockMutluCellSmsConfig,
                },
            ],
        }).compile();

        mutluCellSmsService = module.get<MutluCellSmsService>(MutluCellSmsService);
    });

    it("should be defined", () => {
        expect(mutluCellSmsService).toBeDefined();
    });

    it("should send SMS successfully", async () => {
        const sms = MockFactory(SmsFixture).one();
        const mockXml = "<xml><test>mock</test></xml>";
        (js2xmlparser.parse as jest.Mock).mockReturnValue(mockXml);

        global.fetch = jest.fn(() =>
            Promise.resolve({
                text: () => Promise.resolve("Success"),
            })
        ) as jest.Mock;

        await mutluCellSmsService.sendSmsAsync(sms);

        expect(js2xmlparser.parse).toHaveBeenCalledWith(
            "smspack",
            expect.objectContaining({
                mesaj: {
                    metin: sms.message,
                    nums: sms.phoneNumber,
                },
                "@": {
                    ka: mockMutluCellSmsConfig.username,
                    pwd: mockMutluCellSmsConfig.password,
                    org: mockMutluCellSmsConfig.originator,
                    charset: "turkish",
                },
            }),
            { declaration: { encoding: "UTF-8" } }
        );

        expect(global.fetch).toHaveBeenCalledWith(mockMutluCellSmsConfig.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=UTF-8",
            },
            body: mockXml,
        });
    });
});

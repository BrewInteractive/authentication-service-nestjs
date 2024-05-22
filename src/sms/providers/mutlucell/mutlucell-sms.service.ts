import { Inject, Injectable } from "@nestjs/common";
import { SmsService } from "../../sms.service";
import { MutluCellSmsDto, Sms } from "../../dto";
import { MutluCellSmsConfig } from "./";
import { parse } from "js2xmlparser";

@Injectable()
export class MutluCellSmsService extends SmsService {
    constructor(
        @Inject("MutluCellSmsConfig")
        private readonly mutluCellConfig: MutluCellSmsConfig
    ) {
        super();
    }

    async sendSmsAsync(sms: Sms): Promise<void> {
        const smsDto = new MutluCellSmsDto(
            sms.message,
            sms.phoneNumber,
            this.mutluCellConfig.username,
            this.mutluCellConfig.password,
            this.mutluCellConfig.originator
        );
        const xml = parse("xml", smsDto, { declaration: { encoding: "UTF-8" } });

        await this.sendXmlToMutluCellAsync(xml);
    }

    private async sendXmlToMutluCellAsync(xml: string): Promise<void> {
        await fetch(this.mutluCellConfig.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=UTF-8",
            },
            body: xml,
        }).then((response) => response.text());
    }
}

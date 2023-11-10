import { Module } from "@nestjs/common";
import { TemplateService } from "./template.service";


@Module({
    imports: [],
    providers: [{provide: "TemplateService", useClass: TemplateService}],
    exports: ["TemplateService"]
})
export class TemplateModule {}
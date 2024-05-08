import { EmailModule } from "../email/email.module";
import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { TemplateModule } from "../template/template.module";

@Module({
  imports: [EmailModule, TemplateModule],
  providers: [
    { provide: "NotificationService", useClass: NotificationService },
  ],
  exports: ["NotificationService"],
})
export class NotificationModule {}

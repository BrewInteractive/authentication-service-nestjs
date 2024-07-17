import { Module } from "@nestjs/common";
import { AuthNotificationService } from "./auth-notification.service";
import { TemplateModule } from "../template/template.module";
import { NotificationModule } from "@brewww/nestjs-notification-module";

@Module({
  imports: [NotificationModule, TemplateModule],
  providers: [
    { provide: "AuthNotificationService", useClass: AuthNotificationService },
  ],
  exports: ["AuthNotificationService"],
})
export class AuthNotificationModule {}

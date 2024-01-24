import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (
      this.configService.get("apiKey") === undefined ||
      this.configService.get("apiKey") === null
    )
      return true;

    const request = context.switchToHttp().getRequest();

    if (request?.headers["x-api-key"] === this.configService.get("apiKey"))
      return true;
    return false;
  }
}

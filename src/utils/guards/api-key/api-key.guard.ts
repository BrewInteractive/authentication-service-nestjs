import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import config from "../../config";
import { Reflector } from "@nestjs/core";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (config().apiKey === undefined || config().apiKey === null) return true;

    const request = context.switchToHttp().getRequest();
    if (request?.headers["x-api-key"] === config().apiKey) return true;
    return false;
  }
}

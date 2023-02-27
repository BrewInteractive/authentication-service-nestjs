import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  healthCheck(): string {
    return "Brew Authentication Api is running...";
  }
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
  async validateUser(userName: string, password: string): Promise<any> {
    return null;
  }
}

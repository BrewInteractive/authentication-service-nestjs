import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
  async validateUser(username: string, password: string): Promise<any> {
    return null;
  }
}

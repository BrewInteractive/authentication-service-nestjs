import { PhoneRequestDto } from "../../login/dto/phone.dto";

export interface IGetUser {
  username?: string;
  email?: string;
  phone?: PhoneRequestDto;
}

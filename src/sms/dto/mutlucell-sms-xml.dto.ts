export class MutluCellSmsXmlDto {
  mesaj: {
    metin: string;
    nums: string;
  };
  "@": {
    ka: string;
    pwd: string;
    org: string;
    charset: string;
  };

  constructor(
    message: string,
    phoneNumber: string,
    username: string,
    password: string,
    originator: string,
    charset: string = "turkish"
  ) {
    this.mesaj = {
      metin: message,
      nums: phoneNumber,
    };
    this["@"] = {
      ka: username,
      pwd: password,
      org: originator,
      charset: charset,
    };
  }
}

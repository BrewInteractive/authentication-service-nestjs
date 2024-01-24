export class CustomClaim {
  name: string;
  value:
    | string
    | object
    | number
    | boolean
    | Array<string | object | number | boolean>;

  constructor(
    name: string,
    value:
      | string
      | object
      | number
      | boolean
      | Array<string | object | number | boolean>
  ) {
    this.name = name;
    this.value = value;
  }
}

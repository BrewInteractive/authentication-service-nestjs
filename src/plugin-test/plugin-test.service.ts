import { Injectable } from "@nestjs/common";

@Injectable({})
export class PluginTestService {
  private textsToAppend: string[];
  constructor() {
    this.textsToAppend = [];
  }
  getHello(): string {
    return this.getHelloWorld() + this.textsToAppend.join(" ");
  }

  getHelloWorld(): string {
    return "Hello World!";
  }

  appendText(text: string): void {
    this.textsToAppend.push(text);
  }
}

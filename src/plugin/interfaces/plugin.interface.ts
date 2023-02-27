export interface IPlugin {
  name: string;
  displayName: string;
  load(): Promise<void>;
}

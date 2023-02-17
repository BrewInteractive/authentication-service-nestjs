export interface Plugin {
  name: string;
  displayName: string;
  load(): Promise<void>;
}

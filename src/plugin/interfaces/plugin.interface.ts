export interface Plugin {
  load(): Promise<void>;
}

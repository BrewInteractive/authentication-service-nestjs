export interface Plugin {
  setup(options?: any): Promise<void>;
}
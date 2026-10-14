export declare class HMRPlugin {
  type: '3rdParty';
  constructor(
    hmrOptions: Partial<{
      /** Disable all console output produced by the plugin */
      silent: boolean;
      webpack: Partial<{
        client: boolean;
        server: boolean;
      }>;
      vite: {
        client: boolean;
      };
    }>
  );
  init(i18nInstance: any): void;
  toJSON(): null;
  toString(): string;
}

export declare class HMRPlugin {
  type: '3rdParty';
  constructor(
    hmrOptions: Partial<{
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

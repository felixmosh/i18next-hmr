export declare class HMRPlugin {
  type: '3rdParty';
  constructor(
    hmrOptions: Partial<{
      client: boolean;
      viteClient: boolean;
      server: boolean;
    }>
  );
  init(i18nInstance: any): void;
  toJSON(): null;
  toString(): string;
}

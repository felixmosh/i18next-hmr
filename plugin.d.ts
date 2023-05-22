export class HMRPlugin {
  constructor(options: Partial<{ client: boolean; server: boolean }>);
  init(i18n);
}

import { registerPlugin } from '@capacitor/core';

export interface SharedPreferencesPlugin {
  save(options: { key: string; value: string }): Promise<void>;
}

export const SharedPreferences = registerPlugin<SharedPreferencesPlugin>('SharedPreferencesPlugin');
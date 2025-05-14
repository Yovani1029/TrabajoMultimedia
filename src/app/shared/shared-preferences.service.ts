import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SharedPreferencesService {

async saveDataToPreferences(images: any) {
  try {
    if (!images) {
      console.error('Faltan datos para guardar');
      return;
    }

    await Preferences.set({ key: 'images', value: JSON.stringify(images) });

    console.log('Datos guardados correctamente en SharedPreferences:', images);
  } catch (e) {
    console.error('Error al guardar en SharedPreferences', e);
  }
}
  


}

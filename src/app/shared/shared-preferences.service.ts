import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class SharedPreferencesService {
  
  async saveDataToPreferences(description: string, imageUrl: string) {
    try {
      if (!description || !imageUrl) {
        console.error('Faltan datos para guardar');
        return;
      }

      await Preferences.set({
        key: 'description',
        value: description,
      });

      await Preferences.set({
        key: 'imageUrl',
        value: imageUrl,
      });

      console.log('Datos guardados correctamente en SharedPreferences');
    } catch (e) {
      console.error('Error al guardar en SharedPreferences', e);
    }
  }

  async getDataFromPreferences() {
    try {
      const description = await Preferences.get({ key: 'description' });
      const imageUrl = await Preferences.get({ key: 'imageUrl' });

      if (!description.value || !imageUrl.value) {
        console.warn('No se encontraron datos en SharedPreferences');
        return null;
      }

      return {
        description: description.value,
        imageUrl: imageUrl.value,
      };
    } catch (e) {
      console.error('Error al leer de SharedPreferences', e);
      return null;
    }
  }

  async clearDataFromPreferences() {
    try {
      await Preferences.remove({ key: 'description' });
      await Preferences.remove({ key: 'imageUrl' });
      console.log('Datos eliminados correctamente de SharedPreferences');
    } catch (e) {
      console.error('Error al eliminar datos de SharedPreferences', e);
    }
  }
}

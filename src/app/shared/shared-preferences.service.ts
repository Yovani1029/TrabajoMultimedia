import { Injectable } from '@angular/core';
import { SharedPreferences } from '../plugins/shared-preferences.plugin';

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

      await SharedPreferences.save({ key: 'description', value: description });
      await SharedPreferences.save({ key: 'imageUrl', value: imageUrl });

      console.log('Datos guardados correctamente en SharedPreferences');
    } catch (e) {
      console.error('Error al guardar en SharedPreferences', e);
    }
  }
}

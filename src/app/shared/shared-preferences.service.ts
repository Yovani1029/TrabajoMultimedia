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
      console.log("holi.2" + images);
      await Preferences.set({ key: 'images', value: images });

      console.log('Datos guardados correctamente en SharedPreferences');
    } catch (e) {
      console.error('Error al guardar en SharedPreferences', e);
    }
  }
  
  async getDataFromPreferences(): Promise<any> {
  try {
    const { value } = await Preferences.get({ key: 'images' });

    if (!value) {
      console.warn('No hay datos almacenados en SharedPreferences');
      return null;
    }

    console.log('Datos recuperados correctamente:', value);
    return value;
  } catch (e) {
    console.error('Error al obtener datos de SharedPreferences', e);
    return null;
  }
}


}

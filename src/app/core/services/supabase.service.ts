import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async uploadImage(base64Data: string, fileName: string): Promise<string> {
    console.log('Subiendo imagen a Supabase...');
    const format = this.getImageFormat(base64Data);
    const contentType = `image/${format}`;
    const filePath = `images/${fileName}.${format}`;

    const { error } = await this.supabase.storage
      .from('images')
      .upload(filePath, this.base64toBlob(base64Data, contentType), {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error('Error al subir la imagen:', error);
      throw error;
    }

    const { publicUrl } = this.supabase.storage
      .from('images')
      .getPublicUrl(filePath).data;

    console.log('Imagen subida correctamente:', publicUrl); // Asegúrate de que obtienes la URL pública
    return publicUrl;
  }


  private getImageFormat(base64Data: string): string {
    const match = base64Data.match(/^data:image\/([a-zA-Z]+);base64,/);
    return match ? match[1] : 'jpeg';
  }

  private base64toBlob(base64: string, contentType: string): Blob {
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(base64Data);
    const byteArrays = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([byteArrays], { type: contentType });
  }
}

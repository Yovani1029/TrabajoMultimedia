import { Component } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SharedPreferencesService } from 'src/app/shared/shared-preferences.service';
import { MultimediaService } from 'src/app/core/services/multimedia.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  form = this.fb.group({
    description: ['', Validators.required],
    image: ['', [Validators.required, this.imageValidator]]
  });

  imagePreview: string | null = null;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private firestore: Firestore,
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    private sharedPreferencesService: SharedPreferencesService,
    private toastCtrl: ToastController,
    private multimedia: MultimediaService
  ) { }

  async pickImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      if (image?.dataUrl) {
        this.form.patchValue({ image: image.dataUrl });
        this.imagePreview = image.dataUrl;
      } else {
        throw new Error('No se pudo obtener la imagen');
      }
    } catch (error) {
      console.error('Error al tomar o seleccionar la imagen:', error);
      alert('Error al obtener la imagen');
    }
  }

  private imageValidator(control: AbstractControl) {
    const value = control.value;
    return value && value.trim() !== '' ? null : { imageInvalid: true };
  }

 async submit() {
  if (this.form.valid) {
    const { description, image } = this.form.value;
    const createdAt = new Date();

    const loading = await this.loadingCtrl.create({
      message: 'Guardando...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const fileName = `img_${Date.now()}`;
      console.log('Subiendo imagen base64:', image?.substring(0, 100));

      if (!description || !image) {
        console.error('La descripción o la imagen no son válidas');
        await loading.dismiss();
        alert('Por favor, completa todos los campos');
        return;
      }

      const publicUrl = await this.supabase.uploadImage(image!, fileName);

      if (!publicUrl) {
        console.error('No se pudo obtener la URL pública de la imagen');
        await loading.dismiss();
        alert('Ocurrió un error al obtener la URL de la imagen');
        return;
      }
 
       this.multimedia.getMultimedia().subscribe(datico=>{
          const data = datico;
          this.sharedPreferencesService.saveDataToPreferences
      });

      await addDoc(collection(this.firestore, 'multimedia'), {
        description,
        imageUrl: publicUrl,
        createdAt
      });

      await loading.dismiss();
      alert('Registro guardado correctamente');
      this.form.reset();
      this.imagePreview = null;
      this.router.navigate(['/home']);
    } catch (err) {
      console.error('Error al subir y guardar:', err);
      await loading.dismiss();
      alert('Ocurrió un error al guardar');
    }
  }
}



}

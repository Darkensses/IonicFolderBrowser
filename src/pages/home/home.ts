import { Component } from '@angular/core';
import { ModalController, ToastController } from 'ionic-angular';
import { FolderModalPage } from '../folder-modal/folder-modal';

import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public modalCtrl: ModalController, public toastCtrl: ToastController, 
              public diagnostic: Diagnostic) {        
    //this.autorizeRequestSD();
  }  

  autorizeRequestSD() {
    this.diagnostic.requestExternalStorageAuthorization().then((status) => {
      console.log("Authorization request for external storage use was " + (status == this.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
    }).catch(e => console.error(e));
  }
    
  //Método que sirve para mostrar el Modal
  showModal(){
    //Creamos una variable a la que se le asigna el modal
    let modal = this.modalCtrl.create(FolderModalPage);

    //Cuando el modal se cierre, recibimos la data (path).
    modal.onDidDismiss(data => {
      //Si la data es undefined quiere decir que el modal fue cerrado desde el bóton 
      //y por lo tanto no se seleccionó una carpeta por lo que no hay nada que mostrar en un toast.
      //Si no es undefined entonces podemos mostrar el path en un toast.
      if(data != undefined) this.presentToast('Folder selected: ' + data,'bottom');
    });

    //Mostramos el modal
    modal.present();
  }

  //Método para mostrar toast con información relevante.
  //Tomado de la documentación de Ionic.
  //Recibe de parámetros el mensaje y la posición del toast.
  presentToast(msg:string, pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 6666, //666 the number of the beast
      position: pos
    });
    toast.present();
  }

}
    

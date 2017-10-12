import { Component } from '@angular/core';
import { ViewController, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { File } from '@Ionic-native/file';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-folder-modal',
  templateUrl: 'folder-modal.html',
})
export class FolderModalPage {
  
  folders:any = []; //Almacenaremos a las carpetas que se encuentren en un directorio
  path:string = ''; //string que se concatenara con la ruta según navegamos
  basePath:string = ''; //string que guarda el path de el external storage
  baseFileSystem:string = ''; //string encargado de guardar la base del path (se puede tomar de this.file.*)
  parent:string[] = [];  //Almacenaremos el path antes de entrar a otra carpeta para poder regresar un nivel arriba
  curFold:string[] = []; //Almacenaremos el nombre de la carpeta para mostrar en la vista.
  loading:any; // Loader de Ionic

  constructor(public viewCtrl: ViewController, public file: File, public diagnostic: Diagnostic, 
              public modalCtrl: ModalController, private toastCtrl: ToastController,
              public loadingCtrl: LoadingController) { 
    
    this.baseFileSystem='file:///';

    this.presentLoadingDefault();
    
    this.diagnostic.requestExternalStorageAuthorization().then((status) => {
      console.log("Authorization request for external storage use was " + (status == this.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
      this.getSD().then((basePath) => {
        this.basePath = basePath.toString() + '/';
        console.log('after getsd inside cons: '+this.basePath);
        //this.curFold.unshift('Root');
        this.listPath(this.basePath);
        this.path = this.basePath;
        this.loading.dismiss();
      });
    });
     
  }  

  checkState() {
    this.diagnostic.isExternalStorageAuthorized().then((enabled) => {
      console.log('isExternalStorage: '+enabled);
    }).catch((error) => console.log('error IES: '+error));

    this.diagnostic.getExternalStorageAuthorizationStatus().then((status) => {
      console.log('status: '+status);
    }).catch((error) => console.log(error));
  }

  getSD(){
    let p:string = '';    
    return new Promise((resolve) => {

      this.diagnostic.getExternalSdCardDetails().then((details) => {
        console.log(details);
        if(details.length == 0){
          this.curFold.unshift('Internal Storage');
          resolve(this.file.externalRootDirectory.replace('file:///','').slice(0,-1));
          return;
        }
        for(let detail of details){
          if(detail.type === "root"){
            console.log('if getSD: '+detail.filePath);
            p = detail.filePath.replace('file:///','');   
          }
        }              
        console.log(p);
        this.curFold.unshift('SD Card');
        resolve(p);
      }).catch((error) => {
        console.log(error);      
      });

    });     
  }  

  listPath(dirName:string){
    this.folders = []; //Vaciamos el arreglo cada vez que entremos al método ya que son otras carpetas 
    console.log('listPath');
    this.file.listDir(this.baseFileSystem, dirName).then((result)=>{
      console.log('listPath() : '+ this.baseFileSystem + dirName);
      //Buscamos las carpetas mediante un ciclo
      for(let file of result){
        if(file.isDirectory == true){
          this.folders.push(file.name); //metemos a nuestro arreglo el nombre de las carpetas
          
        }
      }
      this.folders.sort();
    }).catch((error)=>{
      console.log(error);
      this.presentToast("Error al cargar " + dirName + ": " + error, "bottom");
    });  
    
  }

  //Método que se invoca cuando hacemos click en un elemento de la lista de carpetas.
  //Recibe como parámetro el nombre de la carpeta.
  clickFolder(dirName:string){
    this.curFold.unshift(dirName);
    this.parent.unshift(this.path); //Metemos al inicio del arreglo al path antes de ser actualizado

    //Actualizamos path concatenandolo con el nombre de la carpeta en a la que se entró
    this.path = this.path + (dirName == this.basePath ? this.basePath : dirName +'/');   

    this.listPath(this.path);//Con el path apuntando a la carpeta a la que ingresamos, mostramos el contenido de la misma
  }

  //Método que se usa cuando queremos regresar o subir un nivel de la carpeta en donde estamos.
  clickParent(){
    //Como subimos un nivel habrá que actualizar path sacando del arreglo al primer elemnto, 
    //ya que es la carpeta padre de donde estamos siempre y cuando el arreglo no quede vacío,
    //pues llegar a este punto significa que estamos en la raíz y ya no podemos subir. 
    this.path = this.parent.length > 0 ?  this.parent.shift() : this.basePath;
    this.curFold.shift();
    
    //Listamos las carpetas de la carpeta padre validando como a continuación se muestra:
    this.listPath(this.path != undefined ? this.path : this.basePath);
  }


  //Método que se invoca al dar click en el butón del ion-item-options.
  //Recibe como parámetro el nombre de la carpeta 
  selectFolder(dirName:string){
    //Como se va a cerrar el modal, entonces actualizaremos path para mandarlo y mostrarlo en la otra vista.
    this.path += (dirName == this.basePath ? this.basePath : dirName +'/');

    //Cerramos nuestro modal-vista
    this.onDidDismiss();
  }

  onDidDismiss(){
    //Con nuestro ViewController podemos mandar datos al momento de cerrarlo.
    this.viewCtrl.dismiss(this.path);
  }

  //Método que se invoca al dar click al botón de close.
  closeModal(){  	
  	this.viewCtrl.dismiss();
  }

  //Método para mostrar toast con información relevante.
  //Tomado de la documentación de Ionic.
  //Recibe de parámetros el mensaje y la posición del toast.
  presentToast(msg:string, pos:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: pos
    });
  
    toast.present();
  }

  presentLoadingDefault() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  }
  
}

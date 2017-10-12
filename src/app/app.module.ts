import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

//Página para mostrar las carpetas
import { FolderModalPage } from './../pages/folder-modal/folder-modal';

//Plugin File
import { File } from '@Ionic-native/file';

//Plugin Diagnostic
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FolderModalPage //Añadimos la página
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FolderModalPage //Añadimos la página
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File, //Añadimos el plugin
    Diagnostic, //Añadimos el plugin
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

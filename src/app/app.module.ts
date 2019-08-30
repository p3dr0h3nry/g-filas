import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {FCM} from '@ionic-native/fcm/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';
import {PowerManagement} from '@ionic-native/power-management/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    LocalNotifications,
    FCM,
    BackgroundMode,
    AndroidPermissions,
    WebView,
    OpenNativeSettings,
    PowerManagement,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

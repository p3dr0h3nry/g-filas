import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import{ SMS} from '@ionic-native/sms/ngx';
import{ AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import { RestApiService } from '../services/rest-api.service';
import{BackgroundMode} from '@ionic-native/background-mode/ngx';
import {Badge} from '@ionic-native/badge/ngx';
import { ModalLoginPage } from '../pages/modal-login/modal-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  
  providers:[SMS, AndroidPermissions,RestApiService,BackgroundMode,Badge],
  declarations: [HomePage, ModalLoginPage],
  entryComponents:[ModalLoginPage]
})
export class HomePageModule {}

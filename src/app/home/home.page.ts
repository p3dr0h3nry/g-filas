import { Component, ElementRef } from '@angular/core';
import { SMS } from '@ionic-native/sms/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { RestApiService } from '../services/rest-api.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { LoadingController, Platform, ModalController } from '@ionic/angular';
import { ModalLoginPage } from '../pages/modal-login/modal-login.page';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public contador: any;
  permitionSms: boolean;
  permitionReadPhone: boolean;
  public isLoged=true;
  public activeSender: boolean;
  public enableToSend:boolean;
  public senderStatus: boolean;
  public hasErro: boolean;
  public cliente:any;
  public isTrial:boolean;
  public criado:any;
  public resta:any;
  public erro:any;
  public cnpjData = { cnpj: ""};
  price:any='';
  token:any='';

  constructor(

    private sms: SMS,
    private permission: AndroidPermissions,
    private myService: RestApiService,
    private notificacao: LocalNotifications,
    private loadCtrl: LoadingController,
    private modalCtrl:ModalController,
    private backgroundMode: BackgroundMode,
    private settings: OpenNativeSettings
  ) {
    if(this.backgroundMode.isEnabled()){
      this.backgroundMode.disable();
    }
 

    this.isLoged=false;
    this.permitionSms=false;
    this.permitionReadPhone=false;
    this.activeSender = true;
    this.enableToSend = false;
    this.senderStatus = false;
    this.isTrial = false;
    this.contador =0;
    
    if (localStorage.getItem('cnpj')) {
      this.atualizarDados();
      this.isTrial = (localStorage.getItem('isTrial')=="1");
      this.criado = localStorage.getItem('data');
      this.isLoged = true;
      this.cliente = localStorage.getItem('cliente');
      this.contador = localStorage.getItem('qtdSms');
      this.cnpjData.cnpj = localStorage.getItem('cnpj');
      this.resta = 50 - parseInt(this.contador);
      this.permissoes_sms();
      
    }else{
      this.showModalLogin();
    }

  }
  bt_eco(){
    
    this.settings.open('battery_optimization').then(val=>{

    }).catch(err=>{
      alert("Falha!");
    })
  }

  atualizarDados(){
    let dt = {cnpj: localStorage.getItem('cnpj') };
    this.myService.post(dt, "consultarTrial").then((result1) => {
      let response:any = result1;
      response = JSON.parse(JSON.stringify(response));
      if(response.error){
        
        this.erro = response.error.e;
        this.hasErro = true;
      }else{
        //console.log(response.success.cliente);
        response = response.success.cliente;
        this.hasErro = false;
        //console.log('armazenar storage');
        localStorage.setItem('qtdSms',response.qtdSms);
        localStorage.setItem('isTrial',response.client_trial);
        this.contador=response.qtdSms;
        this.resta = 50 - parseInt(this.contador);
      }
    });
  }
  
  async showModalLogin(){

    const modal= await this.modalCtrl.create({
      component: ModalLoginPage, backdropDismiss:false
    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      this.isLoged = true;
      this.isTrial = (localStorage.getItem('isTrial')=="1");
      this.cnpjData.cnpj = localStorage.getItem('cnpj');
      this.cliente = localStorage.getItem('cliente');
      this.criado = localStorage.getItem('data');
      this.contador = localStorage.getItem('qtdSms');
      this.resta = 50 - parseInt(this.contador);
      this.permissoes_sms();
      
    });
  }  

  async send(num, msg) {
    var options: {
      replaceLineBreaks: true,
      android: {
        intent: "INTENT"
      }
    }
    await this.atualizarDados();
    if((this.contador<50 && localStorage.getItem('isTrial')=="1")|| localStorage.getItem('isTrial')=="0"){
          
    
      this.permission.requestPermission(this.permission.PERMISSION.SEND_SMS).then(result => {
        this.sms.send(num, msg, options).then(() => {
          
        }).catch((e) => {
          alert(JSON.stringify(e));
        });

      }).catch((err) => {
        alert(JSON.stringify(err));
      });
    }else{
      this.activeSender=false;
      this.stopSms();
      alert('Seu período de teste acabou!');
    }
  }

  logout(){
    localStorage.clear();
    location.reload();
  }

  permissoes_sms(){
    this.permission.checkPermission(this.permission.PERMISSION.SEND_SMS).then(result => {
      if(!result.hasPermission){
        this.permission.requestPermission(this.permission.PERMISSION.SEND_SMS).then(rs =>{
          if(rs.hasPermission){this.permissoes_phone()}else{this.logout()}
        });
      }else{
        this.permissoes_phone();
      }    

    });
  }

  permissoes_phone(){
    this.permission.checkPermission(this.permission.PERMISSION.READ_PHONE_STATE).then(result => {
      if(!result.hasPermission){
        this.permission.requestPermission(this.permission.PERMISSION.READ_PHONE_STATE).then(rs =>{
          if(rs.hasPermission){this.testarPermissoes()}else{this.logout()}
        });
      }else{
        this.testarPermissoes();
      }    

    });
  }

  async testarPermissoes() {
    
    await this.permission.checkPermission(this.permission.PERMISSION.SEND_SMS).then(result => {
      //console.log("1");
      this.permitionSms = result.hasPermission;
    });
      
    await this.permission.checkPermission(this.permission.PERMISSION.READ_PHONE_STATE).then(result1 => {
      //console.log("2");
      this.permitionReadPhone = result1.hasPermission;
       
    });
    
    this.liberarEnvio();

  }

  liberarEnvio(){
    let loader = this.loadCtrl.create({message:'Checando permissões'}).then((a)=>{
      a.present();
    });
    setTimeout(() => {
      if(this.permitionSms && this.permitionReadPhone){
        this.enableToSend = true;
        
      }
      this.loadCtrl.dismiss();
    }, 1000);
    
  }

  stopSms(){
    this.activeSender = true;
    this.senderStatus = false;
    this.backgroundMode.disable();
  }


  permicaoRead() {

    this.permission.checkPermission(this.permission.PERMISSION.READ_PHONE_STATE).then(result => {
      alert(result.hasPermission);

    });
  }
  setarAlerta() {
    this.notificacao.schedule({
      id: 1,
      title: 'SMS Enviado',
      text: 'Enviado',
      data: { mydata: 'Alguma coisa' },
      trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
    });


  }

  iniciar(){
    this.activeSender = false;
    this.senderStatus = true;
    //this.backgroundMode.moveToBackground();
    
    this.backgroundMode.setDefaults({ title: "title", text: 'title', resume: true, hidden: true, silent: true});
    this.backgroundMode.enable();
    this.backgroundMode.on('enable').subscribe(() => {
      this.buscarMsg();
    });
       
  }

  buscarMsg() {
    
    this.myService.post(this.cnpjData, "consultarGestao").then((result) => {
      let respostaDB = result;
      let data = JSON.parse(JSON.stringify(respostaDB));

      if (JSON.parse(JSON.stringify(data)).success) {

        data = JSON.parse(JSON.stringify(data)).success;
        data = JSON.parse(JSON.stringify(data)).msg;


        data.forEach(e => {
          this.updateStatus(e['id']);
          this.send(e['numero'], e['msg']);
          let c= this.contador+1;
          this.resta = 50 - this.contador;
          localStorage.setItem('qtdSms', String(c));
        });
        this.loop();

      } else {
        this.loop();
      }
    }).catch((err) => {
      this.loop();
    });
  }

  async loop() {
    if(this.senderStatus){
      setTimeout(() => {
      //this.backgroundMode.on('enable').subscribe(() => {
        //alert('enable');
        this.backgroundMode.unlock();
        this.buscarMsg();
      //});
        
      }, 10000);
    }
  }

  async updateStatus(id) {
    let dados = { id: id, cnpj: localStorage.getItem('cnpj') };
    this.myService.post(dados, "updateStatus").then((result) => {
      //console.log(result);
      return true;
    });
  }

}

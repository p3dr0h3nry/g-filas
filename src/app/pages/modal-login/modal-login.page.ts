import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.page.html',
  styleUrls: ['./modal-login.page.scss'],
})
export class ModalLoginPage implements OnInit {
  private formLogin:FormGroup;
  private responseWS:any;
  private erro:any;
  private hasErro: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private myService: RestApiService,
    private viewCtrl:ModalController,
    private loadCtrl:LoadingController
    ) 
  {
      this.hasErro=false;
   }

  ngOnInit() {
      this.formLogin = this.formBuilder.group({
      login: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required])
    });
  }

  sair(){
    this.viewCtrl.dismiss();
  }

  logar(){

    let loader = this.loadCtrl.create({ message: 'Logando' }).then((a)=>{
      a.present();
    });
    this.myService.post(this.formLogin.value, "logarGestao").then((result) => {
      let data = JSON.parse(JSON.stringify(result));
        if(data.error){ 
          this.loadCtrl.dismiss();
          this.erro = data.error.e;
          this.hasErro = true;

        }else{ 
          //console.log(this.data.success);
          data = data.success.cliente;
          this.myService.post(data, "consultarTrial").then((result1) => {
            let response:any = result1;
            response = JSON.parse(JSON.stringify(response));
            this.loadCtrl.dismiss();
            if(response.error){
              this.erro = response.error.e;
              this.hasErro = true;
            }else{
              this.loadCtrl.dismiss();
              response = response.success.cliente;
              this.hasErro = false;
              localStorage.setItem('cnpj',data.cnpj);
              localStorage.setItem('cliente',data.cliente);
              localStorage.setItem('id',data.id);
              localStorage.setItem('qtdSms',data.qtdSms);
              localStorage.setItem('isTrial',response.client_trial);
              localStorage.setItem('data',response.criado_data);
              this.sair();
            }
          });
        }
    });
    //this.loadCtrl.dismiss();

  }

}

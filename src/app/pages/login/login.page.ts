import { Component, OnInit } from '@angular/core';
import { LoginResponse } from 'src/app/interfaces/loginResponse';
import { ChatsService } from '../../services/chats.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user = {username: '', password: ''}
  datos_usuario!: LoginResponse;

  constructor(
    private serviceChat: ChatsService,
    private router:Router,
    public alertController: AlertController,
    private loadingCtrl: LoadingController
  ) { 
    
  }

  ngOnInit() {

  }
  
  async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'Usuario inexistente',
      buttons: ['Aceptar']
    });
  
    await alert.present();
  }

login() {
    this.loadingCtrl.create({
      message: 'Por favor espere',
    }).then((res)=>{
      res.present();
      console.log(this.user);
      this.serviceChat.login(this.user.username, this.user.password).subscribe(
        data => {
          //console.log(data);
          res.dismiss();
          this.datos_usuario=data;
          console.log("Inicio de sesion correcto: " + this.datos_usuario.data.username);
          localStorage.setItem("username", this.datos_usuario.data.username);
          localStorage.setItem("id", this.datos_usuario.data.id.toString());
          localStorage.setItem("token", this.datos_usuario.data.token);
          this.user.username = '';
          this.user.password = '';
          this.router.navigateByUrl('/home');
        },
        error => { 
          res.dismiss();
          console.log(error.error.message);
          //alert(error.error.message);
          this.presentAlert(error.error.message);
        }
      )
    });
  }
  
  

}

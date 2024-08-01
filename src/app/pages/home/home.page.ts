import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersResponse } from 'src/app/interfaces/usersReponse';
import { filter } from 'rxjs/operators';
import { GroupsByUserResponse } from 'src/app/interfaces/groupsByUserResponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 
  id: string | null;
  users: UsersResponse[] = [];
  groups: GroupsByUserResponse[] = [];

  constructor(
    private router: Router,
    private serviceChat: ChatsService,
    private popoverController: PopoverController
  ) { 
    this.id = localStorage.getItem('id');
    console.log('usuario: ' + this.id);
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      if (this.router.url === '/home') {
        this.getUsuarios();
        this.getGroups();
      }
    });
  }

  logout() {
    this.popoverController.dismiss();
    localStorage.removeItem('id');
    console.log('ID después del logout:', localStorage.getItem('id'));
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  getChat(item: any) {
    this.router.navigate(['/chat', item?.id]);
  }

  getUsuarios() {
    this.serviceChat.getUsers().subscribe(
      data => {
        this.users = data.filter(user => user.id !== Number(this.id));
        console.log(this.users);
      },
      error => {
        console.error('Error al conseguir usuarios', error);
      }
    );
  }
  
  getGroups(){
    this.serviceChat.getGroupsbyUser(Number(this.id)).subscribe(
      data => {
        this.groups = data;
        this.groups.forEach(group =>{
          console.log('Grupo: ' + group.group_id);
        });
        
      },
      error => {
        console.error('Error al conseguir grupos', error);
      }
    );
  }

  getGroupChat(group: any){
    this.router.navigate(['/group-chat', group?.group_id]);
  }
}

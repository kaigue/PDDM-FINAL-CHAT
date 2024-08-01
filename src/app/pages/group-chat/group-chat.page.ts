import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GroupsByUserResponse } from 'src/app/interfaces/groupsByUserResponse';
import { MessagesByGroupResponse } from 'src/app/interfaces/messagesByGroupResponse';
import { ChatsService } from 'src/app/services/chats.service';
import { UsersResponse } from '../../interfaces/usersReponse';
import { IonContent } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.page.html',
  styleUrls: ['./group-chat.page.scss'],
})
export class GroupChatPage implements OnInit, OnDestroy {
  
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  group!: GroupsByUserResponse;
  message!: string;
  isLoading = false;
  currentUserId: number;
  groupId: number;
  chats: MessagesByGroupResponse[] = [];
  usuario: UsersResponse | undefined;
  username?: string;
  pollingSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatsService
  ) {
    this.groupId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.currentUserId = Number(localStorage.getItem('id')) || 0;
  }

  ngOnInit() {
    console.log('Usuario: ' + this.currentUserId);
    console.log('Grupo: ' + this.groupId);
    this.getGroup();
    this.loadMessages();
    this.getUsuario();
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadMessages(){
    if (this.groupId) {
      this.chatService.getMessageByGroup(this.groupId).subscribe(
        data => {
          this.chats = data;
          this.chats.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
          console.log(this.chats);
          this.scrollToBottom();
        },
        error => {
          console.error('Error al cargar mensajes', error);
        }
      );
    }
  }

  getGroup() {
    this.isLoading = true; // Inicio de la carga
    this.chatService.getGroupsbyUser(this.currentUserId).subscribe(
      groups => {
        const receiver = groups.find(group => group.group_id === this.groupId);
        if (receiver) {
          this.group = receiver;
          console.log(this.group);
        }
        this.isLoading = false; // Fin de la carga
      },
      error => {
        console.error('Error al cargar grupo', error);
        this.isLoading = false; // Fin de la carga incluso en caso de error
      }
    );
  }

  getUsuario() {
    this.chatService.getUsers().subscribe(
      data => {
        const user_data = data.find(user => user.id == Number(this.currentUserId));
        this.usuario = user_data;
        this.username = this.usuario?.username;
        console.log(this.usuario);
      },
      error => {
        console.error('Error al conseguir usuarios', error);
      }
    );
  }

  sendMessage(){
    if (this.message.trim()) {
      this.isLoading = true;
      this.chatService.postGroupMessage(this.currentUserId, this.groupId, this.message).subscribe(
        response => {
          // Una vez enviado el mensaje, recarga los mensajes para incluir el nuevo
          this.loadMessages();
          // Resetea el campo de mensaje
          this.message = '';
          this.isLoading = false;
          this.scrollToBottom();
        },
        error => {
          console.error('Error al enviar mensaje', error);
          this.isLoading = false;
        }
      );
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(200);
    }, 100);
  }

  startPolling() {
    this.pollingSubscription = interval(5000).subscribe(() => {
      this.loadMessages();
    });
  }
}

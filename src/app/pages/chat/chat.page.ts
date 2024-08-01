import { Component, OnInit, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from 'src/app/services/chats.service';
import { MessagesByUserResponse } from 'src/app/interfaces/messagesByUserResponse';
import { IonContent } from '@ionic/angular';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) content!: IonContent;

  receiver: string = '';
  message!: string;
  isLoading = false;
  currentUserId: number;
  receiverId: number;
  chats: MessagesByUserResponse[] = [];
  pollingSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatsService
  ) {
    this.receiverId = parseInt(this.route.snapshot.paramMap.get('id') || '0');
    this.currentUserId = Number(localStorage.getItem('id')) || 0;
  }

  ngOnInit() {
    console.log("Emisor en chat: " + this.currentUserId);
    console.log("Receptor en chat: " + this.receiverId);
    this.loadReceiverName();
    this.loadMessages();
    this.startPolling();
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  loadMessages() {
    if (this.currentUserId && this.receiverId) {
      // Obtener mensajes de currentUserId a receiverId
      this.chatService.getMessageByUser(this.currentUserId, this.receiverId).subscribe(
        data1 => {
          // Obtener mensajes de receiverId a currentUserId
          this.chatService.getMessageByUser(this.receiverId, this.currentUserId).subscribe(
            data2 => {
              // Combinar ambos conjuntos de mensajes
              this.chats = [...data1, ...data2];
              // Ordenar los mensajes por fecha y hora
              this.chats.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
              console.log(this.chats);
              this.scrollToBottom();
            },
            error => {
              console.error('Error al cargar mensajes recibidos', error);
            }
          );
        },
        error => {
          console.error('Error al cargar mensajes enviado', error);
        }
      );
    }
  }

  loadReceiverName() {
    this.chatService.getUsers().subscribe(
      users => {
        const receiver = users.find(user => user.id === this.receiverId);
        if (receiver) {
          this.receiver = receiver.username;
        }
      },
      error => {
        console.error('Error al cargar usuarios', error);
      }
    );
  }

  sendMessage() {
    if (this.message.trim()) {
      this.isLoading = true;
      this.chatService.postPrivateMessage(this.currentUserId, this.receiverId, this.message).subscribe(
        response => {
          // Una vez enviado el mensaje recarga los mensajes para incluir el nuevo
          this.loadMessages();
          // Resetea el campo de mensaje
          this.message = '';
          this.isLoading = false;
          this.scrollToBottom();
        },
        error => {
          console.error('Error enviando mensaje', error);
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

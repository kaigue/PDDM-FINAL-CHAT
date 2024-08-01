import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../interfaces/loginResponse';
import { GroupsByUserResponse } from '../interfaces/groupsByUserResponse';
import { UsersResponse } from '../interfaces/usersReponse';
import { MessagesByUserResponse } from '../interfaces/messagesByUserResponse';
import { MessagesByGroupResponse } from '../interfaces/messagesByGroupResponse';
import { PostMessageResponse } from '../interfaces/postMessageResponse';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private http:HttpClient) { }

  login(username:string, password:string){
    var formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    var url = 'https://www.hostcatedral.com/api/app-chat/public/login';
      return this.http.post<LoginResponse>(url, formData);
  }

  getGroupsbyUser(id: number){
    var url = 'https://www.hostcatedral.com/api/app-chat/public/group-members-by-user/' + id;
    let options = {
      headers:{
        'Authorization':'Bearer ' + localStorage.getItem('token')
      }
    };
    
    return this.http.get<GroupsByUserResponse[]>(url, options);
  }

  getUsers(){
    var url = 'https://www.hostcatedral.com/api/app-chat/public/users';
    let options = {
      headers:{
        'Authorization':'Bearer ' + localStorage.getItem('token')
      }
    };
    
    return this.http.get<UsersResponse[]>(url, options);
  }

  getMessageByUser(sender_id: number, receiver_id: number){
    var url = 'https://www.hostcatedral.com/api/app-chat/public/private-messages-by-user/' + sender_id + '/' + receiver_id;
    let options = {
      headers:{
        'Authorization':'Bearer ' + localStorage.getItem('token')
      }
    };
    
    return this.http.get<MessagesByUserResponse[]>(url, options);
  }

  getMessageByGroup(group_id: number){
    var url = 'https://www.hostcatedral.com/api/app-chat/public/group-messages-by-group/' + group_id;
    let options = {
      headers:{
        'Authorization':'Bearer ' + localStorage.getItem('token')
      }
    };
    
    return this.http.get<MessagesByGroupResponse[]>(url, options);
  }

  postPrivateMessage(sender_id: number, receiver_id: number, content: string){
    var data = {
      sender_id: sender_id,
      receiver_id: receiver_id,
      content: content
  };

    var url = 'https://www.hostcatedral.com/api/app-chat/public/private-messages';
    return this.http.post<PostMessageResponse>(url, data);
  }

  postGroupMessage(sender_id: number, group_id: number, content: string){
    var data = {
      sender_id: sender_id,
      group_id: group_id,
      content: content
  };

    var url = 'https://www.hostcatedral.com/api/app-chat/public/group-messages';
    return this.http.post<PostMessageResponse[]>(url, data);
  }

}

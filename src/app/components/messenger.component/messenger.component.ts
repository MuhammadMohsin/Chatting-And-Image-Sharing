import {Component} from '@angular/core';
import {AngularFire} from 'angularfire2'
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'login',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent {

  userObj = {
    email: "",
    fullName: "",
    password: "",
    role: ""
  };

  usersRef;
  msgsRef;
  allMsgs = [];
  afRef:any;
  router;
  userService;
  authUser;
  friendList;
  userMsg: string;
  selectedUserObj;
  selectUserToSendMsg;
  myFriendChat = [];

  constructor(private af:AngularFire, _router: Router, _userservice : UserService) {
    this.router = _router;
    this.userService = _userservice;
    this.authUser = _userservice.getUserData();
    this.afRef = af;
    this.msgsRef = af.database.list("/messages");
    this.msgsRef.subscribe(messages=>{
      this.allMsgs = messages;
      if(this.selectedUserObj && this.selectedUserObj.$key)
        this.selectedUser(this.selectedUserObj);
    });
    this.usersRef = af.database.list("/users");
    this.usersRef.subscribe(users=>{
      this.friendList = users;
    })
  }

  selectedUser(userObj){
    this.selectUserToSendMsg = true;
    console.log(userObj);
    this.friendList.forEach(friend=>{
      friend.selectable = false;
    });
    userObj.selectable = true;
    this.selectedUserObj = userObj;

    this.myFriendChat = [];
    this.allMsgs.forEach(msgObj=>{
      if(msgObj.sentTo == userObj.$key && msgObj.sentBy == this.authUser.$key){
        this.myFriendChat.push(msgObj);
      }
    })

  }

  sendMsg(){
    console.log(this.userMsg);
    if(this.userMsg.trim() !=""){
      this.msgsRef.push(
        {
          sentBy : this.authUser.$key,
          sentTo : this.selectedUserObj.$key,
          message: this.userMsg,
          fileUrl: ""
        }
      ).then(data=>{
        this.userMsg ="";
      }, err=>{
        alert(err.message);
      })
    }
  }

  logout() {
    this.userService.logoutUser();
  }
}

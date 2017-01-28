import {Component, Inject} from '@angular/core';
import { AngularFire,FirebaseListObservable ,FirebaseObjectObservable, FirebaseApp} from 'angularfire2';
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import * as fb from 'firebase';

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
  private storage: fb.storage.Reference;

  constructor(private af:AngularFire, _router: Router, _userservice : UserService,@Inject(FirebaseApp) private firebaseApp: any) {
    this.router = _router;
    this.storage = this.firebaseApp.storage().ref();
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

  uploadImage() {
    for (let selectedFile of [(<HTMLInputElement>document.getElementById('uploadFile')).files[0]]) {
      if(selectedFile) {
        var thisRef = this.storage.child(selectedFile.name);
        thisRef.put(selectedFile).then((snapshot) => {
          thisRef.getDownloadURL().then(url=> {
            console.log("image url after = "+url);
            this.msgsRef.push(
              {
                sentBy : this.authUser.$key,
                sentTo : this.selectedUserObj.$key,
                message: "",
                fileUrl: url
              }
            ).then(data=>{
              alert("Image Sent");
            }, err=>{
              alert(err.message);
            })
          })
        }, (err) => {
          console.log("Error", err);
        });
      }
    }
  }

  logout() {
    this.userService.logoutUser();
  }
}

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-problem-communicator',
  templateUrl: './problem-communicator.component.html',
  styleUrls: ['./problem-communicator.component.css']
})
export class ProblemCommunicatorComponent implements OnInit {
  @Input() observables: Observable<[string, string, string]>;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  subscription: Subscription;

  userList: any = [];
  messageList: any = [];

  chatWords: string = '';
  clear: boolean = false;

  constructor() {}

  ngOnInit() {
    this.initSubscriptions();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
  initSubscriptions(){
    this.subscription = this.observables.subscribe(
      (val) => {
        const type = val[0];
        const operation = val[1];
        const data = val[2];
        console.log(val);

        switch(type){
          case 'participants':
            switch(operation){
              case 'updateColor':
                this.updateColor(data);
                break;
              case 'updateName':
                this.updateName(data);
                break;
              case 'addUser':
                this.addUser(data);
                break;
              case 'deleteUser':
                this.deleteUser(data);
                break;
              default:
            }
            break;
          case 'messages':
            this.updateChat(data);
            break;
          default:
        }
      }
    );
  }

  updateChat(data: string){
    let info = JSON.parse(data);
    let id = info.id;
    let message = info.data;
    console.log(info);

  }

  updateColor(data: string){
    let info = JSON.parse(data);
    let idList = this.userList.map(elem => elem.id);
    const index = idList.indexOf(info.id);
    if(index >= 0 ){
      this.userList[index].color = info.color;
    }
  }

  updateName(data: string){
    let info = JSON.parse(data);
    let idList = this.userList.map(elem => elem.id);
    const index = idList.indexOf(info.id);
    if(index >= 0 ){
      this.userList[index].name = info.name;
    }
  }

  addUser(data: string){
    this.userList.push(JSON.parse(data));
  }

  deleteUser(data: string){
    let idList = this.userList.map(elem => elem.id);
    const index = idList.indexOf(data);
    if(index >= 0 ){
      this.userList.splice(index, 1);
    }
  }

  sendChat(e: any){
    if(e.charCode === 13 && !e.shiftKey){
      let wordsToSend = this.chatWords.trim();
      this.clear = true;
      if(wordsToSend){
        this.notify.emit(wordsToSend);
      }
    }
  }
  
  clearChat(){
    if(this.clear){
      this.chatWords = '';
      this.clear = false;
    }
  }

}

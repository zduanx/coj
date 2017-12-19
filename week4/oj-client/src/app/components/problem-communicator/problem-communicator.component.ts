import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-problem-communicator',
  templateUrl: './problem-communicator.component.html',
  styleUrls: ['./problem-communicator.component.css']
})
export class ProblemCommunicatorComponent implements OnInit {
  @Input() observables: Observable<[string, string, string]>;

  subscription: Subscription;

  userList: any = [];
  messageList: any = [];

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
            break;
          default:
        }
      }
    );
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

}

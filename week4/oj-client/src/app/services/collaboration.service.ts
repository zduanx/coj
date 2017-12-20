import { Injectable } from '@angular/core';

declare const io: any;
declare const ace: any;
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  problemEditor: any;
  mySocketId: string;
  
  clientsInfo: Object = {};

  constructor() { }

  init(editor: any, sessionId: string, problemEditor: any): void{
    this.problemEditor = problemEditor;
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});
    this.collaborationSocket.emit('querySID');

    this.collaborationSocket.on('querySID', (id: string) => {
      this.mySocketId = id;
    })

    this.collaborationSocket.on('change', (delta: string) => {
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      //  console.log('received from server' + delta);
      editor.getSession().getDocument().applyDeltas([delta]);
    }); 

    this.collaborationSocket.on('cursorMove', (cursor: string) => {
      // console.log('cursor move' + cursor);
      const session = editor.getSession();
      cursor = JSON.parse(cursor);
      const x = cursor['row'];
      const y = cursor['column'];
      const changeClientId = cursor['socketId'];
      // console.log(x + ' ' + y +  '\n' + changeClientId);

      if (changeClientId in this.clientsInfo){
        if('marker' in this.clientsInfo[changeClientId]){         
          session.removeMarker(this.clientsInfo[changeClientId]['marker']);
        } else {
          this.clientsInfo[changeClientId]['marker'] = undefined;
          const css = document.createElement('style');
          css.type = 'text/css';
          this.updateCSSColor(css, changeClientId, this.clientsInfo[changeClientId]['color']);
          document.body.appendChild(css);
          this.clientsInfo[changeClientId]['css'] = css;
        }

        const Range = ace.require('ace/range').Range;
        const newMarker = session.addMarker(new Range(x, y, x, y + 1), `editor_cursor_${changeClientId}`, true);
        this.clientsInfo[changeClientId]['marker'] = newMarker;
      }
    });
    
    this.collaborationSocket.on('langChange', (language: string) => {
      console.log(`>> collaboration.service: socket request to change language ->${language}<-`);
      if(!language){
        this.languageSet(this.problemEditor.language)
      }
      else{
        this.problemEditor.setLanguageSoft(language);
      }
    });

    this.collaborationSocket.on('updateColor', (updates: string) => {
      const updateInfo = JSON.parse(updates);
      const uid = updateInfo['id'];
      const color = updateInfo['color'];
      if(uid in this.clientsInfo){
        if(color != this.clientsInfo[uid]['color']){
          if('css' in this.clientsInfo[uid]){
            this.updateCSSColor(this.clientsInfo[uid]['css'], uid, color);
          }
          this.clientsInfo[uid]['color'] = color;
          this.problemEditor.commuSubject.next(['participants', 'updateColor', updates]);
        }
      }
    });

    this.collaborationSocket.on('updateUserName', (updates: string) => {
      const updateInfo = JSON.parse(updates);
      const uid = updateInfo['id'];
      const name = updateInfo['name'];
      if(uid in this.clientsInfo){
        this.clientsInfo[uid]['name'] = name;
        this.problemEditor.commuSubject.next(['participants', 'updateName', updates]);
      }
    });

    this.collaborationSocket.on('addUser', (user: string) => {
      const userInfo = JSON.parse(user);
      const id = userInfo['id']
      const name = userInfo['name']
      const color = userInfo['color']
      delete this.clientsInfo[id];
      this.clientsInfo[id] = {'name': name, 'color': color};
      this.problemEditor.commuSubject.next(['participants', 'addUser', user]);
    });

    this.collaborationSocket.on('receiveChat', (data: string)=>{
      const info = JSON.parse(data);
      if(info.id in this.clientsInfo){
        info.name = this.clientsInfo[info.id]['name'];
        info.color = this.clientsInfo[info.id]['color'];
        this.problemEditor.commuSubject.next(['messages', 'data', JSON.stringify(info)]);
      }
    });

    this.collaborationSocket.on('deleteUser', (changeClientId: string) => {
      const session = editor.getSession();

      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
        if('css' in this.clientsInfo[changeClientId]){
          document.body.removeChild(this.clientsInfo[changeClientId]['css']);
        }
      }
      delete this.clientsInfo[changeClientId];
      this.problemEditor.commuSubject.next(['participants', 'deleteUser', changeClientId]);
    });
  }

  updateCSSColor(css: any, uid: string, color: string): void{
    css.innerHTML = `.editor_cursor_${uid}
                    { 
                      position:absolute;
                      background:${color};
                      z-index:100;
                      width:3px !important;
                    }`;
  }

  languageSet(language: string): void {
    this.collaborationSocket.emit('langSet', language);
  }

  change(delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }
  
  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }

  restoreUsers(): void{
    this.collaborationSocket.emit('restoreUser');
  }

  reset(): void {
    this.collaborationSocket.emit('reset');
  }
  
  cursorMove(cursor: string) {
    this.collaborationSocket.emit('cursorMove', cursor);
  }

  register(user: string, color: string){
    this.collaborationSocket.emit('register', JSON.stringify({'name': user, 'color': color}));
  }

  updateColor(color: string){
    this.collaborationSocket.emit('updateColor', color);
  }

  updateUserName(user: string){
    this.collaborationSocket.emit('updateUserName', user);
  }

  sendChat(data: string){
    this.collaborationSocket.emit('sendChat', data);
  }

  deleteMyself(){
    this.collaborationSocket.emit('deleteMyself');
  }

}

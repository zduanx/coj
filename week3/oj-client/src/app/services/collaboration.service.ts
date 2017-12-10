import { Injectable } from '@angular/core';

declare const io: any;
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  constructor() { }


  init(editor: any, sessionId: string): void{
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});

    this.collaborationSocket.on('change', (delta: string) => {
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;
      //  console.log('received from server' + delta);
      editor.getSession().getDocument().applyDeltas([delta]);
    }); 
  }

  change(delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }

  restoreBuffer(): void {
    this.collaborationSocket.emit('restoreBuffer');
  }

  reset(): void {
    this.collaborationSocket.emit('reset');
  }
}

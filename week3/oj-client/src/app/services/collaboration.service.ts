import { Injectable } from '@angular/core';
import { COLORS } from '../../assets/colors';

declare const io: any;
declare const ace: any;
@Injectable()
export class CollaborationService {
  collaborationSocket: any;
  
  clientsInfo: Object = {};
  clientNum: number = 0;

  constructor() { }

  init(editor: any, sessionId: string): void{
    this.collaborationSocket = io(window.location.origin, {query: 'sessionId=' + sessionId});

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

      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      } else {
        this.clientsInfo[changeClientId] = {};
        const css = document.createElement('style');
        css.type = 'text/css';
        css.innerHTML = `.editor_cursor_${changeClientId}
                        { 
                          position:absolute;
                          background:${COLORS[this.clientNum]};
                          z-index:100;
                          width:3px !important;
                        }`;
        document.body.appendChild(css);
        this.clientNum++;
      }
      const Range = ace.require('ace/range').Range;
      const newMarker = session.addMarker(new Range(x, y, x, y + 1), `editor_cursor_${changeClientId}`, true);
      this.clientsInfo[changeClientId]['marker'] = newMarker;
    });
    
    this.collaborationSocket.on('cursorDelete', (changeClientId: string) => {
      // console.log('delete marker for:' + changeClientId);
      const session = editor.getSession();

      if (changeClientId in this.clientsInfo) {
        session.removeMarker(this.clientsInfo[changeClientId]['marker']);
      }
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
  
  cursorMove(cursor: string) {
    this.collaborationSocket.emit('cursorMove', cursor);
  }
}

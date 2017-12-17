import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { DataService } from '../../services/data.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { AuthService } from '../../services/auth.service';

import { ActivatedRoute, Params} from '@angular/router';

declare const ace: any;
@Component({
  selector: 'app-problem-editor',
  templateUrl: './problem-editor.component.html',
  styleUrls: ['./problem-editor.component.css'],
})
export class ProblemEditorComponent implements OnInit {
  editor: any;
  defaultContent: any;
  display:string;
  languages: string[];
  themes: string[];

  language: string;
  theme: string;
  sessionId: string;
  changeGuard: boolean;

  buildoutput: string = '';
  runoutput: string = '';

  constructor(
    private collaboration: CollaborationService,
    private dataService: DataService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initParam();
      this.initEditor();
      this.initSocket();
      this.collaboration.restoreBuffer();
    });
  }

  initParam(): void {
    this.changeGuard = false;
    this.languages = ['java', 'python'];
    this.themes = ['eclipse', 'tomorrow', 'xcode'];
    this.defaultContent = {
      'java': `public class Example {\n\tpublic static void main(String[] args) {\n\t\t// Type your Java code here\n\t}\n}`,
      'python': `class Solution:\n\tdef example():\n\t\t# Write your Python code here\n\nSolution.example()`
     };
    this.language = this.languages[0];
    this.theme = this.themes[0];
  }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.initResetEditor();
  }

  initSocket(){
    // setup collabration socket
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    // register change callback
    this.editor.on('change', (e)=>{
      if(this.editor.lastAppliedChange != e && !this.changeGuard){
        this.collaboration.change(JSON.stringify(e));
      }
    });
    // register cursor move
    this.editor.getSession().getSelection().on('changeCursor', ()=> {
      const cursor = this.editor.getSession().getSelection().getCursor();
      // console.log('curser move log from client ' + JSON.stringify(cursor));
      this.collaboration.cursorMove(JSON.stringify(cursor));
    });
  }

  initResetEditor(){
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.getSession().setMode(`ace/mode/${this.language}`);
    this.editor.setValue(this.defaultContent[`${this.language}`]);
    this.editor.clearSelection();
  }

  resetPage(){
    this.initResetEditor();
    this.collaboration.reset();
  }

  setLanguage() {
    this.resetPage();
  }

  setTheme() {
    const userCode = this.editor.getValue();
    this.changeGuard = true;
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.setValue(userCode);
    this.editor.clearSelection();
    this.changeGuard = false;
  }

  submit(){
    if(!this.auth.isAuthenticated()){
      window.alert("Please sign in to submit code\nExample: root:root@coj.com");
      return;
    }
    const userCodes = this.editor.getValue();
    const data = {
      userCodes: userCodes,
      lang: this.language.toLocaleLowerCase()
    };

    this.dataService.buildAndRun(data)
      .then((res) => {
        this.buildoutput = res.buildtext;
        this.runoutput = res.runtext;
      })
      .catch( err =>
        window.alert(err)
      );
  }
}

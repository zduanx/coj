import { Component, OnInit } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

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

  constructor(
    private collaboration: CollaborationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
      this.collaboration.restoreBuffer();
    });


  }

  initEditor(): void {
    this.languages = ['java', 'python'];
    this.themes = ['eclipse', 'tomorrow', 'xcode'];
    this.defaultContent = {
      'java': `public class Solution{`,
      'python': `class Solution:`
    }

    this.language = this.languages[0];
    this.theme = this.themes[0];

    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.resetEditor();
    
    // setup collabration socket
    this.collaboration.init(this.editor, this.sessionId);
    this.editor.lastAppliedChange = null;

    // register change callback
    this.editor.on('change', (e)=>{
      // console.log('editor change'+ JSON.stringify(e));
      if(this.editor.lastAppliedChange != e){
        this.collaboration.change(JSON.stringify(e));
      }
    })
  }

  resetEditor(){
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.getSession().setMode(`ace/mode/${this.language}`);
    this.editor.setValue(this.defaultContent[`${this.language}`]);
  }

  setLanguage() {
    this.resetEditor();
  }

  setTheme() {
    const userCode = this.editor.getValue();
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.setValue(userCode);
  }

  submit(){
    const userCode = this.editor.getValue();
    console.log(userCode);
  }
}

import { Component, OnInit } from '@angular/core';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';

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

  constructor() { }

  ngOnInit() {
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
    this.editor.getSession().setMode(`ace/mode/${this.language}`);

    this.resetEditor();
  }

  resetEditor(){
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.setValue(this.defaultContent[`${this.language}`]);
  }

  setLanguage() {
    console.log(this.language);
    this.editor.getSession().setMode(`ace/mode/${this.language}`);
  }

  setTheme() {
    this.editor.setTheme(`ace/theme/${this.theme}`);

  }

  submit(){
    const userCode = this.editor.getValue();
    console.log(userCode);
  }
}

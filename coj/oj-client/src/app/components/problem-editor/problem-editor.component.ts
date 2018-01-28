import { Component, OnInit, OnDestroy } from '@angular/core';
import { CollaborationService } from '../../services/collaboration.service';
import { DataService } from '../../services/data.service';
import { CapitalizePipe } from '../../pipes/capitalize.pipe';
import { AuthService } from '../../services/auth.service';

import { ActivatedRoute, Params} from '@angular/router';
import { COLORS } from '../../../assets/colors';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/share';
import { Subscription } from 'rxjs/Subscription';

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

  submitDisable: boolean = false;
  submitText: string = 'Submit Solution';

  user: string;

  availableColors = COLORS;
  color: string = COLORS[0];

  // this is used to monitor localStorageChange
  private onSubject = new Subject<{key: string, value: any}>();
  changes = this.onSubject.asObservable().share();
  localStorageSub: Subscription;
  
  // this is used to communicate chat message and user list
  commuSubject = new Subject<[string, string, string]>();
  observables: Observable<[string, string, string]> = this.commuSubject.asObservable().share();

  constructor(
    private collaboration: CollaborationService,
    private dataService: DataService,
    private route: ActivatedRoute,
    public auth: AuthService
  ) {
    this.monitorStart();
  }

  ngOnDestroy(){
    // console.log("editor destroyed");
    this.monitorStop();
    this.commuSubject.complete();
    this.collaboration.deleteMyself();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      // console.log(params['id']);
      this.initParam();
      this.initEditor();
      this.initSocket();
      this.registerUser();
      this.collaboration.restoreUsers();
      this.collaboration.restoreBuffer();
      this.initSubscriptions();
    });
  }

  monitorStart(){
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  monitorStop(){
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.localStorageSub.unsubscribe();

    this.onSubject.complete();
  }

  private storageEventListener(event: StorageEvent){
    if(event.storageArea == localStorage){
      let v;
      try {v = JSON.parse(event.newValue);}
      catch(e) {v = event.newValue;}
      this.onSubject.next({key: event.key, value: v});
    }
  }

  initSubscriptions(){
    this.localStorageSub = this.changes.subscribe(
      value => {
        if(value.key === 'user_profile_coj'){
          this.getUserName();
          this.collaboration.updateUserName(this.user);
        }
      }
    )
  }

  getUserName(): void{
    const profile = localStorage.getItem('user_profile_coj');
    if(this.auth.isAuthenticated() && profile){
      this.user = JSON.parse(profile).name;
    }
    else{
      this.user = 'anonymous';
    }
  }

  registerUser(): void {
    this.getUserName();
    this.collaboration.register(this.user, this.color);
  }

  initParam(): void {
    this.changeGuard = false;
    this.languages = ['java', 'python'];
    this.themes = ['eclipse', 'tomorrow', 'xcode'];
    this.defaultContent = {
      'java': `public class Example {\n\tpublic static void main(String[] args) {\n\t\t// Type your Java code here\n\t}\n}`,
      'python': `class Solution:\n\tdef example():\n\t\t# Write your Python code here\n\nSolution.example()`
    };
    this.language = '';
    this.theme = this.themes[0];
  }

  initEditor(): void {
    this.editor = ace.edit("editor");
    this.editor.$blockScrolling = Infinity;
    this.initResetEditor(this.languages[0]);
  }

  initSocket(){
    // setup collabration socket
    this.collaboration.init(this.editor, this.sessionId, this);
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

  initResetEditor(language: string){
    this.setTheme();
    this.setLanguageSoft(language);
  }

  resetPage(){
    this.setLanguageSoft(this.language);
    this.collaboration.reset();
  }

  setLanguage() {
    this.collaboration.languageSet(this.language);
    this.resetPage();
  }

  public setLanguageSoft(language: string){
    this.language = language;
    this.changeGuard = true;
    this.editor.getSession().setMode(`ace/mode/${this.language}`);
    this.editor.setValue(this.defaultContent[`${this.language}`]);
    this.editor.clearSelection();
    this.changeGuard = false;
  }

  setTheme() {
    const userCode = this.editor.getValue();
    this.changeGuard = true;
    this.editor.setTheme(`ace/theme/${this.theme}`);
    this.editor.setValue(userCode);
    this.editor.clearSelection();
    this.changeGuard = false;
  }

  changeColor(){
    this.collaboration.updateColor(this.color);
  }

  sendChat(data: string){
    this.collaboration.sendChat(data);
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

    // change to true after nginx configuration
    this.submitDisable = true;
    this.submitText = 'Please Wait...';
    this.dataService.buildAndRun(data)
      .then((res) => {
        this.buildoutput = res.buildtext;
        this.runoutput = res.runtext;
        this.submitDisable = false;
        this.submitText = 'Submit Solution';
      })
      .catch( err => {
        window.alert(err);
        this.submitDisable = false;
        this.submitText = 'Submit Solution';
      });
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { AppComponent } from './app.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { ProblemEditorComponent } from './components/problem-editor/problem-editor.component';

import { DataService } from './services/data.service';
import { CollaborationService } from './services/collaboration.service';
import { AppRoutingModule } from './app-routing.module';
import { ProblemListFilterPipe } from './pipes/problem-list-filter.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    ProblemListComponent,
    ProblemDetailComponent,
    NewProblemComponent,
    NavbarComponent,
    NotFoundComponent,
    ProblemListFilterPipe,
    ProfilesComponent,
    ProblemEditorComponent,
    CapitalizePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFontAwesomeModule
  ],
  providers: [
    DataService,
    CollaborationService,
    AuthService, 
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

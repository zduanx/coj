import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth.guard';

import { NewProblemComponent } from './components/new-problem/new-problem.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { SocketDocsComponent } from './components/socket-docs/socket-docs.component'


const routes: Routes = [
  {
    path: '',
    redirectTo: 'problems',
    pathMatch: 'full'
  },
  {
    path: 'profiles',
    component: ProfilesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'problems',
    component: ProblemListComponent
  },
  {
    path: 'problems/:id',
    component: ProblemDetailComponent
  },
  {
    path: 'socketdocs/:id',
    component: SocketDocsComponent
  },
  {
    path: 'new-problems',
    component: NewProblemComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

// by importing NgModule, we are using angular.io demo way
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})

// another way: export const routing = RouterModule.forRoot(routes);
export class AppRoutingModule { }

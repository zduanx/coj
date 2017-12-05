import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

import { ProblemListFilterPipe } from '../../pipes/problem-list-filter.pipe';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css'],
})
export class ProblemListComponent implements OnInit {
  problems: Problem[];
  difficulties: string[];

  filterName: string;
  filterDiff: string;

  loginInfo: string;
  sampleAccount: string;

  subscriptionProblems: Subscription;
  constructor(
    private dataService: DataService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.loginInfo = "Please login to trigger add-problem, profile functionality";
    this.sampleAccount = "Sample account: root@coj.com password: root";

    this.getProblems();
    this.difficulties = this.dataService.getDifficulties();
    this.filterName = "";
    this.filterDiff = "";
  }

  ngOnDestroy() {
    this.subscriptionProblems.unsubscribe();
  }

  getProblems(): void {
    // this.problems = this.dataService.getProblems();
    this.subscriptionProblems = this.dataService.getProblems()
      .subscribe(problems => this.problems = problems);
  }

  deleteProblem(event: any, id: number){
    console.log("delete " + id);
    return false;
  }
}
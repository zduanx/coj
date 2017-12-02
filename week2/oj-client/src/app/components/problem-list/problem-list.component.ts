import { Component, OnInit, OnDestroy } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';

import { Subscription } from 'rxjs/Subscription';

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

  subscriptionProblems: Subscription;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
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
}
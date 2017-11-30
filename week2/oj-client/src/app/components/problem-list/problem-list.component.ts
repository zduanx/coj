import { Component, OnInit } from '@angular/core';
import { Problem } from '../../models/problem.model';
import { DataService } from '../../services/data.service';

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

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getProblems();
    this.difficulties = this.dataService.getDifficulties();
    this.filterName = "";
    this.filterDiff = "";
  }

  getProblems(): void {
    this.problems = this.dataService.getProblems();
  }
}
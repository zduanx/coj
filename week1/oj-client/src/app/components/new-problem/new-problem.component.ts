import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Problem } from '../../models/problem.model';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  newProblem: Problem;
  difficulties: string[];

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.difficulties = this.dataService.getDifficulties();
    let DEFAULT_PROBLEM: Problem = new Problem();
    DEFAULT_PROBLEM.difficulty = this.difficulties[0];
    this.newProblem = Object.assign(DEFAULT_PROBLEM);
  }

  addProblem() {
    this.dataService.addProblem(this.newProblem);
    this.router.navigate(['/problems']);
  }
}

import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { PROBLEMS } from '../mock-problems';

@Injectable()
export class DataService {
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];
  problems: Problem[] = PROBLEMS;

  constructor() { }

  // get problems
  getProblems(): Problem[] {
    return PROBLEMS;
  }

  // get one problem
  getProblem(id: number): Problem {
    return this.problems.find( problem => problem.id === id);
  }

  // get difficulties
  getDifficulties(): string[]{
    return this.difficulties;
  }

  // add problem
  addProblem(problem: Problem){
    problem.id = this.problems.length + 1;
    this.problems.push(problem);
  }

}

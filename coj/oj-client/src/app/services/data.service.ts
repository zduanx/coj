import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/toPromise';

import { Problem } from '../models/problem.model';
// import { PROBLEMS } from '../mock-problems';
@Injectable()
export class DataService {
  // problems: Problem[] = PROBLEMS;
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];
  private _problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private httpClient: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    // return this.problems;
    this.httpClient.get('api/v1/problems')
      .toPromise()
      .then((res: any) => {
        this._problemSource.next(res);
      })
      .catch(this.handleError);
      return this._problemSource.asObservable();
  }
// values, complete, error
  getProblem(id: number): Promise<Problem> {
    // return this.problems.find( (problem) => problem.id === id);
    return this.httpClient.get(`api/v1/problems/${id}`)
          .toPromise()
          .then((res: any) => res)
          .catch(this.handleError);
  }

  addProblem(problem: Problem): Promise<any>{
    // problem.id = this.problems.length + 1;
    // this.problems.push(problem);
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json'})};
    return this.httpClient.post('api/v1/problems', problem, options)
      .toPromise()
      .then((res: any) => {
        this.getProblems();
        return Promise.resolve();
      })
      .catch(this.handleError);
  }


  buildAndRun(data): Promise<any>{
    const id_token = localStorage.getItem('id_token');;
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': `Bearer ${id_token}`})};
    return this.httpClient.post('api/v1/buildresults', data, options)
      .toPromise()
      .then(res => {
        // console.log(res);
        return res;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.error);
  }
  // private handleError(error: any): any {
  //   console.log(error);
  // }

  // get difficulties
  getDifficulties(): string[]{
    return this.difficulties;
  }
}
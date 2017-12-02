import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
// import { PROBLEMS } from '../mock-problems';

// added week2
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService {
  difficulties: string[] = ['easy', 'medium', 'hard', 'super'];
  // problems: Problem[] = PROBLEMS;
  private _problemSource: any = new BehaviorSubject<Problem[]>([]);
  private _apiver: string = "api/v1";

  constructor(private httpClient: HttpClient) { }

  // get problems
  getProblems(): Observable<Problem[]> {
    // return PROBLEMS;
    this.httpClient.get(`${this._apiver}/problems`)
      .toPromise()
      .then((res:any) =>{
        this._problemSource.next(res);
      })
      .catch(this.handleError);
      return this._problemSource.asObservable();
  }

  // get one problem
  getProblem(id: number): Promise<Problem> {
    // return this.problems.find( problem => problem.id === id);
    return this.httpClient.get(`${this._apiver}/problems/${id}`)
            .toPromise()
            .then((res: any) => res)
            .catch(this.handleError);
  }

  // get difficulties
  getDifficulties(): string[]{
    return this.difficulties;
  }

  // add problem
  addProblem(problem: Problem){
    const options = {headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.httpClient.post(`${this._apiver}/problems`, problem, options)
            .toPromise()
            .then((res: any) => {
              this.getProblems();
              return res;
            })
            .catch(this.handleError);
  }

  // handle error
  private handleError(err: any) : Promise<any> {
    return Promise.reject(err.body || err);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { DataService } from '../../services/data.service';

import { Problem } from '../../models/problem.model';

@Component({
  selector: 'app-problem-detail',
  templateUrl: './problem-detail.component.html',
  styleUrls: ['./problem-detail.component.css']
})
export class ProblemDetailComponent implements OnInit {
  problem: Problem;

  constructor(
    private dataService: DataService,
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // angular.io demo method, Params import not needed
    // this.problem = this.dataService.getProblem(+this.route.snapshot.paramMap.get('id'));
    this.route.params.subscribe(params => {
      this.problem = this.dataService.getProblem(+params['id']);
    })
  }

  
  goBack(){
    this.location.back();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { Problem } from '../../models/problem.model';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {
  newProblemForm: FormGroup;
  difficulties: string[];

  constructor(
    private dataService: DataService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.difficulties = this.dataService.getDifficulties();

    // follow angular.io FUNDAMENTALS/Forms/Form Validation
    this.newProblemForm = new FormGroup({
      // new FormControl(initialValue, requirement)
      'name': new FormControl('', Validators.required),
      'desc': new FormControl('', Validators.required),
      'difficulty': new FormControl('', Validators.required)
    });
    this.resetNewProblem();
  }

  addProblem() {
    this.dataService.addProblem(this.newProblemForm.value)
      .then( () =>{
        this.router.navigate(['/problems']);
      })
      .catch(err =>{
        window.alert(err);
      })
  }

  resetNewProblem(){
    // when using reactive form, we should use newProblemForm.value
    this.newProblemForm.reset(new Problem());
  }

  goBack(){
    this.location.back();
  }

  get name() {return this.newProblemForm.get('name');}

  get desc() {return this.newProblemForm.get('desc');}

  get difficulty() {return this.newProblemForm.get('difficulty');}
}

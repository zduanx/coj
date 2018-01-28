import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-socket-docs',
  templateUrl: './socket-docs.component.html',
  styleUrls: ['./socket-docs.component.css']
})
export class SocketDocsComponent implements OnInit {
  display: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // angular.io demo method, Params import not needed
    // this.problem = this.dataService.getProblem(+this.route.snapshot.paramMap.get('id'));
    this.route.params.subscribe(params => {
      // this.problem = this.dataService.getProblem(+params['id']);
      if(+params['id'] !== 0){
        this.handleError();
      }else{
        this.display = true;
      }
    });
  }

  handleError(){
    this.router.navigate(['/not-found']);
  }

}

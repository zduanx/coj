import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-problem-communicator',
  templateUrl: './problem-communicator.component.html',
  styleUrls: ['./problem-communicator.component.css']
})
export class ProblemCommunicatorComponent implements OnInit {
  @Input() participants: any;

  constructor() { }

  ngOnInit() {
  }

}

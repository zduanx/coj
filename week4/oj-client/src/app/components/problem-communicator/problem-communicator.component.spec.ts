import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemCommunicatorComponent } from './problem-communicator.component';

describe('ProblemCommunicatorComponent', () => {
  let component: ProblemCommunicatorComponent;
  let fixture: ComponentFixture<ProblemCommunicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProblemCommunicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProblemCommunicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

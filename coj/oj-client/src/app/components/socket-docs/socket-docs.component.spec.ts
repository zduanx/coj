import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketDocsComponent } from './socket-docs.component';

describe('SocketDocsComponent', () => {
  let component: SocketDocsComponent;
  let fixture: ComponentFixture<SocketDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

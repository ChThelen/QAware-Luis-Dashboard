import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DbExampleInteractionComponent } from './db-example-interaction.component';

describe('DbExampleInteractionComponent', () => {
  let component: DbExampleInteractionComponent;
  let fixture: ComponentFixture<DbExampleInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DbExampleInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DbExampleInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployJsonComponent } from './deploy-json.component';

describe('DeployJsonComponent', () => {
  let component: DeployJsonComponent;
  let fixture: ComponentFixture<DeployJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployJsonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

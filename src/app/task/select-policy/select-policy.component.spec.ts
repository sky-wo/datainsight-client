import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPolicyComponent } from './select-policy.component';

describe('SelectPolicyComponent', () => {
  let component: SelectPolicyComponent;
  let fixture: ComponentFixture<SelectPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectPolicyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdDetailComponent } from './household-detail.component';

describe('HouseholdDetailComponent', () => {
  let component: HouseholdDetailComponent;
  let fixture: ComponentFixture<HouseholdDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HouseholdDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HouseholdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

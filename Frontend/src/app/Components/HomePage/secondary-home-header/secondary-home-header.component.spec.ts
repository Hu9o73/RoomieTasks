import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryHomeHeaderComponent } from './secondary-home-header.component';

describe('SecondaryHomeHeaderComponent', () => {
  let component: SecondaryHomeHeaderComponent;
  let fixture: ComponentFixture<SecondaryHomeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryHomeHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondaryHomeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

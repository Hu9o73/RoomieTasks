import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProfileMainComponent } from './my-profile-main.component';

describe('MyProfileMainComponent', () => {
  let component: MyProfileMainComponent;
  let fixture: ComponentFixture<MyProfileMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyProfileMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyProfileMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

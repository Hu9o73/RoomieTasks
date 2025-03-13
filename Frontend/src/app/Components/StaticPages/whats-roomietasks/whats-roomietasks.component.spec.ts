import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsESNComponent } from './whats-roomietasks.component';

describe('WhatsESNComponent', () => {
  let component: WhatsESNComponent;
  let fixture: ComponentFixture<WhatsESNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsESNComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsESNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

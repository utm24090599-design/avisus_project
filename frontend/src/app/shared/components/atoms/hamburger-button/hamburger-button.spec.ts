import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HamburgerButton } from './hamburger-button';

describe('HamburgerButton', () => {
  let component: HamburgerButton;
  let fixture: ComponentFixture<HamburgerButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburgerButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HamburgerButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

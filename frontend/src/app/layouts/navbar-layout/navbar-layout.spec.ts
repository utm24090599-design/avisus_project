import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLayout } from './navbar-layout';

describe('NavbarLayout', () => {
  let component: NavbarLayout;
  let fixture: ComponentFixture<NavbarLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

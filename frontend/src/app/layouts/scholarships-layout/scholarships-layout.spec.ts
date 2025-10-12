import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipsLayout } from './scholarships-layout';

describe('ScholarshipsLayout', () => {
  let component: ScholarshipsLayout;
  let fixture: ComponentFixture<ScholarshipsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScholarshipsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarshipsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

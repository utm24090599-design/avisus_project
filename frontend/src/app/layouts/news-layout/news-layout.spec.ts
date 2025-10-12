import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsLayout } from './news-layout';

describe('NewsLayout', () => {
  let component: NewsLayout;
  let fixture: ComponentFixture<NewsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

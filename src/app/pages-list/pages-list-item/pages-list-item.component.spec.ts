import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesListItemComponent } from './pages-list-item.component';

describe('PagesListItemComponent', () => {
  let component: PagesListItemComponent;
  let fixture: ComponentFixture<PagesListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagesListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

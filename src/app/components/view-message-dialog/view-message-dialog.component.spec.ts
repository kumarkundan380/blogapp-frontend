import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMessageDialogComponent } from './view-message-dialog.component';

describe('ViewmessageDialogComponent', () => {
  let component: ViewMessageDialogComponent;
  let fixture: ComponentFixture<ViewMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMessageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

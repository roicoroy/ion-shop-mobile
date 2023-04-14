import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordlessCallbackPage } from './passwordless-callback.page';

describe('PasswordlessCallbackPage', () => {
  let component: PasswordlessCallbackPage;
  let fixture: ComponentFixture<PasswordlessCallbackPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PasswordlessCallbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

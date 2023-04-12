import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth0CallbackPage } from './auth0-callback.page';

describe('Auth0CallbackPage', () => {
  let component: Auth0CallbackPage;
  let fixture: ComponentFixture<Auth0CallbackPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Auth0CallbackPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

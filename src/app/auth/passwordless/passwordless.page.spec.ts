import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordlessPage } from './passwordless.page';

describe('PasswordlessPage', () => {
  let component: PasswordlessPage;
  let fixture: ComponentFixture<PasswordlessPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PasswordlessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VariantModalPage } from './variant-modal.page';

describe('VariantModalPage', () => {
  let component: VariantModalPage;
  let fixture: ComponentFixture<VariantModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VariantModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

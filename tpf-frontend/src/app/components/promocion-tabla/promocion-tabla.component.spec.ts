import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromocionTablaComponent } from './promocion-tabla.component';

describe('PromocionTablaComponent', () => {
  let component: PromocionTablaComponent;
  let fixture: ComponentFixture<PromocionTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromocionTablaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PromocionTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

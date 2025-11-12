import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlquilerFormComponent } from './alquiler-form.component';

describe('AlquilerFormComponent', () => {
  let component: AlquilerFormComponent;
  let fixture: ComponentFixture<AlquilerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlquilerFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlquilerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAlquilerComponent } from './tabla-alquiler.component';

describe('TablaAlquilerComponent', () => {
  let component: TablaAlquilerComponent;
  let fixture: ComponentFixture<TablaAlquilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaAlquilerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaAlquilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

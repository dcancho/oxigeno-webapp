import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapa1Component } from './mapa-1.component';

describe('Mapa1Component', () => {
  let component: Mapa1Component;
  let fixture: ComponentFixture<Mapa1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapa1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Mapa1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { OxigenoService } from './oxigeno.service';

describe('OxigenoService', () => {
  let service: OxigenoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OxigenoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

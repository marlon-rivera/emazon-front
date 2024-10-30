import { TestBed } from '@angular/core/testing';

import { SupplyService } from './supply.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddSuply } from '../interfaces/supply.interface';
import { API_URL_SUPPLY } from '../utils/api.constants';

describe('SupplyService', () => {
  let service: SupplyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplyService]
    });

    service = TestBed.inject(SupplyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a POST request to save a supply', () => {
    const mockSaveSupply: AddSuply = {
      idArticle: 1,
      quantity: 10
    }
    service.addSupply(mockSaveSupply).subscribe();
    const req = httpMock.expectOne(`${API_URL_SUPPLY}/add`)
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSaveSupply);
    req.flush(null);
  })
});

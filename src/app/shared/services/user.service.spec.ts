import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateUser } from '../interfaces/user.interface';
import { API_URL_USER } from '../utils/api.constants';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createWarehouseAssistant', () => {
    it('should make a POST request to create a warehouse assistant', ()=>{
      const mockWarehouseAssistantCreate: CreateUser = {
        id: 1,
        name: 'Test',
        lastName: 'Test',
        email: 'test@test.com',
        birthDate: new Date(2001, 0, 0),
        password: '1234567',
        phone: '+573000000000'
      };

      service.createWarehouseAssistant(mockWarehouseAssistantCreate).subscribe();

      const req = httpMock.expectOne(`${API_URL_USER}/registerWarehouse`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockWarehouseAssistantCreate);

      req.flush(null);
    });
  })

  describe('createClient', () => {
    it('should make a POST request to create a client', ()=>{
      const mockClientCreate: CreateUser = {
        id: 1,
        name: 'Test',
        lastName: 'Test',
        email: 'test@test.com',
        birthDate: new Date(2001, 0, 0),
        password: '1234567',
        phone: '+573000000000'
      };

      service.createClient(mockClientCreate).subscribe();

      const req = httpMock.expectOne(`${API_URL_USER}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockClientCreate);

      req.flush(null);
    });
  })
});

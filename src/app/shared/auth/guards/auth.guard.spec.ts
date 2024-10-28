import { TestBed } from "@angular/core/testing";
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "../../services/auth.service";
import { of } from "rxjs";

describe("AuthGuard", () => {
  let authGuard: AuthGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const state: RouterStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: of(false),
    } as jest.Mocked<AuthService>;
    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    authGuard = TestBed.inject(AuthGuard);
  });

  it("should allow access if the user is authenticated", (done) => {
    authServiceMock.isLoggedIn = of(true);

    authGuard.canActivate(route, state).subscribe((canActivate) => {
      expect(canActivate).toBe(true);
      done();
    });
  });

  it("should redirect the user to /login if they are not authenticated", (done) => {
    authServiceMock.isLoggedIn = of(false);
    authGuard.canActivate(route, state).subscribe((canActivate) => {
      expect(canActivate).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(["/login"]);
      done();
    });
  });
});

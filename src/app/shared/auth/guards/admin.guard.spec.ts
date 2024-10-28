import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AdminGuard } from "./admin.guard";
import { AuthService } from "../../services/auth.service";

describe("AdminGuard", () => {
  let adminGuard: AdminGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;
  const route: ActivatedRouteSnapshot = {} as ActivatedRouteSnapshot;
  const state: RouterStateSnapshot = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = {
      infoToken: { role: "USER" },
    } as unknown as jest.Mocked<AuthService>;

    routerMock = { navigate: jest.fn() } as unknown as jest.Mocked<Router>;
    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });
    adminGuard = TestBed.inject(AdminGuard);
  });

  it("should allow access if the user role is ADMIN", () => {
    authServiceMock.infoToken!.role = "ADMIN";
    const canActivate = adminGuard.canActivate(route, state);
    expect(canActivate).toBe(true);
  });

  it("should redirect the user to /articles/list if the role is not ADMIN", () => {
    authServiceMock.infoToken!.role = "USER";
    const canActivate = adminGuard.canActivate(route, state);
    expect(canActivate).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(["/articles/list"]);
  });
});

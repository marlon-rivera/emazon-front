import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { FormBuilder } from "@angular/forms";
import { AuthService } from "@/app/shared/services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import {
  ADMIN_ROLE,
  WAREHOUSE_ROLE,
  CLIENT_ROLE,
  NOTIFICATION_TYPE,
} from "@/app/shared/utils/api.constants";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      login: jest.fn(),
      infoToken: { role: "" },
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the login form correctly", () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls["email"]).toBeDefined();
    expect(component.loginForm.controls["password"]).toBeDefined();
  });

  it("should mark the form as invalid if the fields are empty", () => {
    component.loginForm.setValue({ email: "", password: "" });
    expect(component.loginForm.valid).toBeFalsy();
  });

  it("should perform a successful login and navigate to the control panel if the role is ADMIN_ROLE", () => {
    authServiceMock.login.mockReturnValue(of({ token: "fake-jwt-token" }));
    authServiceMock.infoToken!.role = ADMIN_ROLE;
    component.loginForm.setValue({
      email: "admin@test.com",
      password: "password",
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: "admin@test.com",
      password: "password",
    });
    expect(component.notificationMessage).toBe("Login exitoso.");
    expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);
    expect(component.showNotification).toBeTruthy();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/control-panel"]);
  });

  it("should perform a successful login and navigate to the article list if the role is WAREHOUSE_ROLE", () => {
    authServiceMock.login.mockReturnValue(of({ token: "fake-jwt-token" }));
    authServiceMock.infoToken!.role = WAREHOUSE_ROLE;
    component.loginForm.setValue({
      email: "user@test.com",
      password: "password",
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: "user@test.com",
      password: "password",
    });
    expect(component.notificationMessage).toBe("Login exitoso.");
    expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);
    expect(component.showNotification).toBeTruthy();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/articles/list"]);
  });

  it("should perform a successful login and navigate to the article list if the role is CLIENT_ROLE", () => {
    authServiceMock.login.mockReturnValue(of({ token: "fake-jwt-token" }));
    authServiceMock.infoToken!.role = CLIENT_ROLE;
    component.loginForm.setValue({
      email: "user@test.com",
      password: "password",
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: "user@test.com",
      password: "password",
    });
    expect(component.notificationMessage).toBe("Login exitoso.");
    expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);
    expect(component.showNotification).toBeTruthy();
    expect(routerMock.navigate).toHaveBeenCalledWith(["/articles/list"]);
  });

  it("should display an error message if the authentication fails", () => {
    authServiceMock.login.mockReturnValue(
      throwError({ error: { message: "Authentication error" } })
    );
    component.loginForm.setValue({
      email: "invalid@test.com",
      password: "wrongpassword",
    });

    component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalled();
    expect(component.notificationMessage).toBe("Authentication error");
    expect(component.notificationType).toBe(NOTIFICATION_TYPE.ERROR);
    expect(component.showNotification).toBeTruthy();
  });

  it("should hide the notification automatically after 3 seconds", fakeAsync(() => {
    component.showNotification = true;
    component.autoHideNotification();

    tick(3000);

    expect(component.showNotification).toBeFalsy();
  }));
});

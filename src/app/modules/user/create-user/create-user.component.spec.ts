import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { CreateUserComponent } from "./create-user.component";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { UserService } from "@/app/shared/services/user.service";
import { of, throwError } from "rxjs";
import {
  NOTIFICATION_TYPE,
  TYPE_USER_WAREHOUSE_ASSISTANT,
} from "@/app/shared/utils/api.constants";

describe("CreateUserComponent", () => {
  let component: CreateUserComponent;
  let fixture: ComponentFixture<CreateUserComponent>;
  let userService: jest.Mocked<UserService>;

  const mockUserType = {
    type: TYPE_USER_WAREHOUSE_ASSISTANT,
    message: "Usuario creado exitosamente",
  };

  const mockValidUser = {
    name: "John",
    lastName: "Doe",
    id: "1234567890",
    phone: "+573123456789",
    birthDate: "1990-01-01",
    email: "john@example.com",
    password: "123456",
  };

  beforeEach(async () => {
    userService = {
      createWarehouseAssistant: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      declarations: [CreateUserComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder, { provide: UserService, useValue: userService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateUserComponent);
    component = fixture.componentInstance;
    component.userType = mockUserType;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have userType input set", () => {
    expect(component.userType).toEqual(mockUserType);
  });

  it("should initialize form with empty values", () => {
    expect(component.registerForm.value).toEqual({
      name: "",
      lastName: "",
      id: "",
      phone: "",
      birthDate: "",
      email: "",
      password: "",
    });
  });

  describe("Form Validations", () => {
    it("should validate required fields", () => {
      const form = component.registerForm;
      expect(form.valid).toBeFalsy();

      Object.keys(form.controls).forEach((key) => {
        const control = form.get(key);
        expect(control?.errors?.["required"]).toBeTruthy();
        expect(control?.valid).toBeFalsy();
      });
    });

    it("should validate ID format (numbers only)", () => {
      const idControl = component.registerForm.get("id");

      idControl?.setValue("abc123");
      expect(idControl?.hasError("pattern")).toBeTruthy();

      idControl?.setValue("123456");
      expect(idControl?.hasError("pattern")).toBeFalsy();
    });

    it("should validate phone format and length", () => {
      const phoneControl = component.registerForm.get("phone");

      phoneControl?.setValue("123456789");
      expect(phoneControl?.hasError("pattern")).toBeTruthy();

      phoneControl?.setValue("+5731234567890");
      expect(phoneControl?.hasError("maxlength")).toBeTruthy();

      phoneControl?.setValue("+573123456789");
      expect(phoneControl?.valid).toBeTruthy();

      phoneControl?.setValue("3123456789");
      expect(phoneControl?.valid).toBeTruthy();
    });

    it("should validate password minimum length", () => {
      const passwordControl = component.registerForm.get("password");

      passwordControl?.setValue("12345");
      expect(passwordControl?.hasError("minlength")).toBeTruthy();

      passwordControl?.setValue("123456");
      expect(passwordControl?.hasError("minlength")).toBeFalsy();
    });

    it("should validate email format", () => {
      const emailControl = component.registerForm.get("email");

      emailControl?.setValue("invalid-email");
      expect(emailControl?.hasError("email")).toBeTruthy();

      emailControl?.setValue("valid@email.com");
      expect(emailControl?.hasError("email")).toBeFalsy();
    });

    it("should validate age", () => {
      const birthDateControl = component.registerForm.get("birthDate");

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      birthDateControl?.setValue(futureDate.toISOString().split("T")[0]);
      expect(birthDateControl?.hasError("futureDate")).toBeTruthy();

      const underageDate = new Date();
      underageDate.setFullYear(underageDate.getFullYear() - 17);
      birthDateControl?.setValue(underageDate.toISOString().split("T")[0]);
      expect(birthDateControl?.hasError("underage")).toBeTruthy();

      const validDate = new Date();
      validDate.setFullYear(validDate.getFullYear() - 20);
      birthDateControl?.setValue(validDate.toISOString().split("T")[0]);
      expect(birthDateControl?.valid).toBeTruthy();
    });
  });

  describe("Form Submission", () => {
    it("should call createWarehouseAssistant on valid form submission", fakeAsync(() => {
      userService.createWarehouseAssistant.mockReturnValue(of(void 0));

      Object.keys(mockValidUser).forEach((key) => {
        component.registerForm
          .get(key)
          ?.setValue(mockValidUser[key as keyof typeof mockValidUser]);
      });

      component.onSubmit();
      tick();

      expect(userService.createWarehouseAssistant).toHaveBeenCalledWith(
        mockValidUser
      );
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);
      expect(component.notificationMessage).toBe(mockUserType.message);

      expect(component.registerForm.pristine).toBeTruthy();

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));

    it("should call createClient on valid form submission", fakeAsync(() => {
      userService.createWarehouseAssistant.mockReturnValue(of(void 0));

      Object.keys(mockValidUser).forEach((key) => {
        component.registerForm
          .get(key)
          ?.setValue(mockValidUser[key as keyof typeof mockValidUser]);
      });

      component.userType = {
        type: "client",
        message: "Usuario creado correctamente.",
      };
      component.onSubmit();
      tick();

      expect(userService.createClient).toHaveBeenCalledWith(mockValidUser);
      expect(component.showNotification).toBeTruthy();
      expect(component.notificationType).toBe(NOTIFICATION_TYPE.SUCCESS);
      expect(component.notificationMessage).toBe(mockUserType.message);

      expect(component.registerForm.pristine).toBeTruthy();

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));

    it("should handle error on form submission", fakeAsync(() => {
      const errorMessage = "Error al crear usuario";
      userService.createWarehouseAssistant.mockReturnValue(
        throwError(() => ({ error: { message: errorMessage } }))
      );

      Object.keys(mockValidUser).forEach((key) => {
        component.registerForm
          .get(key)
          ?.setValue(mockValidUser[key as keyof typeof mockValidUser]);
      });

      component.onSubmit();
      tick();

      expect(component.showNotification).toBeTruthy();
      expect(component.notificationType).toBe(NOTIFICATION_TYPE.ERROR);
      expect(component.notificationMessage).toBe(errorMessage);

      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));

    it("should not submit if form is invalid", () => {
      component.onSubmit();
      expect(userService.createWarehouseAssistant).not.toHaveBeenCalled();
    });
  });

  describe("Auto-hide notification", () => {
    it("should auto-hide notification after 3 seconds", fakeAsync(() => {
      component.showNotification = true;
      component.autoHideNotification();

      expect(component.showNotification).toBeTruthy();
      tick(3000);
      expect(component.showNotification).toBeFalsy();
    }));
  });
});

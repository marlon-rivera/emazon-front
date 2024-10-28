import { Component, Input, OnInit } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import {
  NotificationType,
  NOTIFICATION_TYPE,
  MAX_LENGTH_PHONE,
  MIN_AGE,
  MIN_LENGTH_PASSWORD,
  TYPE_USER_WAREHOUSE_ASSISTANT,
} from "@/app/shared/utils/api.constants";
import { UserService } from "@/app/shared/services/user.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-create-user",
  templateUrl: "./create-user.component.html",
  styleUrls: ["./create-user.component.scss"],
})
export class CreateUserComponent implements OnInit {
  @Input() userType!: { type: string; message: string };
  registerForm!: FormGroup;
  notificationMessage: string = "";
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;
  showNotification: boolean = false;

  constructor(
    readonly fb: FormBuilder,
    readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ["", Validators.required],
      lastName: ["", Validators.required],
      id: ["", [Validators.required, Validators.pattern("^[0-9]*$")]],
      phone: [
        "",
        [
          Validators.required,
          Validators.maxLength(MAX_LENGTH_PHONE),
          Validators.pattern("^\\+573\\d{9}$|^3\\d{9}$"),
        ],
      ],
      birthDate: ["", [Validators.required, this.ageValidator(MIN_AGE)]],
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [Validators.required, Validators.minLength(MIN_LENGTH_PASSWORD)],
      ],
    });
  }

  ageValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (birthDate > today) {
        return { futureDate: true };
      }

      if (age < minAge) {
        return { underage: true };
      }

      return null;
    };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      let request: Observable<void>;
      if (this.userType.type === TYPE_USER_WAREHOUSE_ASSISTANT) {
        request = this.userService.createWarehouseAssistant(
          this.registerForm.value
        );
      }
      request!.subscribe({
        next: () => {
          this.notificationMessage = this.userType.message;
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.showNotification = true;
          this.registerForm.reset();
          this.autoHideNotification();
        },
        error: (err) => {
          console.log(err.error);
          this.notificationMessage = err.error.message;
          this.notificationType = NOTIFICATION_TYPE.ERROR;
          this.showNotification = true;
          this.autoHideNotification();
        },
      });
    }
  }

  autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }
}

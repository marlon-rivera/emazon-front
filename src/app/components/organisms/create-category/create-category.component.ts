import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  EMPTY,
  MAX_CHARACTERS_CATEGORY_DESCRIPTION,
  MAX_CHARACTERS_CATEGORY_NAME,
} from "src/core/constants/api.constants";
import { CategoryService } from "src/core/services/category.service";
import { CategoryCreate } from "src/core/interfaces/category.interface";

@Component({
  selector: "app-create-category",
  templateUrl: "./create-category.component.html",
  styleUrls: ["./create-category.component.scss"],
})
export class CreateCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  showNotification: boolean = false;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryForm = this.formBuilder.group({
      name: [
        EMPTY,
        [
          Validators.required,
          Validators.maxLength(MAX_CHARACTERS_CATEGORY_NAME),
        ],
      ],
      description: [
        EMPTY,
        [
          Validators.required,
          Validators.maxLength(MAX_CHARACTERS_CATEGORY_DESCRIPTION),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const createCategory: CategoryCreate = {
        name: this.categoryForm.get("name")?.value,
        description: this.categoryForm.get("description")?.value,
      };

      this.categoryService.createCategory(createCategory).subscribe({
        next: () => {
          this.notificationMessage = "Categoría creada exitosamente";
          this.notificationType = "success";
          this.showNotification = true;
          this.categoryForm.reset(); 
          this.autoHideNotification();
        },
        error: (err) => {
          this.notificationMessage = err.error.message;
          this.notificationType = "error";
          this.showNotification = true;
          this.autoHideNotification();
        },
      });
    }
  }

  private autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
      console.log("Entre")
    }, 3000);
  }
}

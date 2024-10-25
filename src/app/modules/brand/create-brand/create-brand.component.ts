import { EMPTY, MAX_CHARACTERS_BRAND_DESCRIPTION, MAX_CHARACTERS_BRAND_NAME, NOTIFICATION_TYPE, NotificationType } from '@/app/shared/utils/api.constants';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { BrandCreate } from '@/app/shared/interfaces/brandinterface';
import { BrandService } from '@/app/shared/services/brand.service';
@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss']
})
export class CreateBrandComponent implements OnInit {

  brandForm!: FormGroup;
  notificationMessage: string = '';
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;
  showNotification: boolean = false;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly brandService: BrandService
  ) {}

  ngOnInit() {
    this.brandForm = this.formBuilder.group({
      name: [
        EMPTY,
        [
          Validators.required,
          Validators.maxLength(MAX_CHARACTERS_BRAND_NAME),
        ],
      ],
      description: [
        EMPTY,
        [
          Validators.required,
          Validators.maxLength(MAX_CHARACTERS_BRAND_DESCRIPTION),
        ],
      ],
    });
  }

  onSubmit() {
    if (this.brandForm.valid) {
      const createBrand: BrandCreate = {
        name: this.brandForm.get("name")!.value,
        description: this.brandForm.get("description")!.value,
      };

      this.brandService.createBrand(createBrand).subscribe({
        next: () => {
          this.notificationMessage = "Marca creada exitosamente";
          this.notificationType = NOTIFICATION_TYPE.SUCCESS;
          this.showNotification = true;
          this.brandForm.reset(); 
          this.autoHideNotification();
        },
        error: (err) => {
          this.notificationMessage = err.error.message;
          this.notificationType = NOTIFICATION_TYPE.ERROR;
          this.showNotification = true;
          this.autoHideNotification();
        },
      });
    }
  }

  private autoHideNotification() {
    setTimeout(() => {
      this.showNotification = false;
    }, 3000);
  }

}

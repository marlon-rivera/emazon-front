import { Article } from "@/app/shared/interfaces/article.interface";
import { AuthService } from "@/app/shared/services/auth.service";
import { ShoppingCartService } from "@/app/shared/services/shopping-cart.service";
import {
  CLIENT_ROLE,
  NOTIFICATION_TYPE,
  NotificationType,
  WAREHOUSE_ROLE,
} from "@/app/shared/utils/api.constants";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-article-card",
  templateUrl: "./article-card.component.html",
  styleUrls: ["./article-card.component.scss"],
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: Article;
  @Output() openModal = new EventEmitter<Article>();
  warehouseAssistant!: boolean;
  client!: boolean;
  showModalAddCart: boolean = false;
  quantityToAdd!: FormControl;
  showNotification: boolean = false;
  notificationMessage!: string;
  notificationType: NotificationType = NOTIFICATION_TYPE.SUCCESS;

  constructor(
    readonly authService: AuthService,
    readonly shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    this.warehouseAssistant =
      this.authService.infoToken!.role === WAREHOUSE_ROLE;
    this.client = this.authService.infoToken!.role === CLIENT_ROLE;
    this.quantityToAdd = new FormControl(0, [
      Validators.required,
      Validators.min(1),
      Validators.pattern("^[0-9]*$"),
    ]);
  }

  onOpenModal(): void {
    this.openModal.emit(this.article);
  }

  onOpenModalAddToCart(): void {
    this.showModalAddCart = true;
  }

  onCloseModalAddToCart(): void {
    this.showModalAddCart = false;
  }

  onChangeQuantityToAdd(event: string): void {
    this.quantityToAdd.setValue(event);
  }

  onSumbitArticleToAddShoppingCart(): void {
    if (this.quantityToAdd.valid) {
      this.shoppingCartService
        .addToShoppingCart({
          idArticle: this.article.id,
          quantity: this.quantityToAdd.value,
        })
        .subscribe({
          next: () => {
            this.notificationMessage =
              "Producto agregado correctamente al carrito.";
            this.notificationType = NOTIFICATION_TYPE.SUCCESS;
            this.showNotification = true;
            this.quantityToAdd.reset();
            this.autoHideNotification();
          },
          error: (err) => {
            console.log(err)
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

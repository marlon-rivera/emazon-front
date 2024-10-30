import { Article } from "@/app/shared/interfaces/article.interface";
import { AuthService } from "@/app/shared/services/auth.service";
import { WAREHOUSE_ROLE } from "@/app/shared/utils/api.constants";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-article-card",
  templateUrl: "./article-card.component.html",
  styleUrls: ["./article-card.component.scss"],
})
export class ArticleCardComponent implements OnInit {
  @Input() article!: Article;
  @Output() openModal = new EventEmitter<Article>();
  warehouseAssistant!: boolean;

  constructor(readonly authService : AuthService) { }

  ngOnInit(): void {
    this.warehouseAssistant = this.authService.infoToken!.role === WAREHOUSE_ROLE;
  }

  onOpenModal(): void{
    this.openModal.emit(this.article);
  }

}

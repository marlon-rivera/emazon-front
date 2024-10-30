import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateClientComponent } from "./create-client/create-client.component";
import { UserModule } from "../user/user.module";

@NgModule({
  declarations: [CreateClientComponent],
  imports: [CommonModule, UserModule]
})
export class ClientModule {}

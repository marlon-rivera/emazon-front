import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent{
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  show: boolean = true;
}

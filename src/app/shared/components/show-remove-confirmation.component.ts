import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-show-remove-confirmation',
  templateUrl: './show-remove-confirmation.component.html',
  styleUrls: ['./show-remove-confirmation.component.scss'],
})
export class ShowRemoveConfirmationComponent {
  @Input() isVisible: boolean = false;
  @Output() undo = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onUndo(): void {
    this.undo.emit();
  }

  onClose(): void {
    this.close.emit();
  }
}

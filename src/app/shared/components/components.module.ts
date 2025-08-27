import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileSelectComponent } from './mobile-select.component';
import { DatePickerComponent } from './date-picker.component';
import { CalendarIconComponent } from '../icons/calendar-icon.component';
import { ShowRemoveConfirmationComponent } from './show-remove-confirmation.component';

@NgModule({
  declarations: [
    MobileSelectComponent,
    DatePickerComponent,
    CalendarIconComponent,
    ShowRemoveConfirmationComponent,
  ],
  imports: [CommonModule],
  exports: [
    MobileSelectComponent,
    DatePickerComponent,
    CalendarIconComponent,
    ShowRemoveConfirmationComponent,
  ],
})
export class ComponentsModule {}

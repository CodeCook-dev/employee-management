import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() disabled: boolean = false;
  @Input() placeholder: string = 'No date';
  @Input() defaultDate?: Date;
  @Input() variant: 'start' | 'end' = 'start';
  @Input() minDate?: Date; // For end date picker to disallow dates before start date

  @Output() dateChange = new EventEmitter<Date>();

  isModalOpen = false;
  selectedDate?: Date; // This is the final selected date shown in the trigger
  tempSelectedDate?: Date; // This is the temporary selection while modal is open
  currentMonth: Date = new Date();
  calendarDates: Array<{ date: Date; isCurrentMonth: boolean }> = [];
  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit() {
    this.initializeDates();
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['defaultDate'] || changes['minDate']) {
      this.initializeDates();
      this.generateCalendar();
    }
  }

  private initializeDates() {
    if (this.defaultDate) {
      this.selectedDate = new Date(this.defaultDate);
    } else {
      this.selectedDate = undefined;
    }

    if (this.minDate) {
      this.minDate = new Date(this.minDate);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  openModal() {
    if (!this.disabled) {
      this.isModalOpen = true;
      // Initialize temporary selection with current selection
      this.tempSelectedDate = this.selectedDate
        ? new Date(this.selectedDate)
        : undefined;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  previousMonth() {
    // Don't navigate if the previous month is disabled
    if (this.isPreviousMonthDisabled()) {
      return;
    }

    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Calculate how many days from previous month we need to show
    const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.

    this.calendarDates = [];

    // Add empty cells for days from previous month to align the grid
    for (let i = 0; i < firstDayOfWeek; i++) {
      this.calendarDates.push({
        date: new Date(year, month - 1, 0 - (firstDayOfWeek - i - 1)),
        isCurrentMonth: false,
      });
    }

    // Add all days of the current month
    const current = new Date(firstDay);
    while (current <= lastDay) {
      this.calendarDates.push({
        date: new Date(current),
        isCurrentMonth: true,
      });
      current.setDate(current.getDate() + 1);
    }

    // Fill remaining cells to complete the 6-week grid (42 cells total)
    const remainingCells = 42 - this.calendarDates.length;
    for (let i = 0; i < remainingCells; i++) {
      this.calendarDates.push({
        date: new Date(year, month + 1, i + 1),
        isCurrentMonth: false,
      });
    }
  }

  selectDate(date: Date) {
    // Only allow selection of dates from the current month and not disabled
    if (
      date.getMonth() === this.currentMonth.getMonth() &&
      !this.isDateDisabled(date)
    ) {
      this.tempSelectedDate = date;
    }
  }

  isSelectedDate(date: Date): boolean {
    if (!this.selectedDate) return false;
    return (
      date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  isTempSelectedDate(date: Date): boolean {
    if (!this.tempSelectedDate) return false;
    return (
      date.getDate() === this.tempSelectedDate.getDate() &&
      date.getMonth() === this.tempSelectedDate.getMonth() &&
      date.getFullYear() === this.tempSelectedDate.getFullYear()
    );
  }

  isDateDisabled(date: Date): boolean {
    if (!this.minDate) return false;
    return date < this.minDate;
  }

  isTodayDisabled(): boolean {
    return this.isDateDisabled(new Date());
  }

  isPreviousMonthDisabled(): boolean {
    // Only check for end date picker with minDate
    if (this.variant !== 'end' || !this.minDate) {
      return false;
    }

    // Check if the previous month would be before the minDate
    const previousMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );

    // Get the last day of the previous month
    const lastDayOfPreviousMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth(),
      0
    );

    // If the entire previous month is before minDate, disable the button
    // This means if the last day of the previous month is before minDate
    return lastDayOfPreviousMonth < this.minDate;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  setToday() {
    this.selectedDate = new Date();
  }

  cancelSelection() {
    // Reset temporary selection and close modal without changing the final selection
    this.tempSelectedDate = undefined;
    this.closeModal();
  }

  selectToday() {
    const today = new Date();
    if (!this.isDateDisabled(today)) {
      this.tempSelectedDate = today;
      this.currentMonth = new Date();
      this.generateCalendar();
    }
  }

  selectNextMonday() {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((7 - today.getDay()) % 7) + 1);
    this.tempSelectedDate = nextMonday;
    this.currentMonth = new Date(nextMonday);
    this.generateCalendar();
  }

  selectNextTuesday() {
    const today = new Date();
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + ((8 - today.getDay()) % 7) + 1);
    this.tempSelectedDate = nextTuesday;
    this.currentMonth = new Date(nextTuesday);
    this.generateCalendar();
  }

  selectAfterOneWeek() {
    const today = new Date();
    const afterOneWeek = new Date(today);
    afterOneWeek.setDate(today.getDate() + 7);
    this.tempSelectedDate = afterOneWeek;
    this.currentMonth = new Date(afterOneWeek);
    this.generateCalendar();
  }

  selectNoDate() {
    this.tempSelectedDate = undefined;
    // For end date picker, when "No date" is selected, we don't need to check minDate
  }

  confirmSelection() {
    // Set the final selected date and emit it
    this.selectedDate = this.tempSelectedDate;
    this.dateChange.emit(this.selectedDate);
    this.closeModal();
  }

  getMonthYearString(): string {
    return this.currentMonth.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  getPreviewDate(): string {
    if (!this.selectedDate) {
      return 'No date';
    }
    return this.formatDate(this.selectedDate);
  }

  getTempPreviewDate(): string {
    if (!this.tempSelectedDate) {
      return 'No date';
    }
    return this.formatDate(this.tempSelectedDate);
  }
}

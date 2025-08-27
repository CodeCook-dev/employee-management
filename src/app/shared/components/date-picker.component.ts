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
  template: `
    <div class="date-picker-container">
      <!-- Trigger Button -->
      <div
        class="date-trigger"
        [class.disabled]="disabled"
        [class.placeholder]="!selectedDate"
        (click)="openModal()"
      >
        <div class="date-content">
          <app-calendar-icon />
          <span class="date-value">
            {{ selectedDate ? formatDate(selectedDate) : placeholder }}
          </span>
        </div>
      </div>

      <!-- Date Picker Modal -->
      <div
        class="modal-overlay"
        [class.open]="isModalOpen"
        (click)="closeModal()"
      ></div>

      <div class="modal-content" [class.open]="isModalOpen">
        <div class="calendar-container">
          <!-- Quick Selection Buttons -->
          <div class="quick-selection" *ngIf="variant === 'start'">
            <button class="quick-btn" (click)="selectToday()">Today</button>
            <button class="quick-btn" (click)="selectNextMonday()">
              Next Monday
            </button>
            <button class="quick-btn" (click)="selectNextTuesday()">
              Next Tuesday
            </button>
            <button class="quick-btn" (click)="selectAfterOneWeek()">
              After 1 week
            </button>
          </div>

          <div class="quick-selection" *ngIf="variant === 'end'">
            <button class="quick-btn" (click)="selectNoDate()">No date</button>
            <button
              class="quick-btn"
              [class.disabled]="isTodayDisabled()"
              (click)="selectToday()"
            >
              Today
            </button>
          </div>

          <!-- Month Navigation -->
          <div class="month-navigation">
            <button
              class="nav-btn"
              [class.disabled]="isPreviousMonthDisabled()"
              (click)="previousMonth()"
              [disabled]="isPreviousMonthDisabled()"
            >
              <svg width="9" height="14" viewBox="0 0 9 14" fill="none">
                <path
                  d="M0.873302 8.35895L5.39504 13.4065C5.94577 14.0212 6.57591 14.1584 7.28548 13.818C7.9962 13.479 8.35156 12.8726 8.35156 11.999L8.35156 2.00101C8.35156 1.1274 7.9962 0.521045 7.28548 0.181954C6.57591 -0.158431 5.94577 -0.0212413 5.39504 0.593521L0.873302 5.64105C0.699389 5.83519 0.568956 6.0455 0.481999 6.27199C0.395043 6.49848 0.351563 6.74115 0.351563 7C0.351563 7.25885 0.395043 7.50152 0.481999 7.72801C0.568956 7.9545 0.699389 8.16481 0.873302 8.35895Z"
                  fill="#949C9E"
                />
              </svg>
            </button>
            <h4 class="month-year">{{ getMonthYearString() }}</h4>
            <button class="nav-btn" (click)="nextMonth()">
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                style="transform: rotate(180deg);"
              >
                <path
                  d="M0.873302 8.35895L5.39504 13.4065C5.94577 14.0212 6.57591 14.1584 7.28548 13.818C7.9962 13.479 8.35156 12.8726 8.35156 11.999L8.35156 2.00101C8.35156 1.1274 7.9962 0.521045 7.28548 0.181954C6.57591 -0.158431 5.94577 -0.0212413 5.39504 0.593521L0.873302 5.64105C0.699389 5.83519 0.568956 6.0455 0.481999 6.27199C0.395043 6.49848 0.351563 6.74115 0.351563 7C0.351563 7.25885 0.395043 7.50152 0.481999 7.72801C0.568956 7.9545 0.699389 8.16481 0.873302 8.35895Z"
                  fill="#949C9E"
                />
              </svg>
            </button>
          </div>

          <!-- Day Headers -->
          <div class="day-headers">
            <div class="day-header" *ngFor="let day of dayHeaders">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="calendar-grid">
            <div
              *ngFor="let date of calendarDates"
              class="calendar-day"
              [class.other-month]="!date.isCurrentMonth"
              [class.selected]="isTempSelectedDate(date.date)"
              [class.today]="isToday(date.date)"
              [class.disabled]="isDateDisabled(date.date)"
              (click)="selectDate(date.date)"
            >
              {{ date.date.getDate() }}
            </div>
          </div>
        </div>

        <!-- Action Buttons and Preview -->
        <div class="action-section">
          <div class="date-preview">
            <app-calendar-icon />
            <span class="preview-date">{{ getTempPreviewDate() }}</span>
          </div>
          <div class="action-buttons">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="cancelSelection()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-primary"
              (click)="confirmSelection()"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }

      .date-picker-container {
        position: relative;
        width: 100%;
      }

      .date-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
      }

      .date-trigger:hover:not(.disabled) {
        border-color: #1da1f2;
        box-shadow: 0 2px 8px rgba(29, 161, 242, 0.1);
      }

      .date-trigger.disabled {
        background-color: #f5f5f5;
        color: #666;
        cursor: not-allowed;
        border-color: #e0e0e0;
      }

      .date-trigger.placeholder {
        color: #949c9e;
      }

      .date-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .date-value {
        font-size: 14px;
        font-weight: 400;
      }

      .date-arrow {
        color: #666;
        transition: transform 0.2s ease;
      }

      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #00000066;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .modal-overlay.open {
        opacity: 1;
        visibility: visible;
      }

      .modal-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: white;
        border-radius: 16px;
        z-index: 1001;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        max-width: 400px;
        width: calc(100vw - 32px);
        max-height: 80vh;
        overflow: hidden;
      }

      .modal-content.open {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
      }

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 24px;
        border-bottom: 1px solid #f0f0f0;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .close-btn {
        background: none;
        border: none;
        padding: 8px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      }

      .close-btn:hover {
        background: #f5f5f5;
      }

      .calendar-container {
        padding: 24px;
      }

      .month-navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 24px;
      }

      .nav-btn {
        background: none;
        border: none;
        outline: none;
        padding: 8px;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      }

      .nav-btn:hover:not(.disabled) {
        background: #f5f5f5;
      }

      .nav-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f5f5f5;
      }

      .nav-btn.disabled:hover {
        background: #f5f5f5;
      }

      .month-year {
        margin: 0;
        min-width: 150px;
        text-align: center;
        font-size: 18px;
        font-weight: 500;
        line-height: 100%;
        color: #323238;
      }

      .day-headers {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }

      .day-header {
        text-align: center;
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        color: #323238;
        padding: 8px 0;
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        margin-bottom: 24px;
      }

      .calendar-day {
        border-radius: 50%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 15px;
        font-weight: 400;
        line-height: 20px;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }

      .calendar-day:hover:not(.other-month):not(.disabled) {
        background: #f0f8ff;
        border-color: #1da1f2;
      }

      .calendar-day.other-month {
        color: white;
        cursor: default;
      }

      .calendar-day.disabled {
        color: #e5e5e5;
        cursor: not-allowed;
        background: white;
        border-color: white;
      }

      .calendar-day.selected {
        background: #1da1f2;
        color: white;
        border-color: #1da1f2;
      }

      .calendar-day.today {
        border-color: #1da1f2;
        border-radius: 50%;
        font-weight: 600;
      }

      .calendar-day.today:not(.selected) {
        background: #f0f8ff;
        color: #1da1f2;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .btn {
        padding: 10px 20px;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .btn-primary {
        background: #1da1f2;
        color: white;
      }

      .btn-primary:hover {
        background: #1a8cd8;
      }

      .btn-secondary {
        background: #edf8ff;
        color: #1da1f2;
      }

      .btn-secondary:hover {
        background: #e8e8e8;
      }

      .quick-selection {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }

      .quick-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #1da1f2;
        background-color: #edf8ff;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .quick-btn:hover {
        color: white;
        background: #1da1f2;
      }

      .quick-btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f5f5f5;
        color: #999;
        border-color: #e0e0e0;
      }

      .quick-btn.disabled:hover {
        border-color: #e0e0e0;
        color: #999;
        background: #f5f5f5;
      }

      .action-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-top: 1px solid #e0e0e0;
      }

      .date-preview {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .preview-date {
        font-size: 16px;
        color: #323238;
        line-height: 20px;
        font-weight: 400;
      }

      .action-buttons {
        display: flex;
        gap: 12px;
      }

      .calendar-day.selected {
        border-radius: 50%;
        background: #1da1f2 !important;
        color: white !important;
        border-color: #1da1f2 !important;
      }

      /* Mobile-specific styles */
      @media (max-width: 480px) {
        .calendar-container {
          padding: 20px;
        }

        .month-navigation {
          margin-bottom: 20px;
        }

        .calendar-grid {
          gap: 2px;
        }

        .calendar-day {
          font-size: 13px;
        }
      }
    `,
  ],
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

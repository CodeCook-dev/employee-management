import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-mobile-select',
  template: `
    <div class="mobile-select-container">
      <!-- Trigger Button -->
      <div
        class="select-trigger"
        [class.disabled]="disabled"
        [class.placeholder]="!selectedValue"
        (click)="openModal()"
      >
        <span class="select-value">
          {{ selectedValue ? getSelectedLabel() : placeholder }}
        </span>
        <svg
          class="select-arrow"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
        >
          <path
            d="M4.8675 7.02224L0.661227 3.25413C0.148924 2.79519 0.0346002 2.27007 0.318254 1.67877C0.600829 1.08649 1.10612 0.790359 1.83413 0.790359L10.1658 0.790359C10.8938 0.790359 11.3991 1.08649 11.6817 1.67877C11.9653 2.27007 11.851 2.79519 11.3387 3.25413L7.13242 7.02224C6.97064 7.16717 6.79538 7.27587 6.60663 7.34833C6.41789 7.42079 6.21567 7.45703 5.99996 7.45703C5.78425 7.45703 5.58203 7.42079 5.39328 7.34833C5.20454 7.27587 5.02928 7.16717 4.8675 7.02224Z"
            fill="#1DA1F2"
          />
        </svg>
      </div>

      <!-- Bottom Modal -->
      <div
        class="modal-overlay"
        [class.open]="isModalOpen"
        (click)="closeModal()"
      ></div>

      <div class="modal-content" [class.open]="isModalOpen">
        <div class="options-list">
          <div
            *ngFor="let option of options"
            class="option-item"
            [class.selected]="option.value === selectedValue"
            (click)="selectOption(option)"
          >
            <span class="option-label">{{ option.label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .mobile-select-container {
        position: relative;
        width: 100%;
      }

      .select-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .select-trigger:hover:not(.disabled) {
        border-color: #1da1f2;
      }

      .select-trigger.disabled {
        background-color: #f5f5f5;
        color: #666;
        cursor: not-allowed;
        border-color: #e0e0e0;
      }

      .select-trigger.placeholder {
        color: #949c9e;
      }

      .select-value {
        flex: 1;
        text-align: left;
        font-size: 14px;
      }

      .select-arrow {
        color: #666;
        margin-right: 4px;
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
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        border-radius: 16px 16px 0 0;
        z-index: 1001;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        max-height: 80vh;
        overflow: hidden;
      }

      .modal-content.open {
        transform: translateY(0);
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

      .close-btn svg {
        color: #666;
      }

      .options-list {
        max-height: 60vh;
        overflow-y: auto;
      }

      .option-item {
        padding: 16px;
        line-height: 20px;
        text-align: center;
        cursor: pointer;
        transition: background 0.2s ease;
        border-bottom: 1px solid #f2f2f2;
        color: #323238;
      }

      .option-item:hover {
        background: #f8f9fa;
      }

      .option-item.selected {
        background: #f0f8ff;
        color: #1da1f2;
      }

      .option-label {
        font-size: 16px;
        font-weight: 400;
      }

      /* Mobile-specific styles */
      @media (max-width: 480px) {
        .modal-content {
          border-radius: 20px 20px 0 0;
        }

        .modal-header {
          padding: 24px 20px;
        }

        .modal-header h3 {
          font-size: 20px;
        }

        .option-label {
          font-size: 16px;
          font-weight: 400;
          line-height: 20px;
        }
      }
    `,
  ],
})
export class MobileSelectComponent {
  @Input() options: SelectOption[] = [];
  @Input() selectedValue: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() title: string = 'Select Option';
  @Input() disabled: boolean = false;

  @Output() valueChange = new EventEmitter<string>();

  isModalOpen = false;

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.isModalOpen) {
      this.closeModal();
    }
  }

  openModal() {
    if (!this.disabled) {
      this.isModalOpen = true;
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
  }

  selectOption(option: SelectOption) {
    this.selectedValue = option.value;
    this.valueChange.emit(option.value);
    this.closeModal();
  }

  getSelectedLabel(): string {
    const selectedOption = this.options.find(
      option => option.value === this.selectedValue
    );
    return selectedOption ? selectedOption.label : '';
  }
}

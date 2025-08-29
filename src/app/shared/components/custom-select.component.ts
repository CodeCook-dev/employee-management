import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class CustomSelectComponent implements OnInit {
  @Input() options: SelectOption[] = [];
  @Input() selectedValue: string = '';
  @Input() placeholder: string = 'Select an option';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() name: string = '';
  @Input() id: string = '';

  @Output() valueChange = new EventEmitter<string>();

  isOpen: boolean = false;
  selectedOption: SelectOption | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.updateSelectedOption();
  }

  ngOnChanges() {
    this.updateSelectedOption();
  }

  updateSelectedOption() {
    this.selectedOption =
      this.options.find(option => option.value === this.selectedValue) || null;
  }

  toggleDropdown() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectOption(option: SelectOption) {
    if (option.disabled) return;

    this.selectedValue = option.value;
    this.selectedOption = option;
    this.valueChange.emit(option.value);
    this.isOpen = false;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleDropdown();
        break;
      case 'Escape':
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.navigateOptions(1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.toggleDropdown();
        } else {
          this.navigateOptions(-1);
        }
        break;
    }
  }

  private navigateOptions(direction: number) {
    if (!this.isOpen || this.options.length === 0) return;

    const currentIndex = this.options.findIndex(
      option => option.value === this.selectedValue
    );
    let newIndex = currentIndex + direction;

    if (newIndex < 0) newIndex = this.options.length - 1;
    if (newIndex >= this.options.length) newIndex = 0;

    // Skip disabled options
    while (this.options[newIndex]?.disabled) {
      newIndex += direction;
      if (newIndex < 0) newIndex = this.options.length - 1;
      if (newIndex >= this.options.length) newIndex = 0;
      if (newIndex === currentIndex) break; // Prevent infinite loop
    }

    if (newIndex !== currentIndex && !this.options[newIndex]?.disabled) {
      this.selectOption(this.options[newIndex]);
    }
  }

  getDisplayText(): string {
    return this.selectedOption?.label || this.placeholder;
  }

  getSelectedOptionClass(option: SelectOption): string {
    if (option.value === this.selectedValue) {
      return 'selected';
    }
    if (option.disabled) {
      return 'disabled';
    }
    return '';
  }

  trackByValue(index: number, option: SelectOption): string {
    return option.value;
  }
}

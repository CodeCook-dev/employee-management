import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { IndexedDBService, Employee } from '../shared/indexeddb.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        flex: 1;
      }
    `,
  ],
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  showDeleteConfirmation = false;
  deletedEmployee: Employee | null = null;

  // Swipe functionality
  isMobile = false;
  swipedCard: number | null = null;
  touchStartX = 0;
  touchStartY = 0;

  constructor(
    private router: Router,
    private indexedDBService: IndexedDBService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadEmployees();
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    // Reset swipe when clicking outside of employee cards
    if (this.swipedCard && this.isMobile) {
      const target = event.target as HTMLElement;
      if (!target.closest('.employee-card')) {
        this.resetSwipe();
      }
    }
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 480;
    // Reset swipe when switching to desktop
    if (!this.isMobile) {
      this.resetSwipe();
    }
  }

  async loadEmployees(): Promise<void> {
    try {
      this.employees = await this.indexedDBService.getAllEmployees();
    } catch (error) {
      console.error('Error loading employees:', error);
      this.employees = [];
    }
  }

  getCurrentEmployees(): Employee[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    return this.employees.filter(emp => {
      // If no end date, employee is current
      if (!emp.endDate) return true;

      // If end date is today or in the future, employee is current
      const endDate = new Date(emp.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate >= today;
    });
  }

  getPreviousEmployees(): Employee[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison

    return this.employees.filter(emp => {
      // If no end date, employee is current (not previous)
      if (!emp.endDate) return false;

      // If end date is before today, employee is previous
      const endDate = new Date(emp.endDate);
      endDate.setHours(0, 0, 0, 0);
      return endDate < today;
    });
  }

  showAddEmployee(): void {
    this.router.navigate(['/new']);
  }

  showEditEmployee(employee: Employee): void {
    // Reset swipe before navigating
    this.resetSwipe();
    this.router.navigate([employee.id, 'edit']);
  }

  async deleteEmployee(employee: Employee): Promise<void> {
    try {
      await this.indexedDBService.deleteEmployee(employee.id);
      this.employees = this.employees.filter(emp => emp.id !== employee.id);
      this.deletedEmployee = employee;
      this.showDeleteConfirmation = true;
      this.resetSwipe();

      setTimeout(() => {
        this.showDeleteConfirmation = false;
        this.deletedEmployee = null;
      }, 5000);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  }

  async saveEmployees(): Promise<void> {
    try {
      await this.indexedDBService.saveAllEmployees(this.employees);
    } catch (error) {
      console.error('Error saving employees:', error);
    }
  }

  async undoDelete(): Promise<void> {
    if (this.deletedEmployee) {
      try {
        await this.indexedDBService.addEmployee(this.deletedEmployee);
        this.employees.push(this.deletedEmployee);
        this.showDeleteConfirmation = false;
        this.deletedEmployee = null;
      } catch (error) {
        console.error('Error undoing delete:', error);
      }
    }
  }

  formatDate(date?: Date): string {
    if (!date) return '';
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  // Touch event handlers for swipe functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onTouchStart(event: TouchEvent, employeeId: number) {
    if (!this.isMobile) return;

    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent, employeeId: number) {
    if (!this.isMobile) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = this.touchStartX - touchX;
    const deltaY = Math.abs(this.touchStartY - touchY);

    // Only trigger swipe if horizontal movement is significant and vertical movement is minimal
    if (deltaX > 50 && deltaY < 30) {
      this.swipedCard = employeeId;
    } else if (deltaX < 20) {
      this.swipedCard = null;
    }
  }

  onTouchEnd(event: TouchEvent, employeeId: number) {
    if (!this.isMobile) return;

    const touchX = event.changedTouches[0].clientX;
    const deltaX = this.touchStartX - touchX;

    if (deltaX > 80) {
      this.swipedCard = employeeId;
    } else {
      this.swipedCard = null;
    }
  }

  isCardSwiped(employeeId: number): boolean {
    return this.swipedCard === employeeId;
  }

  resetSwipe() {
    this.swipedCard = null;
  }
}

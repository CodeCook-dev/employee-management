import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IndexedDBService, Employee } from '../shared/indexeddb.service';
import { SelectOption } from '../shared/components/mobile-select.component';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
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
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    name: '',
    role: '',
    startDate: new Date(),
  };

  isEditMode = false;
  isViewMode = false;
  isNewMode = false;
  currentEmployeeId: number | null = null;
  isMobile = false;

  roleOptions: SelectOption[] = [
    { value: 'Product Designer', label: 'Product Designer' },
    { value: 'Flutter Developer', label: 'Flutter Developer' },
    { value: 'QA Tester', label: 'QA Tester' },
    { value: 'Product Owner', label: 'Product Owner' },
  ];

  showRemoveConfirmation = false;
  deletedEmployee: Employee | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private indexedDBService: IndexedDBService
  ) {}

  ngOnInit(): void {
    this.checkScreenSize();
    // Get the current URL path to determine the mode
    const url = this.router.url;

    if (url.includes('/new')) {
      // New employee mode: /new
      this.isNewMode = true;
      this.initializeNewEmployee();
    } else if (url.includes('/edit')) {
      // Edit mode: /:id/edit
      this.isEditMode = true;
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.currentEmployeeId = +id;
        this.loadEmployee(+id);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      // View mode: /:id
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isViewMode = true;
        this.currentEmployeeId = +id;
        this.loadEmployee(+id);
      } else {
        this.router.navigate(['/']);
      }
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 480;
  }

  onRoleChange(value: string) {
    this.employee.role = value;
  }

  onStartDateChange(date: Date) {
    this.employee.startDate = date;

    // If the new start date is after the current end date, clear the end date
    if (this.employee.endDate && date > this.employee.endDate) {
      this.employee.endDate = undefined;
    }
  }

  onEndDateChange(date: Date) {
    this.employee.endDate = date;
  }

  getStartDateForPicker(): Date | undefined {
    return this.employee.startDate || new Date();
  }

  getEndDateForPicker(): Date | undefined {
    return this.employee.endDate;
  }

  initializeNewEmployee(): void {
    this.employee = {
      id: Date.now(),
      name: '',
      role: '',
      startDate: new Date(),
    };
  }

  async loadEmployee(id: number): Promise<void> {
    try {
      const employees = await this.indexedDBService.getAllEmployees();
      const foundEmployee = employees.find(emp => emp.id === id);
      if (foundEmployee) {
        this.employee = { ...foundEmployee };
      } else {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error loading employee:', error);
      this.router.navigate(['/']);
    }
  }

  async saveEmployee(): Promise<void> {
    // Validate required fields
    if (
      !this.employee.name ||
      !this.employee.role ||
      !this.employee.startDate
    ) {
      return;
    }

    try {
      if (this.isNewMode) {
        // Create new employee
        await this.indexedDBService.addEmployee(this.employee);
      } else if (this.isEditMode && this.currentEmployeeId) {
        // Update existing employee
        await this.indexedDBService.updateEmployee(this.employee);
      } else {
        console.error('Invalid save mode or missing employee ID');
        return;
      }

      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  }

  async deleteEmployee(): Promise<void> {
    if (this.currentEmployeeId) {
      try {
        // Store the employee data for potential undo
        this.deletedEmployee = { ...this.employee };
        await this.indexedDBService.deleteEmployee(this.currentEmployeeId);

        // Show confirmation for tablet and desktop
        if (!this.isMobile) {
          this.showRemoveConfirmation = true;
        } else {
          // On mobile, navigate directly
          this.router.navigate(['/']);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  }

  async undoDelete(): Promise<void> {
    if (this.deletedEmployee) {
      try {
        await this.indexedDBService.addEmployee(this.deletedEmployee);
        this.showRemoveConfirmation = false;
        this.deletedEmployee = null;
        // Navigate back to the employee list
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error undoing delete:', error);
      }
    }
  }

  closeRemoveConfirmation(): void {
    this.showRemoveConfirmation = false;
    this.deletedEmployee = null;
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  canEdit(): boolean {
    return this.isNewMode || this.isEditMode;
  }
}

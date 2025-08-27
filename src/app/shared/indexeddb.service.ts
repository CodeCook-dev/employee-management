import { Injectable } from '@angular/core';

export interface Employee {
  id: number;
  name: string;
  role: string;
  startDate: Date;
  endDate?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService {
  private dbName = 'EmployeeManagementDB';
  private dbVersion = 2; // Updated from 1 to 2
  private storeName = 'employees';
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('IndexedDB open error:', request.error);
        reject('Failed to open IndexedDB: ' + request.error?.message);
      };

      request.onsuccess = event => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('id', 'id', { unique: true });
        }
      };
    });
  }

  async getAllEmployees(): Promise<Employee[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const employees = (request.result || []).map(
          this.toEmployee.bind(this)
        );
        resolve(employees);
      };

      request.onerror = () => {
        console.error('Error retrieving employees:', request.error);
        reject('Failed to retrieve employees: ' + request.error?.message);
      };
    });
  }

  async addEmployee(employee: Employee): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(this.toEmployeeDB(employee));

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error('Error adding employee:', request.error);
        reject('Failed to add employee: ' + request.error?.message);
      };
    });
  }

  async updateEmployee(employee: Employee): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(this.toEmployeeDB(employee));

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error('Error updating employee:', request.error);
        reject('Failed to update employee: ' + request.error?.message);
      };
    });
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        console.error('Error deleting employee:', request.error);
        reject('Failed to delete employee: ' + request.error?.message);
      };
    });
  }

  async saveAllEmployees(employees: Employee[]): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      // Clear existing data
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        // Add all employees
        let completed = 0;
        let hasError = false;

        if (employees.length === 0) {
          resolve();
          return;
        }

        employees.forEach(employee => {
          const addRequest = store.add(this.toEmployeeDB(employee));

          addRequest.onsuccess = () => {
            completed++;
            if (completed === employees.length && !hasError) {
              resolve();
            }
          };

          addRequest.onerror = () => {
            hasError = true;
            console.error('Error saving employee:', addRequest.error);
            reject('Failed to save employees: ' + addRequest.error?.message);
          };
        });
      };

      clearRequest.onerror = () => {
        console.error('Error clearing employees:', clearRequest.error);
        reject(
          'Failed to clear existing employees: ' + clearRequest.error?.message
        );
      };
    });
  }

  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  private toEmployee(data: any): Employee {
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
  }

  private toEmployeeDB(employee: Employee): any {
    return {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      startDate: employee.startDate.toISOString(),
      endDate: employee.endDate ? employee.endDate.toISOString() : undefined,
    };
  }
}

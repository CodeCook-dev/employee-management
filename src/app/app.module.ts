import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { SharedModule } from './shared/shared.module';
import { IndexedDBService } from './shared/indexeddb.service';

@NgModule({
  declarations: [AppComponent, EmployeeListComponent, EmployeeFormComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, SharedModule],
  providers: [IndexedDBService],
  bootstrap: [AppComponent],
})
export class AppModule {}

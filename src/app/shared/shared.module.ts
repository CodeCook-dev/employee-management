import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteIconComponent } from './icons/delete-icon.component';
import { AddIconComponent } from './icons/add-icon.component';
import { PersonIconComponent } from './icons/person-icon.component';
import { RoleIconComponent } from './icons/role-icon.component';
import { ArrowIconComponent } from './icons/arrow-icon.component';
import { ComponentsModule } from './components/components.module';
import { IndexedDBService } from './indexeddb.service';

@NgModule({
  declarations: [
    DeleteIconComponent,
    AddIconComponent,
    PersonIconComponent,
    RoleIconComponent,
    ArrowIconComponent,
  ],
  imports: [CommonModule, ComponentsModule],
  exports: [
    DeleteIconComponent,
    AddIconComponent,
    PersonIconComponent,
    RoleIconComponent,
    ArrowIconComponent,
    ComponentsModule,
  ],
  providers: [IndexedDBService],
})
export class SharedModule {}

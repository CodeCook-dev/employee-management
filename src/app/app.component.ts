import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Employee Management';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateHeaderTitle(event.url);
      });
  }

  private updateHeaderTitle(url: string) {
    if (url === '/' || url === '') {
      this.title = 'Employee List';
    } else if (url === '/new') {
      this.title = 'Add Employee Details';
    } else if (url.includes('/edit')) {
      this.title = 'Edit Employee Details';
    } else if (url.match(/\/\d+$/)) {
      // For detail view (URL with just an ID)
      this.title = 'Employee Details';
    }
  }
}

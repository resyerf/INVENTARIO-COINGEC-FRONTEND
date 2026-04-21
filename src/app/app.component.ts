import { Component } from '@angular/core';
import { LoaderService } from './infrastructure/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedPanel = 'dashboard';
  sidebarCollapsed = false;

  constructor(public loaderService: LoaderService) {}

  selectPanel(panel: string) {
    this.selectedPanel = panel;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

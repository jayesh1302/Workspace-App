import { Component, EventEmitter, Output } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspaceService/workspace.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent {
  searchQuery: string = '';

  constructor(private workspaceService: WorkspaceService) { }

  addNewWorkspace(): void {
    // // Logic to add a new workspace
    // // For example, you might want to show a modal for the user to enter the new workspace name
    // // and then call a method from WorkspaceService to create it.
    // this.workspaceService.addWorkspace('New Workspace Name').subscribe(response => {
    //   // Handle response, such as refreshing the workspace list
    // });
  }

  openSearch(): void {
    // // Logic to search workspaces
    // this.workspaceService.searchWorkspaces(this.searchQuery).subscribe(results => {
    //   // Handle results, such as displaying them in the UI
    // });
  }

  openSettings(): void {
    // Logic to open settings
    // This could involve navigating to a settings route or opening a settings modal.
  }

  openProfile(): void {
    // Logic to open profile
    // This could involve navigating to a profile route or opening a profile modal.
  }
}

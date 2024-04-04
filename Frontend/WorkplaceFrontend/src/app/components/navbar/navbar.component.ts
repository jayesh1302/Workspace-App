import { Component } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspaceService/workspace.service';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  workspaceName: string = '';
  

  constructor(private workspaceService: WorkspaceService) {}

  submitNewWorkspace() {
    if (this.workspaceName) {
      this.workspaceService.addNewWorkspace(this.workspaceName).subscribe({
        next: (response) => {
          console.log('Workspace created:', response);
          this.closeModal();
          this.workspaceService.fetchWorkspaces();
        },
        error: (error) => {
          console.error('There was an error creating the workspace:', error);
        }
      });
    } else {
      alert('Please enter a workspace name.');
    }
  }

  closeModal() {
    const addWorkspaceModal: any = document.getElementById('addWorkspaceModal');
    // Hide the modal
    addWorkspaceModal.style.display = 'none';
    // Remove the 'show' class that Bootstrap adds
    addWorkspaceModal.classList.remove('show');
    
    // Handle removal of modal-open class and backdrop from the body
    document.body.classList.remove('modal-open');
    const backdrop: HTMLElement | null = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.parentNode?.removeChild(backdrop);
    }
  
    // Reset the modal scroll position
    addWorkspaceModal.scrollTop = 0;
    
    // Reset the input field
    this.workspaceName = '';
    
    // Trigger reflow to reset modal state in Bootstrap's internal management
    addWorkspaceModal.offsetHeight;
    
    // You might want to manually trigger the 'hidden.bs.modal' event if needed
  }
}


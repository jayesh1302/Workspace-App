import { Component, ViewChild } from '@angular/core';
import { ChatRoomServiceService } from 'src/app/services/chatRoomService/chat-room-service.service';
import { WorkspaceService } from 'src/app/services/workspaceService/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {
  @ViewChild('addRoomModal') addRoomModal: any;
  workspaces: any[] = [];
  activeWorkspaceId: string | null = null;
  showDeleteWorkspaceModal: boolean = false;
  showAddRoomModal = false;

  constructor(private workspaceService: WorkspaceService,
    private chatRoomService: ChatRoomServiceService) {}

  ngOnInit(): void {
    // Subscribe to workspace changes
    this.workspaceService.workspaces$.subscribe(data => {
      this.workspaces = data;
    });

    // Trigger the initial fetch of workspaces
    this.workspaceService.fetchWorkspaces();
  }
  toggleRooms(workspaceId: string): void {
    this.activeWorkspaceId = this.activeWorkspaceId === workspaceId ? null : workspaceId;
  }

  // Define the isActiveWorkspace method here
  isActiveWorkspace(workspaceId: string): boolean {
    return this.activeWorkspaceId === workspaceId;
  }

  prepareForCancellation(workspaceId: string): void {
    console.log('Preparing for cancellation of workspace ID:', workspaceId);
    this.activeWorkspaceId = workspaceId;
    this.showDeleteWorkspaceModal = true;
    console.log('Show modal:', this.showDeleteWorkspaceModal);
  }

  cancelWorkspace(): void {
    console.log('Cancelling workspace ID:', this.activeWorkspaceId);
    if (this.activeWorkspaceId) {
      this.workspaceService.deleteWorkspace(this.activeWorkspaceId).subscribe({
        next: (response) => {
          console.log('Workspace deleted successfully:', response);
          this.showDeleteWorkspaceModal = false;
          this.activeWorkspaceId = null;
          this.workspaceService.fetchWorkspaces();
        },
        error: (error) => {
          console.error('Error deleting workspace:', error);
        }
      });
    }
  }

  openAddRoomModal() {
    this.showAddRoomModal = true; // Set the flag to true to show the add room modal
  }

  // Call this method when the modal emits the 'close' event
  closeAddRoomModal() {
    this.showAddRoomModal = false; // Set the flag to false to hide the add room modal
  }

  addRoom(roomName: string, workspaceId: number) {
    this.chatRoomService.addRoom(roomName, workspaceId).subscribe({
      next: response => {
        // Handle successful room addition
        // Possibly refresh the list of rooms or display a success message
      },
      error: error => {
        // Handle errors, such as displaying an error message
      }
    });
  }
}
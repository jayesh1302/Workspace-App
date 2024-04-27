import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, interval, switchMap } from 'rxjs';
import { ChatRoomServiceService } from 'src/app/services/chatRoomService/chat-room-service.service';
import { WorkspaceService } from 'src/app/services/workspaceService/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit, OnDestroy {
  workspaces: any[] = [];
  activeWorkspaceId: string | null = null;
  showDeleteWorkspaceModal: boolean = false;
  private workspaceSubscription!: Subscription;
  newRoomNames: { [key: string]: string } = {};

  constructor(private workspaceService: WorkspaceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.workspaceSubscription = this.workspaceService.workspaces$.subscribe(data => {
      this.workspaces = data;
    });
    this.workspaceService.fetchWorkspaces(); // Trigger loading of workspaces
  }

  ngOnDestroy(): void {
    if (this.workspaceSubscription) {
      this.workspaceSubscription.unsubscribe(); // Cleanup subscription
    }
  }

  toggleRooms(workspaceId: string): void {
    this.activeWorkspaceId = this.activeWorkspaceId === workspaceId ? null : workspaceId;
  }

  isActiveWorkspace(workspaceId: string): boolean {
    return this.activeWorkspaceId === workspaceId;
  }

  prepareForCancellation(workspaceId: string): void {
    this.activeWorkspaceId = workspaceId;
    this.showDeleteWorkspaceModal = true;
  }

  cancelWorkspace(): void {
    if (this.activeWorkspaceId) {
      this.workspaceService.deleteWorkspace(this.activeWorkspaceId).subscribe(() => {
        this.showDeleteWorkspaceModal = false;
        this.activeWorkspaceId = null;
        this.workspaceService.fetchWorkspaces(); // Refresh the list after deletion
      });
    }
  }
  addRoom(workspaceId: string): void {
    const roomName = this.newRoomNames[workspaceId];
    if (!roomName || !roomName.trim()) {
      alert('Please enter a room name.');
      return;
    }
    const url = `http://localhost:8080/api/rooms/workspace/${workspaceId}`;
    this.http.post(url, { name: roomName }).subscribe({
      next: (response) => {
        // Refresh the list of rooms to show the newly added room
        this.workspaceService.fetchWorkspaces();
        this.newRoomNames[workspaceId] = ''; // Reset the input field for this workspace
      },
      error: (error) => {
        console.error('Error adding room:', error);
      }
    });
  }
}
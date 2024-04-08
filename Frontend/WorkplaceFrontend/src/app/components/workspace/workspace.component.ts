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

  constructor(private workspaceService: WorkspaceService) {}

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
}
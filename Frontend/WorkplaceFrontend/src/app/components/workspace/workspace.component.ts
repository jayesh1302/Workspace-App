import { Component } from '@angular/core';
import { WorkspaceService } from 'src/app/services/workspaceService/workspace.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {
  workspaces: any[] = []; 
  activeWorkspaceId: string | null = null;

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    console.log(this.workspaces);
    this.workspaceService.getWorkspaces().subscribe((data) => {
      console.log("Workspaces data received:", data);
      this.workspaces = data;
    });
  }

  toggleRooms(workspaceId: string, index: number): void {
    this.activeWorkspaceId = this.activeWorkspaceId === workspaceId ? null : workspaceId;
}

  isActiveWorkspace(workspaceId: string): boolean {
    return this.activeWorkspaceId === workspaceId;
  }
  
}
package com.nyuroject.WorkplaceManagement.service;

import com.nyuroject.WorkplaceManagement.model.Workspace;
import com.nyuroject.WorkplaceManagement.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WorkspaceService {
    private final WorkspaceRepository workspaceRepository;

    @Autowired
    public WorkspaceService(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    public Workspace saveWorkspace(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }

    public List<Workspace> getAllWorkspaces() {
        return workspaceRepository.findAll();
    }

    public Workspace getWorkspaceById(Long id) {
        return workspaceRepository.findById(id).orElse(null);
    }

    public Workspace updateWorkspace(Workspace workspace) {
        return workspaceRepository.save(workspace);
    }

    public void deleteWorkspace(Long id) {
        workspaceRepository.deleteById(id);
    }

    public Workspace findById(Long workspaceId) {
        return workspaceRepository.findById(workspaceId).orElse(null);
    }

    public boolean existsById(Long workspaceId) {
        return workspaceRepository.existsById(workspaceId);
    }
}

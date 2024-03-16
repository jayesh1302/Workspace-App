package com.nyuroject.WorkplaceManagement.repository;

import com.nyuroject.WorkplaceManagement.model.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
}
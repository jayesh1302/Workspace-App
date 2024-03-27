package com.nyuroject.WorkplaceManagement.repository;

import com.nyuroject.WorkplaceManagement.model.Room;
import com.nyuroject.WorkplaceManagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
//    @Query("SELECT u.username FROM User u WHERE u.id = :id")
//    Optional<String> findUsernameById(@Param("id") Long id);

    @Query("SELECT u.username FROM User u WHERE u.userId = ?1")
    Optional<String> findUsernameById(Long userId);
}

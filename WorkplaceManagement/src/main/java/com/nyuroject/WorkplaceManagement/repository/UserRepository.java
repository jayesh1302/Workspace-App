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
    @Query("SELECT u.userId FROM User u WHERE u.username = :username")
    Optional<Integer> findUserIdByUsername(@Param("username") String username);

    @Query("SELECT u.username FROM User u WHERE u.userId = :userId")
    Optional<String> findUsernameById(@Param("userId") Long userId);

    Optional<User> findByUsername(String username);
}

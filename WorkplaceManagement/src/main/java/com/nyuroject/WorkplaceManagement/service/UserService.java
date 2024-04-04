package com.nyuroject.WorkplaceManagement.service;

import com.nyuroject.WorkplaceManagement.model.User;
import com.nyuroject.WorkplaceManagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public User saveUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        System.out.println(user.getPassword());
        return userRepository.save(user);
    }

    public String getUsernameById(Long userId) {
        return userRepository.findUsernameById(userId).orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList() // Or the proper authorities
        );
    }
}

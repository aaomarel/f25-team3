package com.example.f25_team3.service;

import com.example.f25_team3.entity.User;
import com.example.f25_team3.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User createUser(User user) {
        userRepository.findByEmail(user.getEmail()).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already registered");
        });
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Integer id, User updatedUser) {
        User existing = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!existing.getEmail().equalsIgnoreCase(updatedUser.getEmail())) {
            userRepository.findByEmail(updatedUser.getEmail()).ifPresent(other -> {
                throw new IllegalArgumentException("Email already registered");
            });
        }

        existing.setName(updatedUser.getName());
        existing.setEmail(updatedUser.getEmail());
        existing.setPasswordHash(updatedUser.getPasswordHash());
        existing.setRole(updatedUser.getRole());
        return userRepository.save(existing);
    }

    public User getUser(Integer id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    public User authenticate(String email, String passwordHash) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.filter(u -> u.getPasswordHash().equals(passwordHash))
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
    }
}

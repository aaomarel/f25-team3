package com.example.f25_team3.controller;

import com.example.f25_team3.dto.LoginRequest;
import com.example.f25_team3.dto.UserRequest;
import com.example.f25_team3.dto.UserResponse;
import com.example.f25_team3.entity.User;
import com.example.f25_team3.entity.UserRole;
import com.example.f25_team3.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest request) {
        User user = toEntity(request);
        User created = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.fromEntity(created));
    }

    @PutMapping("/{id}")
    public UserResponse updateUser(@PathVariable Integer id, @RequestBody UserRequest request) {
        User user = toEntity(request);
        User updated = userService.updateUser(id, user);
        return UserResponse.fromEntity(updated);
    }

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable Integer id) {
        return UserResponse.fromEntity(userService.getUser(id));
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        User authenticated = userService.authenticate(request.getEmail(), request.getPassword());
        return UserResponse.fromEntity(authenticated);
    }

    private User toEntity(UserRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        UserRole role = request.getRole() != null ? request.getRole() : UserRole.PLAYER;
        user.setRole(role);
        return user;
    }
}

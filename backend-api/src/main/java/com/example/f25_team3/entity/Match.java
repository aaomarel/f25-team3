package com.example.f25_team3.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "matches")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String sport;
    private String location;
    private LocalDate date;
    
    @Column(name = "time_of_play")
    private LocalTime time;
    
    @Column(name = "player_limit")
    private Integer playerLimit;
    
    @Column(name = "player_capacity")
    private Integer playerCapacity;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MatchPlayer> players = new ArrayList<>();
    
    @PrePersist
    @PreUpdate
    private void syncPlayerCapacity() {
        if (playerLimit != null) {
            this.playerCapacity = playerLimit;
        }
    }
}

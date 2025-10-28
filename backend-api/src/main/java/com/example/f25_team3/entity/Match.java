package com.example.f25_team3.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(nullable = false, length = 100)
    private String sport;

    @Column(nullable = false, length = 255)
    private String location;

    @Column(name = "time_of_play", nullable = false)
    private LocalDateTime timeOfPlay;

    @Column(name = "player_capacity", nullable = false)
    private Integer playerCapacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MatchStatus status = MatchStatus.SCHEDULED;

    @JsonIgnore
    @OneToMany(mappedBy = "match", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MatchPlayer> matchPlayers = new HashSet<>();

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public String getSport() {
        return sport;
    }

    public void setSport(String sport) {
        this.sport = sport;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getTimeOfPlay() {
        return timeOfPlay;
    }

    public void setTimeOfPlay(LocalDateTime timeOfPlay) {
        this.timeOfPlay = timeOfPlay;
    }

    public Integer getPlayerCapacity() {
        return playerCapacity;
    }

    public void setPlayerCapacity(Integer playerCapacity) {
        this.playerCapacity = playerCapacity;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public Set<MatchPlayer> getMatchPlayers() {
        return matchPlayers;
    }

    public boolean isFull() {
        return matchPlayers.size() >= playerCapacity;
    }
}

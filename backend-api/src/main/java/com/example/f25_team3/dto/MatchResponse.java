package com.example.f25_team3.dto;

import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchStatus;
import java.time.LocalDate;
import java.time.LocalTime;

public class MatchResponse {
    private Long id;
    private String title;
    private String description;
    private String sport;
    private String location;
    private LocalDate date;
    private LocalTime time;
    private int playerLimit;
    private MatchStatus status;
    private long playersJoined;

    public static MatchResponse fromEntity(Match match, long playersJoined) {
        MatchResponse response = new MatchResponse();
        response.setId(match.getId());
        response.setTitle(match.getTitle());
        response.setDescription(match.getDescription());
        response.setSport(match.getSport());
        response.setLocation(match.getLocation());
        response.setDate(match.getDate());
        response.setTime(match.getTime());
        response.setPlayerLimit(match.getPlayerLimit());
        response.setStatus(match.getStatus());
        response.setPlayersJoined(playersJoined);
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public int getPlayerLimit() {
        return playerLimit;
    }

    public void setPlayerLimit(int playerLimit) {
        this.playerLimit = playerLimit;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public long getPlayersJoined() {
        return playersJoined;
    }

    public void setPlayersJoined(long playersJoined) {
        this.playersJoined = playersJoined;
    }
}

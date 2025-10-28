package com.example.f25_team3.dto;

import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchStatus;
import java.time.LocalDateTime;

public class MatchResponse {
    private Integer id;
    private Integer creatorId;
    private String sport;
    private String location;
    private LocalDateTime timeOfPlay;
    private Integer playerCapacity;
    private MatchStatus status;
    private long playersJoined;

    public static MatchResponse fromEntity(Match match, long playersJoined) {
        MatchResponse response = new MatchResponse();
        response.setId(match.getId());
        response.setCreatorId(match.getCreator() != null ? match.getCreator().getId() : null);
        response.setSport(match.getSport());
        response.setLocation(match.getLocation());
        response.setTimeOfPlay(match.getTimeOfPlay());
        response.setPlayerCapacity(match.getPlayerCapacity());
        response.setStatus(match.getStatus());
        response.setPlayersJoined(playersJoined);
        return response;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Integer creatorId) {
        this.creatorId = creatorId;
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

    public long getPlayersJoined() {
        return playersJoined;
    }

    public void setPlayersJoined(long playersJoined) {
        this.playersJoined = playersJoined;
    }
}

package com.example.f25_team3.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

public class MatchUpdateRequest {
    private String sport;
    private String location;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime timeOfPlay;

    private Integer playerCapacity;

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
}

package com.example.f25_team3.controller;

import com.example.f25_team3.dto.JoinMatchRequest;
import com.example.f25_team3.dto.MatchRequest;
import com.example.f25_team3.dto.MatchResponse;
import com.example.f25_team3.dto.MatchUpdateRequest;
import com.example.f25_team3.entity.Match;
import com.example.f25_team3.service.MatchPlayerService;
import com.example.f25_team3.service.MatchService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;
    private final MatchPlayerService matchPlayerService;

    public MatchController(MatchService matchService, MatchPlayerService matchPlayerService) {
        this.matchService = matchService;
        this.matchPlayerService = matchPlayerService;
    }

    @PostMapping
    public ResponseEntity<MatchResponse> createMatch(@RequestBody MatchRequest request) {
        Match match = toMatch(request);
        Match created = matchService.createMatch(match, request.getCreatorId());
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(toResponse(created));
    }

    @GetMapping
    public List<MatchResponse> browseMatches(@RequestParam(name = "sport", required = false) String sport) {
        return matchService.getAvailableMatches(Optional.ofNullable(sport)).stream()
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    public MatchResponse getMatch(@PathVariable Long id) {
        return toResponse(matchService.getMatch(id));
    }

    @GetMapping("/player/{userId}")
    public List<MatchResponse> getMatchesForPlayer(@PathVariable Integer userId) {
        return matchPlayerService.getMatchesForPlayer(userId).stream()
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/created-by/{userId}")
    public List<MatchResponse> getMatchesCreatedByUser(@PathVariable Integer userId) {
        return matchService.getMatchesCreatedByUser(userId).stream()
            .map(this::toResponse)
            .toList();
    }

    @PutMapping("/{id}")
    public MatchResponse updateMatch(@PathVariable Long id, @RequestBody MatchUpdateRequest request) {
        try {
            System.out.println("=== UPDATE MATCH REQUEST ===");
            System.out.println("Match ID: " + id);
            System.out.println("Title: " + request.getTitle());
            System.out.println("Sport: " + request.getSport());
            System.out.println("Location: " + request.getLocation());
            System.out.println("Date: " + request.getDate());
            System.out.println("Time: " + request.getTime());
            System.out.println("PlayerLimit: " + request.getPlayerLimit());
            System.out.println("===========================");
            Match updated = matchService.updateMatch(id, request);
            return toResponse(updated);
        } catch (Exception e) {
            System.err.println("ERROR updating match:");
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelMatch(@PathVariable Long id) {
        matchService.cancelMatch(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<Void> joinMatch(@PathVariable Long id, @RequestBody JoinMatchRequest request) {
        matchPlayerService.joinMatch(id, request.getUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{matchId}/leave")
    public ResponseEntity<Void> leaveMatch(@PathVariable Long matchId, @RequestParam Integer userId) {
        matchPlayerService.leaveMatch(matchId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/start")
    public MatchResponse startMatch(@PathVariable Long id) {
        return toResponse(matchService.startMatch(id));
    }

    private Match toMatch(MatchRequest request) {
        Match match = new Match();
        // Auto-generate title and description if not provided
        match.setTitle(request.getTitle() != null && !request.getTitle().isEmpty() 
            ? request.getTitle() 
            : request.getSport() + " Game");
        match.setDescription(request.getDescription() != null && !request.getDescription().isEmpty()
            ? request.getDescription()
            : request.getSport() + " game at " + request.getLocation());
        match.setSport(request.getSport());
        match.setLocation(request.getLocation());
        match.setDate(request.getDate());
        match.setTime(request.getTime());
        match.setPlayerLimit(request.getPlayerLimit());
        return match;
    }

    private MatchResponse toResponse(Match match) {
        long playersJoined = matchPlayerService.countPlayersForMatch(match.getId());
        return MatchResponse.fromEntity(match, playersJoined);
    }
}

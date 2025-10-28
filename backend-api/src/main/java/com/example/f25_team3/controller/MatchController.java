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
        Match created = matchService.createMatch(request.getCreatorId(), match);
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
    public MatchResponse getMatch(@PathVariable Integer id) {
        return toResponse(matchService.getMatch(id));
    }

    @GetMapping("/provider/{userId}")
    public List<MatchResponse> getMatchesForProvider(@PathVariable Integer userId) {
        return matchService.getMatchesForProvider(userId).stream()
            .map(this::toResponse)
            .toList();
    }

    @GetMapping("/player/{userId}")
    public List<MatchResponse> getMatchesForPlayer(@PathVariable Integer userId) {
        return matchPlayerService.getMatchesForPlayer(userId).stream()
            .map(this::toResponse)
            .toList();
    }

    @PutMapping("/{id}")
    public MatchResponse updateMatch(@PathVariable Integer id, @RequestBody MatchUpdateRequest request) {
        Match match = new Match();
        match.setSport(request.getSport());
        match.setLocation(request.getLocation());
        match.setTimeOfPlay(request.getTimeOfPlay());
        match.setPlayerCapacity(request.getPlayerCapacity());
        Match updated = matchService.updateMatch(id, match);
        return toResponse(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelMatch(@PathVariable Integer id) {
        matchService.cancelMatch(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{matchId}/join")
    public MatchResponse joinMatch(@PathVariable Integer matchId, @RequestBody JoinMatchRequest request) {
        matchPlayerService.joinMatch(matchId, request.getUserId());
        Match match = matchService.getMatch(matchId);
        return toResponse(match);
    }

    @DeleteMapping("/{matchId}/leave")
    public ResponseEntity<Void> leaveMatch(@PathVariable Integer matchId, @RequestParam Integer userId) {
        matchPlayerService.leaveMatch(matchId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/start")
    public MatchResponse startMatch(@PathVariable Integer id) {
        return toResponse(matchService.startMatch(id));
    }

    private Match toMatch(MatchRequest request) {
        Match match = new Match();
        match.setSport(request.getSport());
        match.setLocation(request.getLocation());
        match.setTimeOfPlay(request.getTimeOfPlay());
        match.setPlayerCapacity(request.getPlayerCapacity());
        return match;
    }

    private MatchResponse toResponse(Match match) {
        long playersJoined = matchPlayerService.countPlayersForMatch(match.getId());
        return MatchResponse.fromEntity(match, playersJoined);
    }
}

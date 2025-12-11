package com.example.f25_team3.service;

import com.example.f25_team3.dto.MatchUpdateRequest;
import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchStatus;
import com.example.f25_team3.repository.MatchPlayerRepository;
import com.example.f25_team3.repository.MatchRepository;
import com.example.f25_team3.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final MatchPlayerRepository matchPlayerRepository;

    public MatchService(MatchRepository matchRepository,
                        UserRepository userRepository,
                        MatchPlayerRepository matchPlayerRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.matchPlayerRepository = matchPlayerRepository;
    }

    @Transactional
    public Match createMatch(Match match, Integer creatorId) {
        if (creatorId == null) {
            throw new IllegalArgumentException("Creator ID is required");
        }
        var creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + creatorId));
        match.setCreator(creator);
        match.setStatus(MatchStatus.SCHEDULED);
        return matchRepository.save(match);
    }

    public Match getMatch(Long matchId) {
        return matchRepository.findById(matchId)
            .orElseThrow(() -> new EntityNotFoundException("Match not found"));
    }

    public List<Match> getAvailableMatches(Optional<String> sportFilter) {
        if (sportFilter.isPresent()) {
            return matchRepository.findBySportIgnoreCaseAndStatus(sportFilter.get(), MatchStatus.SCHEDULED);
        }
        return matchRepository.findByStatus(MatchStatus.SCHEDULED);
    }

    public List<Match> getMatchesCreatedByUser(Integer userId) {
        return matchRepository.findByCreatorIdOrderByDateAscTimeAsc(userId);
    }

    @Transactional
    public Match updateMatch(Long matchId, MatchUpdateRequest updated) {
        Match existing = getMatch(matchId);
        if (updated.getTitle() != null) {
            existing.setTitle(updated.getTitle());
        }
        if (updated.getDescription() != null) {
            existing.setDescription(updated.getDescription());
        }
        if (updated.getSport() != null) {
            existing.setSport(updated.getSport());
        }
        if (updated.getLocation() != null) {
            existing.setLocation(updated.getLocation());
        }
        if (updated.getDate() != null) {
            existing.setDate(updated.getDate());
        }
        if (updated.getTime() != null) {
            existing.setTime(updated.getTime());
        }
        if (updated.getPlayerLimit() != null) {
            long currentPlayers = matchPlayerRepository.countByMatchId(matchId);
            if (updated.getPlayerLimit() < currentPlayers) {
                throw new IllegalArgumentException("Capacity cannot be less than current players");
            }
            existing.setPlayerLimit(updated.getPlayerLimit());
        }
        return matchRepository.save(existing);
    }

    @Transactional
    public Match startMatch(Long matchId) {
        Match match = getMatch(matchId);
        if (match.getStatus() == MatchStatus.CANCELLED) {
            throw new IllegalStateException("Cannot start a cancelled match");
        }
        match.setStatus(MatchStatus.STARTED);
        return matchRepository.save(match);
    }

    @Transactional
    public Match cancelMatch(Long matchId) {
        Match match = getMatch(matchId);
        match.setStatus(MatchStatus.CANCELLED);
        return matchRepository.save(match);
    }
}

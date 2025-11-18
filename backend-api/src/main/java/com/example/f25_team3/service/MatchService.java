package com.example.f25_team3.service;

import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchStatus;
import com.example.f25_team3.entity.User;
import com.example.f25_team3.repository.MatchPlayerRepository;
import com.example.f25_team3.repository.MatchRepository;
import com.example.f25_team3.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
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
    public Match createMatch(Integer creatorId, Match match) {
        User creator = userRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator not found"));
        match.setCreator(creator);
        match.setStatus(MatchStatus.SCHEDULED);
        return matchRepository.save(match);
    }

    public Match getMatch(Integer matchId) {
        return matchRepository.findById(matchId)
            .orElseThrow(() -> new EntityNotFoundException("Match not found"));
    }

    public List<Match> getMatchesForProvider(Integer providerId) {
        return matchRepository.findByCreatorId(providerId);
    }

    public List<Match> getAvailableMatches(Optional<String> sportFilter) {
        if (sportFilter.isPresent()) {
            return matchRepository.findBySportIgnoreCaseAndStatus(sportFilter.get(), MatchStatus.SCHEDULED);
        }
        return matchRepository.findUpcomingByStatus(MatchStatus.SCHEDULED, LocalDateTime.now());
    }

    @Transactional
    public Match updateMatch(Integer matchId, Match updated) {
        Match existing = getMatch(matchId);
        if (updated.getSport() != null) {
            existing.setSport(updated.getSport());
        }
        if (updated.getLocation() != null) {
            existing.setLocation(updated.getLocation());
        }
        if (updated.getTimeOfPlay() != null) {
            existing.setTimeOfPlay(updated.getTimeOfPlay());
        }
        if (updated.getPlayerCapacity() != null) {
            long currentPlayers = matchPlayerRepository.countByMatchId(matchId);
            if (updated.getPlayerCapacity() < currentPlayers) {
                throw new IllegalArgumentException("Capacity cannot be less than current players");
            }
            existing.setPlayerCapacity(updated.getPlayerCapacity());
        }
        return matchRepository.save(existing);
    }

    @Transactional
    public Match startMatch(Integer matchId) {
        Match match = getMatch(matchId);
        if (match.getStatus() == MatchStatus.CANCELLED) {
            throw new IllegalStateException("Cannot start a cancelled match");
        }
        match.setStatus(MatchStatus.STARTED);
        return matchRepository.save(match);
    }

    @Transactional
    public Match cancelMatch(Integer matchId) {
        Match match = getMatch(matchId);
        match.setStatus(MatchStatus.CANCELLED);
        return matchRepository.save(match);
    }
}

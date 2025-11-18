package com.example.f25_team3.service;

import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchPlayer;
import com.example.f25_team3.entity.MatchStatus;
import com.example.f25_team3.entity.User;
import com.example.f25_team3.repository.MatchPlayerRepository;
import com.example.f25_team3.repository.MatchRepository;
import com.example.f25_team3.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MatchPlayerService {

    private final MatchPlayerRepository matchPlayerRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MatchPlayerService(MatchPlayerRepository matchPlayerRepository,
                              MatchRepository matchRepository,
                              UserRepository userRepository) {
        this.matchPlayerRepository = matchPlayerRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public MatchPlayer joinMatch(Integer matchId, Integer userId) {
        Match match = matchRepository.findById(matchId)
            .orElseThrow(() -> new EntityNotFoundException("Match not found"));
        if (match.getStatus() != MatchStatus.SCHEDULED) {
            throw new IllegalStateException("Only scheduled matches can be joined");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        matchPlayerRepository.findByMatchIdAndUserId(matchId, userId).ifPresent(existing -> {
            throw new IllegalArgumentException("User already joined this match");
        });

        long currentCount = matchPlayerRepository.countByMatchId(matchId);
        if (match.getPlayerCapacity() != null && currentCount >= match.getPlayerCapacity()) {
            throw new IllegalStateException("Match has reached its capacity");
        }

        MatchPlayer matchPlayer = new MatchPlayer();
        matchPlayer.setMatch(match);
        matchPlayer.setUser(user);
        return matchPlayerRepository.save(matchPlayer);
    }

    @Transactional
    public void leaveMatch(Integer matchId, Integer userId) {
        MatchPlayer matchPlayer = matchPlayerRepository.findByMatchIdAndUserId(matchId, userId)
            .orElseThrow(() -> new IllegalArgumentException("User is not part of this match"));
        matchPlayerRepository.delete(matchPlayer);
    }

    public List<Match> getMatchesForPlayer(Integer userId) {
        return matchPlayerRepository.findByUserId(userId).stream()
            .map(MatchPlayer::getMatch)
            .toList();
    }

    public long countPlayersForMatch(Integer matchId) {
        return matchPlayerRepository.countByMatchId(matchId);
    }
}

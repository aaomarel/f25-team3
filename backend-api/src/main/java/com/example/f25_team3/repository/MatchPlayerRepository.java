package com.example.f25_team3.repository;

import com.example.f25_team3.entity.MatchPlayer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchPlayerRepository extends JpaRepository<MatchPlayer, Integer> {
    Optional<MatchPlayer> findByMatchIdAndUserId(Integer matchId, Integer userId);

    List<MatchPlayer> findByUserId(Integer userId);

    long countByMatchId(Integer matchId);
}

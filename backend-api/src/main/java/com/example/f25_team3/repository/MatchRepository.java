package com.example.f25_team3.repository;

import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MatchRepository extends JpaRepository<Match, Integer> {
    List<Match> findByCreatorId(Integer creatorId);

    List<Match> findByStatus(MatchStatus status);

    List<Match> findBySportIgnoreCaseAndStatus(String sport, MatchStatus status);

    @Query("SELECT m FROM Match m WHERE m.status = :status AND m.timeOfPlay >= :now")
    List<Match> findUpcomingByStatus(@Param("status") MatchStatus status, @Param("now") LocalDateTime now);
}

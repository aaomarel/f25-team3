package com.example.f25_team3.repository;

import com.example.f25_team3.entity.Match;
import com.example.f25_team3.entity.MatchStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findByStatus(MatchStatus status);

    List<Match> findBySportIgnoreCaseAndStatus(String sport, MatchStatus status);

    List<Match> findByCreatorIdOrderByDateAscTimeAsc(Integer creatorId);

    @Query("SELECT m FROM Match m WHERE m.status = :status AND (m.date > :date OR (m.date = :date AND m.time >= :time))")
    List<Match> findUpcomingByStatus(@Param("status") MatchStatus status, @Param("date") java.time.LocalDate date, @Param("time") java.time.LocalTime time);
}

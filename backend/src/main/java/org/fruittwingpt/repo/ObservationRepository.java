package org.fruittwingpt.repo;
import org.fruittwingpt.domain.Observation; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ObservationRepository extends JpaRepository<Observation,Long> { List<Observation> findByPlantIdOrderByObservedAtDesc(Long plantId); Optional<Observation> findByIdAndPlantOwnerId(Long id,Long ownerId); }

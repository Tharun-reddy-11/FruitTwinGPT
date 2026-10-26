package org.fruittwingpt.repo;
import org.fruittwingpt.domain.Prediction; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PredictionRepository extends JpaRepository<Prediction,Long> { List<Prediction> findByObservationPlantIdOrderByCreatedAtDesc(Long plantId); }

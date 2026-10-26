package org.fruittwingpt.repo;
import org.fruittwingpt.domain.Plant; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface PlantRepository extends JpaRepository<Plant,Long> { List<Plant> findByOwnerIdOrderByCreatedAtDesc(Long ownerId); Optional<Plant> findByIdAndOwnerId(Long id,Long ownerId); }

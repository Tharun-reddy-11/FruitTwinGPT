package org.fruittwingpt.repo;
import org.fruittwingpt.domain.HarvestRecord; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface HarvestRepository extends JpaRepository<HarvestRecord,Long> { List<HarvestRecord> findByPlantIdOrderByHarvestedAtDesc(Long plantId); }

package org.fruittwingpt.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "predictions")
public class Prediction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "observation_id")
    public Observation observation;

    @Column(name = "model_version", nullable = false)
    public String modelVersion;

    @Column(nullable = false)
    public String status;

    @Column(name = "target_name", nullable = false)
    public String targetName;

    @Column(name = "predicted_value")
    public BigDecimal predictedValue;

    public String unit;

    public BigDecimal uncertainty;

    public String category;

    public BigDecimal confidence;

    @Column(name = "estimated_fruit_count")
    public Integer estimatedFruitCount;

    @Column(name = "estimated_weight_g")
    public BigDecimal estimatedWeightG;

    @Column(name = "estimated_firmness_n")
    public BigDecimal estimatedFirmnessN;

    @Column(name = "estimated_shelf_life_days")
    public Integer estimatedShelfLifeDays;

    @Column(name = "expected_harvest_date")
    public LocalDate expectedHarvestDate;

    @Column(length = 2000)
    public String explanation;

    @Column(name = "request_id", nullable = false)
    public String requestId;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();
}

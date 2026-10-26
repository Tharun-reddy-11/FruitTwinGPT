package org.fruittwingpt.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "observations")
public class Observation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "plant_id")
    public Plant plant;

    @Column(name = "observed_at", nullable = false)
    public Instant observedAt;

    @Column(name = "growth_stage", nullable = false)
    public String growthStage;

    @Column(name = "soil_ph")
    public BigDecimal soilPh;

    @Column(name = "soil_moisture")
    public BigDecimal soilMoisture;

    @Column(name = "temperature_c")
    public BigDecimal temperatureC;

    @Column(name = "humidity_pct")
    public BigDecimal humidityPct;

    @Column(name = "irrigation_liters")
    public BigDecimal irrigationLiters;

    @Column(name = "fruit_weight_g")
    public BigDecimal fruitWeightG;

    @Column(name = "fruit_size_cm")
    public BigDecimal fruitSizeCm;

    @Column(name = "image_reference", columnDefinition = "LONGTEXT")
    public String imageReference;

    @Column(nullable = false)
    public String provenance = "USER_RECORDED";

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();
}

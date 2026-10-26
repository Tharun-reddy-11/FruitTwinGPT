import os
import cv2
import numpy as np
import imageio

def create_scientific_video():
    width = 1280
    height = 720
    fps = 24
    total_seconds = 24
    total_frames = total_seconds * fps  # 576 frames

    # Asset paths
    p1 = 'frontend/public/assets/mango-orchard.jpg'
    p2 = 'frontend/public/assets/mango-vision.jpg'
    p3 = 'frontend/public/assets/mango-harvest.jpg'

    img1 = cv2.imread(p1)
    img2 = cv2.imread(p2)
    img3 = cv2.imread(p3)

    if img1 is None or img2 is None or img3 is None:
        print("Error: Could not load base images!")
        return

    # Resize all to base size (1376, 768)
    base_w, base_h = 1376, 768
    img1 = cv2.resize(img1, (base_w, base_h))
    img2 = cv2.resize(img2, (base_w, base_h))
    img3 = cv2.resize(img3, (base_w, base_h))

    out_mp4 = 'frontend/public/assets/fruit-ml-observation.mp4'
    out_webm = 'frontend/public/assets/fruit-ml-observation.webm'

    writer_mp4 = imageio.get_writer(out_mp4, fps=fps, codec='libx264', quality=8)
    writer_webm = imageio.get_writer(out_webm, fps=fps, codec='libvpx')

    print(f"Generating {total_frames} frames ({total_seconds}s) of Scientific Fruit ML Observation Video...")

    # Color palette (BGR for OpenCV)
    neon_cyan = (255, 220, 0)      # BGR
    neon_green = (80, 240, 120)    # BGR
    hud_bg = (12, 28, 18)          # Dark green tint
    white = (255, 255, 255)
    soft_green = (180, 230, 160)
    amber = (30, 180, 255)

    for f in range(total_frames):
        # Determine scene & transition
        # Scene 1: frames 0 to 192 (0-8s)
        # Scene 2: frames 192 to 384 (8-16s)
        # Scene 3: frames 384 to 576 (16-24s)
        trans_len = 24  # 1 second cross-fade

        if f < 192:
            # Ken Burns on img1
            t = f / 192.0
            zoom = 1.0 + 0.08 * t
            cw = int(width / zoom)
            ch = int(height / zoom)
            x1 = int(t * (base_w - cw - 20))
            y1 = int(20 + t * 15)
            frame = cv2.resize(img1[y1:y1+ch, x1:x1+cw], (width, height))
            scene = 1
            scene_t = f / 192.0

            if f >= 192 - trans_len:
                alpha = (f - (192 - trans_len)) / trans_len
                f2_t = (f - 192 + trans_len) / 192.0
                f2_crop = cv2.resize(img2[10:10+height, 20:20+width], (width, height))
                frame = cv2.addWeighted(frame, 1.0 - alpha, f2_crop, alpha, 0)

        elif f < 384:
            # Ken Burns on img2
            local_f = f - 192
            t = local_f / 192.0
            zoom = 1.05 - 0.06 * t
            cw = int(width / zoom)
            ch = int(height / zoom)
            x1 = int(30 + t * 40)
            y1 = int(10 + t * 20)
            frame = cv2.resize(img2[y1:y1+ch, x1:x1+cw], (width, height))
            scene = 2
            scene_t = local_f / 192.0

            if f >= 384 - trans_len:
                alpha = (f - (384 - trans_len)) / trans_len
                f3_crop = cv2.resize(img3[10:10+height, 20:20+width], (width, height))
                frame = cv2.addWeighted(frame, 1.0 - alpha, f3_crop, alpha, 0)

        else:
            # Ken Burns on img3
            local_f = f - 384
            t = local_f / 192.0
            zoom = 1.0 + 0.07 * t
            cw = int(width / zoom)
            ch = int(height / zoom)
            x1 = int(t * (base_w - cw - 20))
            y1 = int(15 + t * 10)
            frame = cv2.resize(img3[y1:y1+ch, x1:x1+cw], (width, height))
            scene = 3
            scene_t = local_f / 192.0

            if f >= 576 - trans_len:
                alpha = (f - (576 - trans_len)) / trans_len
                f1_crop = cv2.resize(img1[20:20+height, 10:10+width], (width, height))
                frame = cv2.addWeighted(frame, 1.0 - alpha, f1_crop, alpha, 0)

        # Subtle dark scientific grade overlay
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (width, height), (10, 24, 16), -1)
        frame = cv2.addWeighted(frame, 0.78, overlay, 0.22, 0)

        # ----------------- SCIENTIFIC ML OVERLAYS -----------------
        # 1. Top HUD Bar
        cv2.rectangle(frame, (0, 0), (width, 36), (6, 18, 12), -1)
        cv2.line(frame, (0, 36), (width, 36), neon_green, 1)

        cv2.putText(frame, "FRUIT-TWIN-GPT // SCIENTIFIC ML VISION OBSERVATION", (24, 24),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.52, neon_green, 1, cv2.LINE_AA)
        
        status_text = f"STREAM: SENSOR_LIDAR_OPTICAL | FRAME: {f:04d} | FPS: 24.0 | LATENCY: 14ms"
        cv2.putText(frame, status_text, (width - 480, 24),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, soft_green, 1, cv2.LINE_AA)

        # 2. Top-Right Telemetry Data Box
        tele_x, tele_y = width - 360, 56
        cv2.rectangle(frame, (tele_x, tele_y), (tele_x + 336, tele_y + 110), (8, 22, 14), -1)
        cv2.rectangle(frame, (tele_x, tele_y), (tele_x + 336, tele_y + 110), neon_green, 1)
        cv2.putText(frame, "REAL-TIME CANOPY TELEMETRY", (tele_x + 12, tele_y + 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.44, neon_green, 1, cv2.LINE_AA)
        cv2.line(frame, (tele_x + 10, tele_y + 26), (tele_x + 326, tele_y + 26), (30, 80, 50), 1)

        soil_val = 31.4 + np.sin(f * 0.05) * 0.8
        temp_val = 28.5 + np.cos(f * 0.03) * 0.4
        vpd_val = 1.38 + np.sin(f * 0.04) * 0.05

        cv2.putText(frame, f"SOIL MOISTURE:   {soil_val:.1f} %  (OPTIMAL)", (tele_x + 12, tele_y + 46),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.40, white, 1, cv2.LINE_AA)
        cv2.putText(frame, f"CANOPY TEMP:     {temp_val:.1f} \u00B0C | HUMIDITY: 64.2%", (tele_x + 12, tele_y + 66),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.40, white, 1, cv2.LINE_AA)
        cv2.putText(frame, f"VPD (TRANSPIR):  {vpd_val:.2f} kPa | NDVI: 0.76", (tele_x + 12, tele_y + 86),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.40, soft_green, 1, cv2.LINE_AA)
        cv2.putText(frame, "FUSION MODEL:    GradientBoosting + ViT-Chroma", (tele_x + 12, tele_y + 102),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.36, neon_cyan, 1, cv2.LINE_AA)

        # 3. Dynamic Scanning Laser Sweep (every 4 seconds)
        scan_y = int((f % 96) / 96.0 * (height - 100)) + 40
        cv2.line(frame, (0, scan_y), (width, scan_y), neon_cyan, 1)
        scan_overlay = frame.copy()
        cv2.rectangle(scan_overlay, (0, max(40, scan_y - 12)), (width, scan_y), (60, 180, 200), -1)
        frame = cv2.addWeighted(frame, 0.88, scan_overlay, 0.12, 0)

        # 4. Scene-Specific Scientific ML Bounding Boxes & Reticles
        if scene == 1:
            # Multi-fruit tree detection in orchard
            # Box 1
            bx1, by1 = 440 + int(np.sin(f * 0.02) * 5), 240 + int(np.cos(f * 0.02) * 4)
            bw1, bh1 = 160, 210
            # Corner markers
            cl = 16
            cv2.line(frame, (bx1, by1), (bx1 + cl, by1), neon_green, 2)
            cv2.line(frame, (bx1, by1), (bx1, by1 + cl), neon_green, 2)
            cv2.line(frame, (bx1 + bw1, by1), (bx1 + bw1 - cl, by1), neon_green, 2)
            cv2.line(frame, (bx1 + bw1, by1), (bx1 + bw1, by1 + cl), neon_green, 2)
            cv2.line(frame, (bx1, by1 + bh1), (bx1 + cl, by1 + bh1), neon_green, 2)
            cv2.line(frame, (bx1, by1 + bh1), (bx1, by1 + bh1 - cl), neon_green, 2)
            cv2.line(frame, (bx1 + bw1, by1 + bh1), (bx1 + bw1 - cl, by1 + bh1), neon_green, 2)
            cv2.line(frame, (bx1 + bw1, by1 + bh1), (bx1 + bw1, by1 + bh1 - cl), neon_green, 2)

            # Box Tag
            cv2.rectangle(frame, (bx1, by1 - 32), (bx1 + 220, by1), (8, 24, 16), -1)
            cv2.putText(frame, "TARGET: FRUIT_CLUSTER #01", (bx1 + 6, by1 - 18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.38, neon_green, 1, cv2.LINE_AA)
            cv2.putText(frame, "CONF: 97.4% | PHENOLOGY: ACTIVE", (bx1 + 6, by1 - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.34, white, 1, cv2.LINE_AA)

            # Secondary Box
            bx2, by2 = 680, 290
            bw2, bh2 = 130, 160
            cv2.rectangle(frame, (bx2, by2), (bx2 + bw2, by2 + bh2), (40, 140, 80), 1)
            cv2.putText(frame, "FRUIT #02 [94.8%]", (bx2, by2 - 6),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.34, soft_green, 1, cv2.LINE_AA)

        elif scene == 2:
            # Macro Fruit Vision & Sugar Analysis
            cx, cy = 600, 370
            rad = 120 + int(np.sin(f * 0.08) * 3)
            # Circular reticle with dashed effect
            cv2.circle(frame, (cx, cy), rad, neon_cyan, 1, cv2.LINE_AA)
            cv2.circle(frame, (cx, cy), rad + 14, (30, 90, 80), 1, cv2.LINE_AA)
            # Crosshairs
            cv2.line(frame, (cx - rad - 20, cy), (cx - rad + 15, cy), neon_cyan, 1)
            cv2.line(frame, (cx + rad - 15, cy), (cx + rad + 20, cy), neon_cyan, 1)
            cv2.line(frame, (cx, cy - rad - 20), (cx, cy - rad + 15), neon_cyan, 1)
            cv2.line(frame, (cx, cy + rad - 15), (cx, cy + rad + 20), neon_cyan, 1)

            # Analysis card attached to reticle
            card_x, card_y = cx + rad + 24, cy - 70
            cv2.line(frame, (cx + rad, cy), (card_x, card_y + 30), neon_cyan, 1)
            cv2.rectangle(frame, (card_x, card_y), (card_x + 290, card_y + 115), (6, 20, 14), -1)
            cv2.rectangle(frame, (card_x, card_y), (card_x + 290, card_y + 115), neon_cyan, 1)
            cv2.putText(frame, "MULTIMODAL FUSION INFERENCE", (card_x + 10, card_y + 18),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.42, neon_cyan, 1, cv2.LINE_AA)
            cv2.putText(frame, "PREDICTED BRIX:  15.4 \u00B0Bx (\u00B10.35)", (card_x + 10, card_y + 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.46, neon_green, 1, cv2.LINE_AA)
            cv2.putText(frame, "QUALITY GRADE:   EXPORT GRADE A", (card_x + 10, card_y + 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.42, white, 1, cv2.LINE_AA)
            cv2.putText(frame, "EST. TREE YIELD: 185 FRUITS (~38 kg)", (card_x + 10, card_y + 80),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.40, soft_green, 1, cv2.LINE_AA)
            cv2.putText(frame, "HARVEST WINDOW:  10 DAYS REMAINING", (card_x + 10, card_y + 100),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.38, amber, 1, cv2.LINE_AA)

        else:
            # Scene 3: Harvest Quality Verification
            # Bounding box over crates
            bx, by = 380, 220
            bw, bh = 520, 290
            cv2.rectangle(frame, (bx, by), (bx + bw, by + bh), neon_green, 2)
            cv2.rectangle(frame, (bx, by - 36), (bx + 380, by), (8, 26, 16), -1)
            cv2.putText(frame, "HARVEST INSPECTION: 100% EXPORT COMPLIANT", (bx + 10, by - 14),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.44, neon_green, 1, cv2.LINE_AA)
            
            # Ground truth stamp
            cv2.rectangle(frame, (bx + 20, by + bh - 55), (bx + 480, by + bh - 15), (6, 18, 12), -1)
            cv2.putText(frame, "GROUND TRUTH: 15.4 \u00B0Bx | ACTUAL WT: 215g | VERIFIED", (bx + 30, by + bh - 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.42, white, 1, cv2.LINE_AA)

        # 5. Bottom Navigation / Model Architecture Status Bar
        cv2.rectangle(frame, (0, height - 34), (width, height), (6, 18, 12), -1)
        cv2.line(frame, (0, height - 34), (width, height - 34), (30, 80, 50), 1)

        cv2.putText(frame, "ARCHITECTURE: ViT-B/16 (Chroma) + LightGBM (Microclimate) -> Late Cross-Modal Fusion",
                    (24, height - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (180, 210, 190), 1, cv2.LINE_AA)
        
        cv2.putText(frame, "DIGITAL TWIN STATUS: SYNCHRONIZED",
                    (width - 310, height - 12), cv2.FONT_HERSHEY_SIMPLEX, 0.42, neon_green, 1, cv2.LINE_AA)

        # Convert BGR to RGB for imageio
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        writer_mp4.append_data(frame_rgb)
        writer_webm.append_data(frame_rgb)

        if f % 96 == 0:
            print(f"  Rendered {f}/{total_frames} frames ({f/fps:.1f}s)...")

    writer_mp4.close()
    writer_webm.close()
    print("Video generation completed successfully!")
    print(f"MP4 size: {os.path.getsize(out_mp4)/1024/1024:.2f} MB")
    print(f"WebM size: {os.path.getsize(out_webm)/1024/1024:.2f} MB")

if __name__ == '__main__':
    create_scientific_video()

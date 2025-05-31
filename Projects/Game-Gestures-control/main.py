import cv2
import sys
import mediapipe as mp
import numpy as np
import subprocess
import time



cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Unable to open the Camara !!!! ")
    sys.exit("Exiting program: Camera not accessible.")
else: 
    print("Camera opened successfully!")





mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,           # For video input
    max_num_hands=1,                   # Start with tracking one hand
    min_detection_confidence=0.5,      # Confidence threshold for detection
    min_tracking_confidence=0.5 
)
mp_drawing = mp.solutions.drawing_utils

SWIPE_LEFT_CMD  = ['adb', 'shell', 'input', 'swipe', '900', '1200', '200', '1200', '100']
SWIPE_RIGHT_CMD = ['adb', 'shell', 'input', 'swipe', '200', '1200', '900', '1200', '100']
SWIPE_UP_CMD    = ['adb', 'shell', 'input', 'swipe', '540', '1800', '540', '600', '100']
SWIPE_DOWN_CMD  = ['adb', 'shell', 'input', 'swipe', '540', '600', '540', '1800', '100']

HORIZONTAL_SWIPE_THRESHOLD = 0.10   # 10% horizontal movement
VERTICAL_SWIPE_THRESHOLD   = 0.10   # 10% vertical movement
GESTURE_COOLDOWN = 1.0    

prev_x = 0
prev_y = 0
last_gesture_time = 0
detected_gesture = ""


while cap.isOpened():
    flag, frame = cap.read()
    if not flag:
        break
    frame = cv2.flip(frame, 1)
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = hands.process(frame_rgb)
    current_time = time.time()
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_drawing.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)
            wrist = hand_landmarks.landmark[mp_hands.HandLandmark.WRIST]
            current_x, current_y = wrist.x, wrist.y
            if prev_x is not None and prev_y is not None:
                dx = current_x - prev_x
                dy = current_y - prev_y
                if current_time - last_gesture_time > GESTURE_COOLDOWN:
                     if abs(dx) > HORIZONTAL_SWIPE_THRESHOLD and abs(dy) < HORIZONTAL_SWIPE_THRESHOLD / 2:
                        if dx > 0:
                            detected_gesture = "Swipe Right"
                            subprocess.run(SWIPE_RIGHT_CMD)
                        else:
                            detected_gesture = "Swipe Left"
                            subprocess.run(SWIPE_LEFT_CMD)
                        last_gesture_time = current_time
                        prev_x, prev_y = None, None  # Reset to prevent multiple triggers
                        continue

                    # Vertical swipe detection
                elif abs(dy) > VERTICAL_SWIPE_THRESHOLD and abs(dx) < VERTICAL_SWIPE_THRESHOLD / 2:
                        if dy < 0:
                            detected_gesture = "Swipe Up"
                            subprocess.run(SWIPE_UP_CMD)
                        else:
                            detected_gesture = "Swipe Down"
                            subprocess.run(SWIPE_DOWN_CMD)
                        last_gesture_time = current_time
                        prev_x, prev_y = None, None  # Reset
                        continue
            prev_x, prev_y = current_x, current_y

    else:
        prev_x, prev_y = None, None
        detected_gesture = ""

        if detected_gesture:
            cv2.putText(frame, detected_gesture, (30, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3    )

    cv2.imshow('Gesture Control', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
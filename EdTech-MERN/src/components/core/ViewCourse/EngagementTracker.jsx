import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  PoseLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { analyticsEndpoints } from "../../../services/apis";

const EngagementTracker = ({ active }) => {
  const webcamRef = useRef(null);
  const attentionRef = useRef(0);
  const headDirectionRef = useRef("Unknown");
  const postureRef = useRef("Unknown");
  const sessionTimeRef = useRef(0);

  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [faceDetected, setFaceDetected] = useState(false);
  const [attentionScore, setAttentionScore] = useState(0);
  const [headDirection, setHeadDirection] = useState("Unknown");
  const [postureStatus, setPostureStatus] = useState("Unknown");
  const [sessionTime, setSessionTime] = useState(0);

  const totalFrames = useRef(0);
  const attentiveFrames = useRef(0);

  const detectorRef = useRef(null);
  const poseDetectorRef = useRef(null);
  const localStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const activeRef = useRef(active);
  const [modelLoaded, setModelLoaded] = useState(false);

  const saveAnalytics = async () => {
    console.log(
      "CHECK:",
      attentionRef.current,
      headDirectionRef.current,
      postureRef.current,
      sessionTimeRef.current,
    );

    if (attentionRef.current === 0) {
      return;
    }
    console.log("SENDING ANALYTICS");

    try {
      const { SAVE_ENGAGEMENT_API } = analyticsEndpoints;
      const response = await axios.post(
        SAVE_ENGAGEMENT_API,
        {
          courseId,
          attentionScore: attentionRef.current,
          headDirection: headDirectionRef.current,
          postureStatus: postureRef.current,
          watchTime: sessionTimeRef.current,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("API RESPONSE:", response.data);
    } catch (err) {
      console.log("API ERROR:", err);
    }
  };

  // 1. Log analytics interval
  useEffect(() => {
    const interval = setInterval(() => {
      saveAnalytics();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 2. Synchronize refs with state
  useEffect(() => {
    attentionRef.current = attentionScore;
    headDirectionRef.current = headDirection;
    postureRef.current = postureStatus;
    sessionTimeRef.current = sessionTime;
  }, [attentionScore, headDirection, postureStatus, sessionTime]);

  // 3. Load MediaPipe models on mount
  useEffect(() => {
    let isMounted = true;
    const initializeModels = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
        );

        const detector = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        });

        const poseDetector = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          },
          runningMode: "VIDEO",
          numPoses: 1,
        });

        if (isMounted) {
          detectorRef.current = detector;
          poseDetectorRef.current = poseDetector;
          setModelLoaded(true);
          console.log("MediaPipe Models Loaded Successfully");
        }
      } catch (error) {
        console.error("Failed to initialize MediaPipe models:", error);
      }
    };

    initializeModels();

    return () => {
      isMounted = false;
    };
  }, []);

  // 4. Session watch time timer (only increments when active & model is loaded)
  useEffect(() => {
    let interval = null;
    if (active && modelLoaded) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [active, modelLoaded]);

  // 5. Control webcam stream and detection loop based on active state
  useEffect(() => {
    activeRef.current = active;

    const startCamera = async () => {
      // Release any existing camera stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      if (!active || !modelLoaded) {
        return;
      }

      try {
        console.log("Starting camera stream...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        localStreamRef.current = stream;

        if (webcamRef.current) {
          webcamRef.current.srcObject = stream;
        }

        const detect = () => {
          if (!activeRef.current) return;
          detectFaces();
          animationFrameRef.current = requestAnimationFrame(detect);
        };

        animationFrameRef.current = requestAnimationFrame(detect);
      } catch (err) {
        console.error("Failed to access camera:", err);
      }
    };

    startCamera();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [active, modelLoaded]);

  const detectFaces = async () => {
    if (!webcamRef.current || !detectorRef.current || !poseDetectorRef.current) {
      return;
    }

    const video = webcamRef.current;

    if (video.readyState >= 2) {
      try {
        const results = detectorRef.current.detectForVideo(video, performance.now());
        const detected = results.faceLandmarks && results.faceLandmarks.length > 0;

        setFaceDetected(detected);
        totalFrames.current++;

        if (detected) {
          const landmarks = results.faceLandmarks[0];
          const nose = landmarks[1];
          const leftEye = landmarks[33];
          const rightEye = landmarks[263];

          const eyeCenterX = (leftEye.x + rightEye.x) / 2;
          const noseOffset = nose.x - eyeCenterX;

          if (noseOffset > 0.03) {
            setHeadDirection("Looking Left");
          } else if (noseOffset < -0.03) {
            setHeadDirection("Looking Right");
          } else {
            setHeadDirection("Looking At Screen");
          }

          if (noseOffset > -0.03 && noseOffset < 0.03) {
            attentiveFrames.current++;
          }

          const score = (attentiveFrames.current / totalFrames.current) * 100;
          setAttentionScore(score.toFixed(0));
        }

        const poseResults = poseDetectorRef.current.detectForVideo(video, performance.now());

        if (poseResults.landmarks && poseResults.landmarks.length > 0) {
          const landmarks = poseResults.landmarks[0];
          const leftShoulder = landmarks[11];
          const rightShoulder = landmarks[12];
          const nose = landmarks[0];

          const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;
          const headDistance = shoulderCenterY - nose.y;

          if (headDistance > 0.25) {
            setPostureStatus("Good Posture ✅");
          } else {
            setPostureStatus("Poor Posture ⚠️");
          }
        }
      } catch (error) {
        console.error("Error during detection loop step:", error);
      }
    }
  };

  if (!active) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black p-2 rounded-lg border border-yellow-500 shadow-xl">
      <video
        ref={webcamRef}
        autoPlay
        muted
        playsInline
        className="w-40 rounded-lg border-2 border-yellow-500"
      />

      <div className="mt-2 text-center text-white text-sm">
        Face: {faceDetected ? (
          <span className="text-green-400"> Detected ✅</span>
        ) : (
          <span className="text-red-400"> Not Found ❌</span>
        )}
        <div className="text-center text-white text-sm mt-1">
          Attention: {attentionScore}%
          <div className="text-center text-white text-sm">
            Time: {sessionTime}s
            <div className="text-center text-white text-sm mt-1 text-yellow-50">
              {headDirection}
            </div>
            <div className="text-center text-white text-sm font-semibold">
              {postureStatus}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementTracker;

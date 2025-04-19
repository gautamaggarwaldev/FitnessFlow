import { Button } from "@/components/ui/button";
import { pulseAnimation } from "@/lib/animation";
import { Pose } from "@mediapipe/pose";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

interface PoseDetectionProps {
  onAccuracyChange?: (accuracy: number) => void;
  onCaloriesBurned?: (calories: number) => void;
  style?: string;
}

export default function PoseDetection({
  onAccuracyChange,
  onCaloriesBurned,
  style = "Zumba"
}: PoseDetectionProps) {
  // Remove detector state
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  const poseRef = useRef<Pose | null>(null);

  // Initialize MediaPipe Pose
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);
    poseRef.current = pose;

    return () => {
      pose.close();
    };
  }, []);

  const onResults = (results: any) => {
    if (!canvasRef.current || !results.poseLandmarks) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pose connections with glow effect
    ctx.strokeStyle = "rgba(255, 71, 87, 0.7)";
    ctx.lineWidth = 10;
    drawConnections(ctx, results.poseLandmarks);

    // Draw landmarks with white glow
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    drawLandmarks(ctx, results.poseLandmarks);
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    const connections = [
      [11, 12],
      [11, 13],
      [13, 15], // Left Arm
      [12, 14],
      [14, 16], // Right Arm
      [11, 23],
      [12, 24], // Upper Body
      [23, 24],
      [23, 25],
      [24, 26], // Hips
      [25, 27],
      [26, 28], // Upper Legs
      [27, 31],
      [28, 32], // Lower Legs
    ];

    for (const [i, j] of connections) {
      const start = landmarks[i];
      const end = landmarks[j];

      if (start && end) {
        ctx.beginPath();
        ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
        ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
        ctx.stroke();
      }
    }
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    for (const landmark of landmarks) {
      const x = landmark.x * canvas.width;
      const y = landmark.y * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 8, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Add these functions
  const handleWebcamStream = () => {
    setIsWebcamReady(true);
  };

  const startDetection = async () => {
    if (!poseRef.current || !webcamRef.current || !webcamRef.current.video) return;
    
    setIsDetecting(true);
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setAccuracy(0);
    setCaloriesBurned(0);

    // Trigger accuracy change to start music
    if (onAccuracyChange) {
      onAccuracyChange(100);
    }

    try {
      await poseRef.current.send({ image: webcamRef.current.video });
    } catch (error) {
      console.error("Error starting pose detection:", error);
    }
  };

    // Add music control function
    const handleMusicToggle = () => {
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    };
  const stopDetection = () => {
    setIsDetecting(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    startTimeRef.current = null;
    
    // Signal to parent component to stop music
    if (onAccuracyChange) {
      onAccuracyChange(-1); // Use -1 as a signal to stop music
    }
  };

  // Update elapsed time and calories
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isDetecting && startTimeRef.current) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor(
          (currentTime - startTimeRef.current!) / 1000
        );
        setElapsedTime(elapsed);
        const calories = Math.floor(elapsed * 0.15); // ~0.15 calories per second for moderate dance
        setCaloriesBurned(calories);
        if (onCaloriesBurned) onCaloriesBurned(calories);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, onCaloriesBurned]);

  // Update the buttons to use poseRef instead of detector
  return (
    <div className="bg-neutral-800 rounded-2xl overflow-hidden relative">
      <div className="aspect-video bg-black relative flex items-center justify-center">
        {/* Webcam - removed hidden class */}
        <div className="relative w-full h-full">
          <Webcam
            ref={webcamRef}
            onUserMedia={handleWebcamStream}
            width={640}
            height={480}
            mirrored={true}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Canvas for visualization - positioned absolute over webcam */}
        <canvas
          ref={canvasRef}
          className={`absolute top-0 left-0 w-full h-full object-cover ${
            isDetecting ? "block" : "hidden"
          }`}
        />

        {/* Placeholder when camera is not active */}
        {!isDetecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80">
            {/* Skeleton overlay */}
            <svg
              width="300"
              height="400"
              viewBox="0 0 300 400"
              className="stroke-primary-light mb-8"
              style={{ strokeWidth: "3px" }}
            >
              {/* Head */}
              <motion.circle
                cx="150"
                cy="80"
                r="25"
                fill="none"
                variants={pulseAnimation}
                initial="initial"
                animate="animate"
              />

              {/* Body */}
              <line x1="150" y1="105" x2="150" y2="230" />

              {/* Arms */}
              <line x1="150" y1="140" x2="100" y2="180" />
              <line x1="150" y1="140" x2="200" y2="160" />

              {/* Legs */}
              <line x1="150" y1="230" x2="120" y2="340" />
              <line x1="150" y1="230" x2="180" y2="330" />

              {/* Joints */}
              <circle cx="150" cy="140" r="6" fill="rgba(255,71,87,0.7)" />
              <circle cx="100" cy="180" r="6" fill="rgba(255,71,87,0.7)" />
              <circle cx="200" cy="160" r="6" fill="rgba(255,71,87,0.7)" />
              <circle cx="150" cy="230" r="6" fill="rgba(255,71,87,0.7)" />
              <circle cx="120" cy="340" r="6" fill="rgba(255,71,87,0.7)" />
              <circle cx="180" cy="330" r="6" fill="rgba(255,71,87,0.7)" />
            </svg>

            <Button
              onClick={startDetection}
              disabled={!isWebcamReady || !poseRef.current}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white font-medium px-6 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="10" r="3" />
                <path d="M7 16.3c0-1 .8-1.6 2.1-2.1 1.5-.5 3.3-.5 4.8 0 1.3.5 2.1 1.1 2.1 2.1" />
                <path d="M12 16v4" />
              </svg>
              <span>Start Camera</span>
            </Button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 flex items-center justify-between bg-neutral-900">
        <div className="flex items-center space-x-3">
          <Button
            variant={isDetecting ? "destructive" : "default"}
            size="icon"
            className={`w-14 h-14 rounded-full ${
              isDetecting
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-primary-dark"
            }`}
            onClick={isDetecting ? stopDetection : startDetection}
            disabled={!isWebcamReady || !poseRef.current}
          >
            <i
              className={`bx ${isDetecting ? "bx-stop" : "bx-play"} text-2xl`}
            ></i>
          </Button>
          <div>
            <p className="font-medium text-white">{style} - Beginner</p>
            <p className="text-xs text-neutral-400">
              {new Date(elapsedTime * 1000).toISOString().substr(14, 5)} • ~{caloriesBurned} calories
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
        <Button
      variant="ghost"
      size="icon"
      className="w-10 h-10 rounded-full bg-neutral-800 text-white"
      onClick={handleMusicToggle}
    >
      <i className='bx bx-volume-full'></i>
    </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-neutral-800 text-white"
          >
            <i className="bx bx-fullscreen"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}

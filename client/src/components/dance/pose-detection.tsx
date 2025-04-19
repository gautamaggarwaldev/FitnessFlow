import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { pulseAnimation } from "@/lib/animation";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";

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
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const requestRef = useRef<number>();
  const startTimeRef = useRef<number | null>(null);
  
  // Initialize TensorFlow and Pose Detector
  useEffect(() => {
    async function initTF() {
      await tf.ready();
      
      const detectorConfig = {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        enableSmoothing: true
      };
      
      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      
      setDetector(detector);
    }
    
    initTF();
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);
  
  // Handle webcam stream
  const handleWebcamStream = () => {
    setIsWebcamReady(true);
  };
  
  // Start pose detection
  const startDetection = () => {
    if (!detector || !isWebcamReady) return;
    
    setIsDetecting(true);
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setAccuracy(0);
    setCaloriesBurned(0);
    
    // Start the detection loop
    detectPose();
  };
  
  // Stop pose detection
  const stopDetection = () => {
    setIsDetecting(false);
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    startTimeRef.current = null;
  };
  
  // Main pose detection loop
  const detectPose = async () => {
    if (!detector || !webcamRef.current || !canvasRef.current || !isDetecting) return;
    
    // Update elapsed time
    if (startTimeRef.current) {
      const currentTime = Date.now();
      const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
      setElapsedTime(elapsed);
      
      // Update calories burned (simple calculation)
      const calories = Math.floor(elapsed * 0.15); // ~0.15 calories per second for moderate dance
      setCaloriesBurned(calories);
      if (onCaloriesBurned) onCaloriesBurned(calories);
    }
    
    // Get video element and canvas context
    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (video && video.readyState === 4 && ctx) {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Detect poses
      const poses = await detector.estimatePoses(video);
      
      // Draw video frame
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Process and draw poses
      if (poses.length > 0) {
        // Draw keypoints and skeleton
        drawPose(ctx, poses[0]);
        
        // Calculate accuracy based on expected pose for the dance style
        const newAccuracy = calculateAccuracy(poses[0], style);
        setAccuracy(newAccuracy);
        if (onAccuracyChange) onAccuracyChange(newAccuracy);
      }
    }
    
    // Continue the detection loop
    requestRef.current = requestAnimationFrame(detectPose);
  };
  
  // Draw pose keypoints and skeleton
  const drawPose = (ctx: CanvasRenderingContext2D, pose: poseDetection.Pose) => {
    if (!pose.keypoints) return;
    
    // Draw keypoints
    for (const keypoint of pose.keypoints) {
      if (keypoint.score && keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 71, 87, 0.7)';
        ctx.fill();
      }
    }
    
    // Draw skeleton (connections between keypoints)
    const connections = [
      ['nose', 'left_eye'], ['nose', 'right_eye'],
      ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
      ['nose', 'left_shoulder'], ['nose', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
      ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
    ];
    
    ctx.strokeStyle = 'rgba(255, 71, 87, 0.5)';
    ctx.lineWidth = 2;
    
    for (const [p1, p2] of connections) {
      const keypoint1 = pose.keypoints.find(kp => kp.name === p1);
      const keypoint2 = pose.keypoints.find(kp => kp.name === p2);
      
      if (keypoint1 && keypoint2 && 
          keypoint1.score && keypoint1.score > 0.3 &&
          keypoint2.score && keypoint2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(keypoint1.x, keypoint1.y);
        ctx.lineTo(keypoint2.x, keypoint2.y);
        ctx.stroke();
      }
    }
  };
  
  // Simple accuracy calculation (would be more sophisticated in production)
  const calculateAccuracy = (pose: poseDetection.Pose, style: string): number => {
    // This is a simplified placeholder implementation
    // A real implementation would compare the detected pose with expected poses for the dance style
    
    // For demonstration, return a random value between 85 and 98
    return Math.floor(Math.random() * 14) + 85;
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-neutral-800 rounded-2xl overflow-hidden relative">
      <div className="aspect-video bg-black relative flex items-center justify-center">
        {/* Hidden Webcam (used for detection) */}
        <div className="hidden">
          <Webcam
            ref={webcamRef}
            onUserMedia={handleWebcamStream}
            width={640}
            height={480}
            mirrored={true}
          />
        </div>
        
        {/* Canvas for visualization */}
        <canvas
          ref={canvasRef}
          className={`w-full h-full object-cover ${isDetecting ? 'block' : 'hidden'}`}
        />
        
        {/* Placeholder when camera is not active */}
        {!isDetecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900">
            {/* Skeleton overlay */}
            <svg width="300" height="400" viewBox="0 0 300 400" className="stroke-primary-light mb-8" style={{ strokeWidth: '3px' }}>
              {/* Head */}
              <motion.circle 
                cx="150" cy="80" r="25" 
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
              disabled={!isWebcamReady || !detector}
              size="lg"
              className="bg-primary hover:bg-primary-dark text-white font-medium px-6 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="10" r="3"/>
                <path d="M7 16.3c0-1 .8-1.6 2.1-2.1 1.5-.5 3.3-.5 4.8 0 1.3.5 2.1 1.1 2.1 2.1"/>
                <path d="M12 16v4"/>
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
            className={`w-14 h-14 rounded-full ${isDetecting ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary-dark'}`}
            onClick={isDetecting ? stopDetection : startDetection}
            disabled={!isWebcamReady || !detector}
          >
            <i className={`bx ${isDetecting ? 'bx-stop' : 'bx-play'} text-2xl`}></i>
          </Button>
          <div>
            <p className="font-medium text-white">{style} - Beginner</p>
            <p className="text-xs text-neutral-400">
              {formatTime(elapsedTime)} • ~{caloriesBurned} calories
            </p>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-neutral-800 text-white">
            <i className='bx bx-volume-full'></i>
          </Button>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-neutral-800 text-white">
            <i className='bx bx-fullscreen'></i>
          </Button>
        </div>
      </div>
    </div>
  );
}

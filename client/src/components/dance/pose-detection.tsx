// import { Button } from "@/components/ui/button";
// import { pulseAnimation } from "@/lib/animation";
// import { Pose } from "@mediapipe/pose";
// import { motion } from "framer-motion";
// import { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";

// interface PoseDetectionProps {
//   onAccuracyChange?: (accuracy: number) => void;
//   onCaloriesBurned?: (calories: number) => void;
//   style?: string;
// }

// export default function PoseDetection({
//   onAccuracyChange,
//   onCaloriesBurned,
//   style = "Zumba"
// }: PoseDetectionProps) {
//   // Remove detector state
//   const webcamRef = useRef<Webcam>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDetecting, setIsDetecting] = useState(false);
//   const [isWebcamReady, setIsWebcamReady] = useState(false);
//   const [accuracy, setAccuracy] = useState(0);
//   const [caloriesBurned, setCaloriesBurned] = useState(0);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const requestRef = useRef<number>();
//   const startTimeRef = useRef<number | null>(null);
//   const poseRef = useRef<Pose | null>(null);

//   // Initialize MediaPipe Pose
//   useEffect(() => {
//     const pose = new Pose({
//       locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
//       },
//     });

//     pose.setOptions({
//       modelComplexity: 1,
//       smoothLandmarks: true,
//       minDetectionConfidence: 0.5,
//       minTrackingConfidence: 0.5,
//     });

//     pose.onResults(onResults);
//     poseRef.current = pose;

//     return () => {
//       pose.close();
//     };
//   }, []);

//   const onResults = (results: any) => {
//     if (!canvasRef.current || !results.poseLandmarks) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw pose connections with glow effect
//     ctx.strokeStyle = "rgba(255, 71, 87, 0.7)";
//     ctx.lineWidth = 10;
//     drawConnections(ctx, results.poseLandmarks);

//     // Draw landmarks with white glow
//     ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
//     drawLandmarks(ctx, results.poseLandmarks);
//   };

//   const drawConnections = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
//     const connections = [
//       [11, 12],
//       [11, 13],
//       [13, 15], // Left Arm
//       [12, 14],
//       [14, 16], // Right Arm
//       [11, 23],
//       [12, 24], // Upper Body
//       [23, 24],
//       [23, 25],
//       [24, 26], // Hips
//       [25, 27],
//       [26, 28], // Upper Legs
//       [27, 31],
//       [28, 32], // Lower Legs
//     ];

//     for (const [i, j] of connections) {
//       const start = landmarks[i];
//       const end = landmarks[j];

//       if (start && end) {
//         ctx.beginPath();
//         ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
//         ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
//         ctx.stroke();
//       }
//     }
//   };

//   const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
//     for (const landmark of landmarks) {
//       const x = landmark.x * canvas.width;
//       const y = landmark.y * canvas.height;

//       ctx.beginPath();
//       ctx.arc(x, y, 8, 0, 2 * Math.PI);
//       ctx.fill();
//     }
//   };

//   // Add these functions
//   const handleWebcamStream = () => {
//     setIsWebcamReady(true);
//   };

//   const startDetection = async () => {
//     if (!poseRef.current || !webcamRef.current || !webcamRef.current.video) return;
    
//     setIsDetecting(true);
//     startTimeRef.current = Date.now();
//     setElapsedTime(0);
//     setAccuracy(0);
//     setCaloriesBurned(0);

//     // Trigger accuracy change to start music
//     if (onAccuracyChange) {
//       onAccuracyChange(100);
//     }

//     try {
//       await poseRef.current.send({ image: webcamRef.current.video });
//     } catch (error) {
//       console.error("Error starting pose detection:", error);
//     }
//   };

//     // Add music control function
//     const handleMusicToggle = () => {
//       if (audioRef.current) {
//         if (audioRef.current.paused) {
//           audioRef.current.play();
//         } else {
//           audioRef.current.pause();
//         }
//       }
//     };
//   const stopDetection = () => {
//     setIsDetecting(false);
//     if (requestRef.current) {
//       cancelAnimationFrame(requestRef.current);
//     }
//     startTimeRef.current = null;
    
//     // Signal to parent component to stop music
//     if (onAccuracyChange) {
//       onAccuracyChange(-1); // Use -1 as a signal to stop music
//     }
//   };

//   // Update elapsed time and calories
//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isDetecting && startTimeRef.current) {
//       interval = setInterval(() => {
//         const currentTime = Date.now();
//         const elapsed = Math.floor(
//           (currentTime - startTimeRef.current!) / 1000
//         );
//         setElapsedTime(elapsed);
//         const calories = Math.floor(elapsed * 0.15); // ~0.15 calories per second for moderate dance
//         setCaloriesBurned(calories);
//         if (onCaloriesBurned) onCaloriesBurned(calories);
//       }, 1000);
//     }
//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isDetecting, onCaloriesBurned]);

//   // Update the buttons to use poseRef instead of detector
//   return (
//     <div className="bg-neutral-800 rounded-2xl overflow-hidden relative">
//       <div className="aspect-video bg-black relative flex items-center justify-center">
//         {/* Webcam - removed hidden class */}
//         <div className="relative w-full h-full">
//           <Webcam
//             ref={webcamRef}
//             onUserMedia={handleWebcamStream}
//             width={640}
//             height={480}
//             mirrored={true}
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Canvas for visualization - positioned absolute over webcam */}
//         <canvas
//           ref={canvasRef}
//           className={`absolute top-0 left-0 w-full h-full object-cover ${
//             isDetecting ? "block" : "hidden"
//           }`}
//         />

//         {/* Placeholder when camera is not active */}
//         {!isDetecting && (
//           <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80">
//             {/* Skeleton overlay */}
//             <svg
//               width="300"
//               height="400"
//               viewBox="0 0 300 400"
//               className="stroke-primary-light mb-8"
//               style={{ strokeWidth: "3px" }}
//             >
//               {/* Head */}
//               <motion.circle
//                 cx="150"
//                 cy="80"
//                 r="25"
//                 fill="none"
//                 variants={pulseAnimation}
//                 initial="initial"
//                 animate="animate"
//               />

//               {/* Body */}
//               <line x1="150" y1="105" x2="150" y2="230" />

//               {/* Arms */}
//               <line x1="150" y1="140" x2="100" y2="180" />
//               <line x1="150" y1="140" x2="200" y2="160" />

//               {/* Legs */}
//               <line x1="150" y1="230" x2="120" y2="340" />
//               <line x1="150" y1="230" x2="180" y2="330" />

//               {/* Joints */}
//               <circle cx="150" cy="140" r="6" fill="rgba(255,71,87,0.7)" />
//               <circle cx="100" cy="180" r="6" fill="rgba(255,71,87,0.7)" />
//               <circle cx="200" cy="160" r="6" fill="rgba(255,71,87,0.7)" />
//               <circle cx="150" cy="230" r="6" fill="rgba(255,71,87,0.7)" />
//               <circle cx="120" cy="340" r="6" fill="rgba(255,71,87,0.7)" />
//               <circle cx="180" cy="330" r="6" fill="rgba(255,71,87,0.7)" />
//             </svg>

//             <Button
//               onClick={startDetection}
//               disabled={!isWebcamReady || !poseRef.current}
//               size="lg"
//               className="bg-primary hover:bg-primary-dark text-white font-medium px-6 flex items-center"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-2"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <circle cx="12" cy="10" r="3" />
//                 <path d="M7 16.3c0-1 .8-1.6 2.1-2.1 1.5-.5 3.3-.5 4.8 0 1.3.5 2.1 1.1 2.1 2.1" />
//                 <path d="M12 16v4" />
//               </svg>
//               <span>Start Camera</span>
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="p-4 flex items-center justify-between bg-neutral-900">
//         <div className="flex items-center space-x-3">
//           <Button
//             variant={isDetecting ? "destructive" : "default"}
//             size="icon"
//             className={`w-14 h-14 rounded-full ${
//               isDetecting
//                 ? "bg-red-500 hover:bg-red-600"
//                 : "bg-primary hover:bg-primary-dark"
//             }`}
//             onClick={isDetecting ? stopDetection : startDetection}
//             disabled={!isWebcamReady || !poseRef.current}
//           >
//             <i
//               className={`bx ${isDetecting ? "bx-stop" : "bx-play"} text-2xl`}
//             ></i>
//           </Button>
//           <div>
//             <p className="font-medium text-white">{style} - Beginner</p>
//             <p className="text-xs text-neutral-400">
//               {new Date(elapsedTime * 1000).toISOString().substr(14, 5)} • ~{caloriesBurned} calories
//             </p>
//           </div>
//         </div>

//         <div className="flex space-x-4">
//         <Button
//       variant="ghost"
//       size="icon"
//       className="w-10 h-10 rounded-full bg-neutral-800 text-white"
//       onClick={handleMusicToggle}
//     >
//       <i className='bx bx-volume-full'></i>
//     </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-10 h-10 rounded-full bg-neutral-800 text-white"
//           >
//             <i className="bx bx-fullscreen"></i>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }import { Button } from "@/components/ui/button";
import { pulseAnimation } from "@/lib/animation";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";

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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const poseRef = useRef<Pose | null>(null);

  // Initialize pose detection
  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`;
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
      if (poseRef.current) {
        poseRef.current.close();
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  // Draw the pose detection results on canvas
  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas || !results.poseLandmarks) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = webcamRef.current?.video?.videoWidth || 640;
    canvas.height = webcamRef.current?.video?.videoHeight || 480;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the pose connections
    ctx.fillStyle = '#00000000'; // Transparent
    ctx.strokeStyle = 'rgba(255, 71, 87, 0.8)';
    ctx.lineWidth = 6;

    // Torso connections
    drawConnection(ctx, results.poseLandmarks, 11, 12, canvas); // Shoulders
    drawConnection(ctx, results.poseLandmarks, 11, 23, canvas); // Left shoulder to left hip
    drawConnection(ctx, results.poseLandmarks, 12, 24, canvas); // Right shoulder to right hip
    drawConnection(ctx, results.poseLandmarks, 23, 24, canvas); // Hips

    // Arms
    drawConnection(ctx, results.poseLandmarks, 11, 13, canvas); // Left shoulder to left elbow
    drawConnection(ctx, results.poseLandmarks, 13, 15, canvas); // Left elbow to left wrist
    drawConnection(ctx, results.poseLandmarks, 12, 14, canvas); // Right shoulder to right elbow
    drawConnection(ctx, results.poseLandmarks, 14, 16, canvas); // Right elbow to right wrist

    // Legs
    drawConnection(ctx, results.poseLandmarks, 23, 25, canvas); // Left hip to left knee
    drawConnection(ctx, results.poseLandmarks, 25, 27, canvas); // Left knee to left ankle
    drawConnection(ctx, results.poseLandmarks, 24, 26, canvas); // Right hip to right knee
    drawConnection(ctx, results.poseLandmarks, 26, 28, canvas); // Right knee to right ankle

    // Draw landmarks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (const landmark of results.poseLandmarks) {
      if (landmark.visibility > 0.5) {
        drawLandmark(ctx, landmark, canvas);
      }
    }
  };

  // Helper function to draw connection between two landmarks
  const drawConnection = (
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    index1: number,
    index2: number,
    canvas: HTMLCanvasElement
  ) => {
    const point1 = landmarks[index1];
    const point2 = landmarks[index2];

    if (point1 && point2 && point1.visibility > 0.5 && point2.visibility > 0.5) {
      ctx.beginPath();
      ctx.moveTo(point1.x * canvas.width, point1.y * canvas.height);
      ctx.lineTo(point2.x * canvas.width, point2.y * canvas.height);
      ctx.stroke();
    }
  };

  // Helper function to draw a landmark
  const drawLandmark = (
    ctx: CanvasRenderingContext2D,
    landmark: any,
    canvas: HTMLCanvasElement
  ) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    const radius = 8;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  };

  // Setup webcam
  const handleWebcamStream = () => {
    setIsWebcamReady(true);
  };

  // Start pose detection
  const startDetection = () => {
    if (!webcamRef.current?.video || !poseRef.current) return;

    setIsDetecting(true);
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    setCaloriesBurned(0);

    // Set up camera utility from MediaPipe
    const camera = new Camera(webcamRef.current.video, {
      onFrame: async () => {
        if (poseRef.current && webcamRef.current?.video) {
          await poseRef.current.send({ image: webcamRef.current.video });
        }
      },
      width: 640,
      height: 480,
    });

    camera.start();
    cameraRef.current = camera;

    // Start music if needed
    if (onAccuracyChange) {
      onAccuracyChange(100);
    }

    // Play audio if available
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn("Audio play failed:", err);
      });
    }
  };

  // Stop pose detection
  const stopDetection = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    
    setIsDetecting(false);
    startTimeRef.current = null;
    
    // Stop music
    if (onAccuracyChange) {
      onAccuracyChange(-1);
    }
    
    // Pause audio
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Toggle music
  const handleMusicToggle = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(err => {
          console.warn("Audio play failed:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  };

  // Update elapsed time and calories
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isDetecting && startTimeRef.current) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTimeRef.current!) / 1000);
        setElapsedTime(elapsed);
        
        // Calculate calories based on workout style
        let calorieRate = 0.15; // Default
        if (style === "Zumba") calorieRate = 0.17;
        else if (style === "HipHop") calorieRate = 0.16;
        
        const calories = Math.floor(elapsed * calorieRate);
        setCaloriesBurned(calories);
        
        if (onCaloriesBurned) {
          onCaloriesBurned(calories);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isDetecting, onCaloriesBurned, style]);

  return (
    <div className="bg-neutral-800 rounded-2xl overflow-hidden relative">
      {/* Hidden audio element */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/workout-music.mp3" type="audio/mp3" />
      </audio>
      
      <div className="aspect-video bg-black relative flex items-center justify-center">
        {/* Webcam */}
        <Webcam
          ref={webcamRef}
          onUserMedia={handleWebcamStream}
          width={640}
          height={480}
          mirrored={true}
          className="w-full h-full object-cover"
        />

        {/* Canvas overlay for pose detection */}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full object-cover"
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
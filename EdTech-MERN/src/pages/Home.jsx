import { useState } from "react"
import { FaArrowRight, FaVideo, FaEye, FaShieldAlt, FaCode, FaChartBar } from "react-icons/fa"
import { Link } from "react-router-dom"
import Banner from "../assets/Images/banner.mp4"
import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"

function Home() {
  const [activeCodeTab, setActiveCodeTab] = useState("gaze");
  const [activeFeature, setActiveFeature] = useState("gaze");

  const gazeCode = `// Annexure A: In-Browser Gaze Detection Vector
const detectGazeDirection = (landmarks) => {
  const nose = landmarks[1]; // Nose tip coordinate
  const leftEye = landmarks[33]; // Left eye outer corner
  const rightEye = landmarks[263]; // Right eye outer corner

  const eyeCenterX = (leftEye.x + rightEye.x) / 2;
  const noseOffset = nose.x - eyeCenterX;

  if (noseOffset > 0.03) {
    return "Looking Left";
  } else if (noseOffset < -0.03) {
    return "Looking Right";
  } else {
    return "Looking At Screen";
  }
};`;

  const postureCode = `// Annexure B: In-Browser Posture Ergonomics Classification
const evaluatePosture = (poseLandmarks) => {
  const leftShoulder = poseLandmarks[11];
  const rightShoulder = poseLandmarks[12];
  const nose = poseLandmarks[0];

  const shoulderCenterY = (leftShoulder.y + rightShoulder.y) / 2;
  const headDistance = shoulderCenterY - nose.y;

  return headDistance > 0.25 
    ? "Good Posture ✅" 
    : "Poor Posture ⚠️";
};`;

  const featuresList = [
    {
      id: "gaze",
      icon: <FaEye size={18} />,
      title: "Gaze Focus Tracking",
      tagline: "Horizontal vector estimation",
      desc: "MediaPipe Face Mesh calculates the relative offset between your nose tip and eye centers at sub-30ms intervals to verify active screen focus."
    },
    {
      id: "posture",
      icon: <FaVideo size={18} />,
      title: "Ergonomic Posture Checks",
      tagline: "Neck drop skeletal alerts",
      desc: "Pose landmark nodes estimate vertical alignment between the nose and shoulders, warning students when slouching triggers ergonomic drops."
    },
    {
      id: "privacy",
      icon: <FaShieldAlt size={18} />,
      title: "Privacy-First Architecture",
      tagline: "WASM local client execution",
      desc: "Models run strictly in-browser via WebAssembly. Your camera stream is never recorded, captured, or transmitted to external servers."
    },
    {
      id: "monaco",
      icon: <FaCode size={18} />,
      title: "Integrated Monaco Sandbox",
      tagline: "Write & run files side-by-side",
      desc: "A full Monaco Editor playground allowing students to write, compile, and execute JavaScript files right next to lecture video tracks."
    },
    {
      id: "analytics",
      icon: <FaChartBar size={18} />,
      title: "Instructor Insights Console",
      tagline: "Mongoose aggregate dashboards",
      desc: "Aggregated 10-second data packets allow educators to inspect Recharts visual attention radar charts, finding exact focus drops."
    }
  ];

  const renderVisualDemo = () => {
    switch (activeFeature) {
      case "gaze":
        return (
          <div className="flex flex-col h-full justify-between p-6 bg-[#00050c]/90 rounded-2xl border border-richblack-800 text-richblack-100 font-mono shadow-2xl h-[360px]">
            <div className="flex items-center justify-between border-b border-richblack-800/80 pb-3">
              <span className="text-xs text-yellow-50 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-yellow-50 animate-pulse"></span>
                Gaze Vector Calibration
              </span>
              <span className="text-[10px] text-richblack-500">Local Inference</span>
            </div>

            {/* Eye midpoint coordinate overlay diagram */}
            <div className="my-6 flex flex-col items-center justify-center relative bg-richblack-950/80 p-6 rounded-xl border border-richblack-900 h-40">
              <svg viewBox="0 0 200 100" className="w-48 h-24 text-richblack-600">
                <circle cx="50" cy="40" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="50" cy="40" r="3" fill="#E7C009" />
                <text x="32" y="22" fill="#838894" fontSize="8">L_eye[33]</text>

                <circle cx="150" cy="40" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="150" cy="40" r="3" fill="#E7C009" />
                <text x="135" y="22" fill="#838894" fontSize="8">R_eye[263]</text>

                <line x1="100" y1="20" x2="100" y2="80" stroke="#2C333F" strokeWidth="1" strokeDasharray="3" />
                <circle cx="100" cy="40" r="2.5" fill="#4B69C1" />

                <circle cx="97" cy="65" r="4.5" fill="#EF476F" />
                <text x="108" y="68" fill="#EF476F" fontSize="8">Nose[1]</text>

                <path d="M 100 40 L 97 65" stroke="#EF476F" strokeWidth="1.5" />
              </svg>

              <div className="absolute top-2 right-2 text-[9px] text-richblack-500 bg-black/40 px-2 py-0.5 rounded">
                Offset: -0.015 (Screen Focus)
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-richblack-400">Eye Center X:</span><span className="text-white">0.50</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Nose Tip X:</span><span className="text-white">0.485</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Displacement Delta:</span><span className="text-caribbeangreen-100 font-bold">-0.015</span></div>
            </div>
          </div>
        );
      case "posture":
        return (
          <div className="flex flex-col h-full justify-between p-6 bg-[#00050c]/90 rounded-2xl border border-richblack-800 text-richblack-100 font-mono shadow-2xl h-[360px]">
            <div className="flex items-center justify-between border-b border-richblack-800/80 pb-3">
              <span className="text-xs text-caribbeangreen-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-caribbeangreen-200 animate-pulse"></span>
                Posture Ergonomic Mesh
              </span>
              <span className="text-[10px] text-richblack-500">Pose Landmarker</span>
            </div>

            {/* Skeletal coordinates map */}
            <div className="my-6 flex flex-col items-center justify-center relative bg-richblack-950/80 p-6 rounded-xl border border-richblack-900 h-40">
              <svg viewBox="0 0 200 120" className="w-48 h-28 text-richblack-700">
                <circle cx="100" cy="30" r="5" fill="#4B69C1" />
                <text x="108" y="32" fill="#838894" fontSize="8">Nose[0]</text>

                <line x1="100" y1="35" x2="100" y2="70" stroke="currentColor" strokeWidth="1.5" />

                <line x1="60" y1="70" x2="140" y2="70" stroke="currentColor" strokeWidth="2" />
                <circle cx="60" cy="70" r="4.5" fill="#05A35C" />
                <circle cx="140" cy="70" r="4.5" fill="#05A35C" />
                <text x="35" y="73" fill="#838894" fontSize="8">L_Shoulder[11]</text>
                <text x="148" y="73" fill="#838894" fontSize="8">R_Shoulder[12]</text>

                <line x1="100" y1="30" x2="100" y2="70" stroke="#05A35C" strokeWidth="1.5" strokeDasharray="2" />
                <text x="104" y="52" fill="#05A35C" fontSize="9" fontWeight="bold">D: 0.28m</text>
              </svg>

              <div className="absolute top-2 right-2 text-[9px] text-richblack-500 bg-black/40 px-2 py-0.5 rounded">
                Status: Good Posture
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-richblack-400">Shoulder Midpoint Y:</span><span className="text-white">0.58</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Nose Landmark Y:</span><span className="text-white">0.30</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Head Distance:</span><span className="text-caribbeangreen-100 font-bold">0.28</span></div>
            </div>
          </div>
        );
      case "privacy":
        return (
          <div className="flex flex-col h-full justify-between p-6 bg-[#00050c]/90 rounded-2xl border border-richblack-800 text-richblack-100 font-mono shadow-2xl h-[360px]">
            <div className="flex items-center justify-between border-b border-richblack-800/80 pb-3">
              <span className="text-xs text-pink-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-pink-200 animate-pulse"></span>
                Local Isolation Level
              </span>
              <span className="text-[10px] text-richblack-500">Security Sandbox</span>
            </div>

            <div className="my-6 flex flex-col justify-center bg-richblack-950/80 p-4 rounded-xl border border-richblack-900 h-40 text-[10px] space-y-1 overflow-hidden">
              <div className="text-caribbeangreen-100 font-bold">[OK] MediaPipe WASM Initialized</div>
              <div className="text-[#838894]">[INFO] Webcam pipeline connected to canvas element</div>
              <div className="text-[#838894]">[INFO] Inference loop execution time: 14ms</div>
              <div className="text-[#EF476F] font-semibold">[SECURE] Network transmission blocker: ACTIVE</div>
              <div className="text-caribbeangreen-100 font-semibold">[SECURE] Video Frames transmitted to API: 0</div>
              <div className="text-[#838894]">[INFO] Telemetry summaries queued: 10s packets</div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-richblack-400">Encryption Status:</span><span className="text-white">AES-256 Client Logs</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Data Transmitted:</span><span className="text-pink-100 font-bold">Telemetry metadata only</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Model Source:</span><span className="text-white">Local WebAssembly</span></div>
            </div>
          </div>
        );
      case "monaco":
        return (
          <div className="flex flex-col h-full justify-between p-6 bg-[#00050c]/90 rounded-2xl border border-richblack-800 text-richblack-100 font-mono shadow-2xl h-[360px]">
            <div className="flex items-center justify-between border-b border-richblack-800/80 pb-3">
              <span className="text-xs text-blue-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-200 animate-pulse"></span>
                Monaco Code Compilation
              </span>
              <span className="text-[10px] text-richblack-500">In-Browser Sandbox</span>
            </div>

            <div className="my-6 bg-richblack-950/80 p-4 rounded-xl border border-richblack-900 h-40 text-xs flex flex-col justify-between">
              <div className="text-[#838894] select-none">
                <span className="text-yellow-50">1</span> const square = (n) =&gt; n * n;<br />
                <span className="text-yellow-50">2</span> console.log(square(9));
              </div>
              
              <div className="border-t border-richblack-900 pt-2 text-[10px] text-richblack-400 font-mono">
                <span className="text-caribbeangreen-100 font-bold">Output:</span><br />
                [Console Log] 81<br />
                [Success] Execution complete in 12ms
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-richblack-400">Execution Mode:</span><span className="text-white">Local JS Sandbox</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">External Compilers:</span><span className="text-[#838894]">Guided Setup (Python/C++)</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Language Specs:</span><span className="text-blue-100">ES6 Standard</span></div>
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="flex flex-col h-full justify-between p-6 bg-[#00050c]/90 rounded-2xl border border-richblack-800 text-richblack-100 font-mono shadow-2xl h-[360px]">
            <div className="flex items-center justify-between border-b border-richblack-800/80 pb-3">
              <span className="text-xs text-caribbeangreen-200 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-caribbeangreen-200 animate-pulse"></span>
                Attention Metrics Radar
              </span>
              <span className="text-[10px] text-richblack-500">Aggregated Logs</span>
            </div>

            {/* Custom drawing representing Recharts analytics */}
            <div className="my-6 flex items-center justify-center relative bg-richblack-950/80 p-4 rounded-xl border border-richblack-900 h-40">
              <svg viewBox="0 0 100 100" className="w-24 h-24">
                <circle cx="50" cy="50" r="40" stroke="#161D29" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="#E7C009" strokeWidth="8" strokeDasharray="213 251" fill="none" strokeLinecap="round" transform="rotate(-90 50 50)" />
                <circle cx="50" cy="50" r="30" stroke="#4B69C1" strokeWidth="6" strokeDasharray="18 188" fill="none" strokeLinecap="round" transform="rotate(220 50 50)" />

                <text x="50" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">85%</text>
              </svg>
              
              <div className="absolute right-2 top-2 flex flex-col gap-1 text-[8px] text-richblack-400">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#E7C009]"></span> Focus</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#4B69C1]"></span> Left Gaze</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#838894]"></span> Right Gaze</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between"><span className="text-richblack-400">Total Check Intervals:</span><span className="text-white">124 checks</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Avg Attention Score:</span><span className="text-caribbeangreen-100 font-bold">89.4%</span></div>
              <div className="flex justify-between"><span className="text-richblack-400">Ergonomic Alerts:</span><span className="text-[#EF476F]">3 postural drops</span></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#000814] text-white font-inter overflow-x-hidden min-h-screen">
      
      {/* 1. HERO SECTION */}
      <div className="relative mx-auto flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-8 pt-20 pb-12">
        
        {/* Subtle Pill Badge */}
        <Link to="/signup" className="group">
          <div className="flex items-center gap-2 rounded-full border border-richblack-700 bg-richblack-900/60 backdrop-blur-md px-4 py-1.5 text-sm text-richblack-300 transition-all hover:bg-richblack-800 hover:border-richblack-600">
            <span className="h-2 w-2 rounded-full bg-caribbeangreen-100 animate-pulse"></span>
            <span>Real-time gaze & posture telemetry is here</span>
            <FaArrowRight size={10} className="text-richblack-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Headline */}
        <h1 className="text-center text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight mt-6">
          Online learning, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-yellow-25 to-caribbeangreen-100">
            enhanced by telemetry.
          </span>
        </h1>

        {/* Sub Heading */}
        <p className="mt-2 text-center text-base sm:text-lg md:text-xl text-richblack-300 max-w-2xl mx-auto font-normal leading-relaxed">
          An intelligent educational platform using browser-based computer vision to track active engagement, support posture wellness, and execute code sandboxes in real-time.
        </p>

        {/* CTA Buttons */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <CTAButton active={true} linkto="/signup">
            <span className="flex items-center gap-2 font-semibold text-richblack-900">
              Start Learning <FaArrowRight size={12} />
            </span>
          </CTAButton>
          <CTAButton active={false} linkto="/code-runner">
            <span className="flex items-center gap-2 font-medium text-white hover:text-yellow-25 transition">
              Open Code Runner
            </span>
          </CTAButton>
        </div>

        {/* Large Product Video Centerpiece with Mock Browser Frame */}
        <div className="w-full max-w-5xl mt-12 relative rounded-2xl border border-richblack-800 bg-richblack-900/40 p-2 md:p-3 backdrop-blur-xl shadow-2xl shadow-blue-900/10">
          
          {/* Mockup Top Bar */}
          <div className="flex items-center justify-between pb-3 px-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-pink-300 opacity-80"></span>
              <span className="h-3 w-3 rounded-full bg-yellow-100 opacity-85"></span>
              <span className="h-3 w-3 rounded-full bg-caribbeangreen-200 opacity-80"></span>
            </div>
            <div className="text-xs text-richblack-500 font-mono tracking-wider bg-richblack-800/80 px-4 py-1 rounded-md border border-richblack-700/50">
              localhost:3000/classroom
            </div>
            <div className="w-10"></div>
          </div>

          {/* Video Container */}
          <div className="relative rounded-lg overflow-hidden border border-richblack-800/80 shadow-inner">
            <video
              className="w-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            >
              <source src={Banner} type="video/mp4" />
            </video>

            {/* Embedded Visual HUD Mockup representing Gaze/Posture Overlays */}
            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-yellow-200/30 text-[11px] sm:text-[13px] w-48 text-richblack-100 shadow-xl space-y-2 pointer-events-none">
              <div className="flex items-center justify-between border-b border-richblack-800 pb-1.5 font-semibold text-yellow-25">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-caribbeangreen-100 animate-ping"></span>
                  Active Telemetry
                </span>
                <span className="text-richblack-400 font-mono">30 FPS</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attention Score:</span>
                <span className="font-bold text-caribbeangreen-100">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Gaze Direction:</span>
                <span className="font-semibold text-white">Screen Focus</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Posture Check:</span>
                <span className="font-semibold text-caribbeangreen-100">Good ✅</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. CINEMATIC INTERACTIVE TOURS SECTION (REPLACED BOX GRID TO BE UNIQUE) */}
      <div className="bg-[#030a16]/40 border-t border-b border-richblack-800/80 py-24">
        <div className="mx-auto w-11/12 max-w-[1260px]">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200">Interactive Walkthrough</h2>
            <p className="text-3xl sm:text-5xl font-extrabold text-white mt-3 leading-tight">
              Intelligent telemetry, built for developers.
            </p>
            <p className="mt-4 text-base sm:text-lg text-richblack-300 font-normal leading-relaxed">
              Explore the browser-based computer vision pipelines and sandbox features running inside every video module.
            </p>
          </div>

          {/* Interactive Showcase Tour Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Interactive Nav items */}
            <div className="lg:col-span-7 flex flex-col justify-center gap-4">
              {featuresList.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveFeature(item.id)}
                  onClick={() => setActiveFeature(item.id)}
                  className={`p-6 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex items-start gap-5 ${
                    activeFeature === item.id
                      ? "bg-richblack-800/80 border-richblack-600 shadow-lg"
                      : "bg-transparent border-transparent hover:bg-richblack-900/30 hover:border-richblack-850"
                  }`}
                >
                  <div className={`p-3 rounded-xl border transition-colors ${
                    activeFeature === item.id 
                      ? "bg-yellow-50 text-black border-yellow-50" 
                      : "bg-richblack-900/80 text-richblack-400 border-richblack-800"
                  }`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {item.title}
                      {activeFeature === item.id && (
                        <span className="text-[10px] uppercase bg-caribbeangreen-900/80 border border-caribbeangreen-700/60 px-2 py-0.5 rounded text-caribbeangreen-100 select-none">
                          active
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-blue-200 mt-0.5">{item.tagline}</p>
                    <p className="text-richblack-300 text-sm mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Dynamic Visual Simulator Panel */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative w-full h-[360px]">
                {renderVisualDemo()}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. TECHNICAL SPECIFICATIONS (INTERACTIVE CODE DEMO) */}
      <div className="py-24 mx-auto w-11/12 max-w-[1260px]">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left Side: Explanations */}
          <div className="lg:w-1/2 flex flex-col gap-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200">Local Inference Pipelines</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Designed with code. <br />Built on math.
            </h3>
            <p className="text-richblack-300 text-base sm:text-lg leading-relaxed">
              Explore the clean geometric models running inside React components. We translate facial vectors and skeletal landmarks into real-time feedback loops without bloating system performance.
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setActiveCodeTab("gaze")}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition border ${
                  activeCodeTab === "gaze"
                    ? "bg-yellow-50 text-black border-yellow-50"
                    : "bg-richblack-900/80 border-richblack-800 text-richblack-300 hover:text-white"
                }`}
              >
                Gaze Vector Logic
              </button>
              <button
                onClick={() => setActiveCodeTab("posture")}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition border ${
                  activeCodeTab === "posture"
                    ? "bg-yellow-50 text-black border-yellow-50"
                    : "bg-richblack-900/80 border-richblack-800 text-richblack-300 hover:text-white"
                }`}
              >
                Posture Metric Math
              </button>
            </div>
          </div>

          {/* Right Side: Sleek Code Mockup Editor */}
          <div className="lg:w-1/2 w-full bg-[#000814]/80 rounded-2xl border border-richblack-800 p-1 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-richblack-800/80">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-richblack-600"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-richblack-600"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-richblack-600"></span>
              </div>
              <span className="text-[11px] font-mono text-richblack-400">
                {activeCodeTab === "gaze" ? "detectGazeDirection.js" : "evaluatePosture.js"}
              </span>
              <div className="w-8"></div>
            </div>
            
            <pre className="p-6 overflow-x-auto text-[12px] sm:text-[13px] font-mono text-richblack-50 leading-relaxed bg-[#00050c] rounded-b-xl border border-richblack-900/50">
              <code>{activeCodeTab === "gaze" ? gazeCode : postureCode}</code>
            </pre>
          </div>

        </div>
      </div>

      {/* 4. PROCESS STAGES FLOW (CONNECTED PIPELINE DESIGN) */}
      <div className="bg-[#030a16]/40 border-t border-richblack-800/80 py-24 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[500px] rounded-full bg-blue-900/5 blur-[120px] pointer-events-none"></div>

        <div className="mx-auto w-11/12 max-w-[1260px] relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs font-bold uppercase tracking-widest text-caribbeangreen-100">Simple Implementation Flow</h2>
            <h3 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 leading-tight">How it works</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative">
            
            {/* Step 1 */}
            <div className="bg-richblack-900/50 p-8 rounded-2xl border border-richblack-800/80 hover:border-richblack-700/80 hover:bg-richblack-850/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-richblack-700 font-mono group-hover:text-yellow-25 transition-colors">01</span>
                  
                  {/* Visual 1: Player mockup with camera indicator */}
                  <div className="flex items-center gap-2 bg-[#00050c] px-3 py-1.5 rounded-lg border border-richblack-800 text-[10px] font-mono text-richblack-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-caribbeangreen-100 animate-pulse"></span>
                    <span>Sensors Ready</span>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3">Stream Synchronization</h4>
                <p className="text-richblack-300 text-sm leading-relaxed">
                  When a student presses play on a course lecture, the video player initiates the camera connection. Releasing play immediately stops the recording tracks.
                </p>
              </div>
              
              <div className="mt-8 pt-4 border-t border-richblack-850/50 text-[11px] font-mono text-richblack-500">
                Trigger: playState === "playing"
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-richblack-900/50 p-8 rounded-2xl border border-richblack-800/80 hover:border-richblack-700/80 hover:bg-richblack-850/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-richblack-700 font-mono group-hover:text-caribbeangreen-200 transition-colors">02</span>
                  
                  {/* Visual 2: Local Mesh node indicator */}
                  <div className="flex gap-1">
                    <span className="h-1 w-1 bg-yellow-50 rounded-full"></span>
                    <span className="h-1 w-1 bg-yellow-50 rounded-full animate-ping"></span>
                    <span className="h-1 w-1 bg-yellow-50 rounded-full"></span>
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3">Edge Processing</h4>
                <p className="text-richblack-300 text-sm leading-relaxed">
                  Google MediaPipe modules compute coordinate structures inside client-side frames. Attention tags and posture logs update instantly below the player.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-richblack-850/50 text-[11px] font-mono text-richblack-500">
                WASM Pipeline Speed: &lt; 30ms
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-richblack-900/50 p-8 rounded-2xl border border-richblack-800/80 hover:border-richblack-700/80 hover:bg-richblack-850/30 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="text-4xl font-extrabold text-richblack-700 font-mono group-hover:text-pink-100 transition-colors">03</span>
                  
                  {/* Visual 3: Send packets */}
                  <div className="text-[9px] font-mono bg-blue-900/20 text-blue-200 px-2.5 py-1 rounded border border-blue-900/30 animate-pulse">
                    POST logs
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3">Lightweight DB Logs</h4>
                <p className="text-richblack-300 text-sm leading-relaxed">
                  Aggregated metrics are compiled into standard packets and posted to MongoDB every 10 seconds, keeping database storage compact and responsive.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-richblack-850/50 text-[11px] font-mono text-richblack-500">
                Log Frequency: 10s Summary
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 5. COURSES SECTION (APPLE GRID BENTO SYSTEM) */}
      <div className="py-24 mx-auto w-11/12 max-w-[1260px] border-t border-richblack-800/80">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-blue-200">Catalog Offerings</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 leading-tight">Learn to build, cleanly.</h3>
          <p className="text-richblack-300 mt-4 font-normal">
            Select a learning pathway and begin your interactive coding courses today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Web Development (Wide Layout) */}
          <Link to="/catalog/web-development" className="p-10 rounded-3xl border border-richblack-800 bg-richblack-900/40 hover:bg-richblack-850/30 hover:border-blue-900/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col justify-between min-h-[260px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[100px] w-[100px] rounded-full bg-blue-900/5 blur-[40px] pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-900/30 border border-blue-900/40 text-blue-200 px-3 py-1 rounded-full">
                  Full Stack
                </span>
                <span className="text-[11px] font-mono text-richblack-500">10 Modules</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Web Development</h4>
              <p className="text-richblack-300 text-sm max-w-md leading-relaxed">
                Master React, Node.js, Express, and MongoDB. Design custom full-stack solutions and integrate localized device tracking components.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-200 flex items-center gap-1.5 mt-8 group-hover:text-white transition-colors">
              Explore Track <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 2: Data Science */}
          <Link to="/catalog/data-science" className="p-10 rounded-3xl border border-richblack-800 bg-richblack-900/40 hover:bg-richblack-850/30 hover:border-yellow-250/20 hover:shadow-2xl hover:shadow-yellow-900/5 transition-all duration-300 flex flex-col justify-between min-h-[260px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[100px] w-[100px] rounded-full bg-yellow-900/5 blur-[40px] pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-yellow-900/20 border border-yellow-800/30 text-yellow-100 px-3 py-1 rounded-full">
                  Analytics
                </span>
                <span className="text-[11px] font-mono text-richblack-500">8 Modules</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Data Science</h4>
              <p className="text-richblack-300 text-sm max-w-md leading-relaxed">
                Evaluate metrics, chart data distributions, and configure visual radars to analyze student learning drop-off points.
              </p>
            </div>
            <span className="text-xs font-semibold text-yellow-25 flex items-center gap-1.5 mt-8 group-hover:text-white transition-colors">
              Explore Track <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 3: Cyber Security */}
          <Link to="/catalog/cybersecurity" className="p-10 rounded-3xl border border-richblack-800 bg-richblack-900/40 hover:bg-richblack-850/30 hover:border-caribbeangreen-900/30 hover:shadow-2xl hover:shadow-caribbeangreen-900/5 transition-all duration-300 flex flex-col justify-between min-h-[260px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[100px] w-[100px] rounded-full bg-caribbeangreen-900/5 blur-[40px] pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-caribbeangreen-900/30 border border-caribbeangreen-900/40 text-caribbeangreen-100 px-3 py-1 rounded-full">
                  Security
                </span>
                <span className="text-[11px] font-mono text-richblack-500">6 Modules</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Cyber Security</h4>
              <p className="text-richblack-300 text-sm max-w-md leading-relaxed">
                Configure role authentication mechanisms, JWT authorization headers, cookies, and verification scripts to protect system APIs.
              </p>
            </div>
            <span className="text-xs font-semibold text-caribbeangreen-100 flex items-center gap-1.5 mt-8 group-hover:text-white transition-colors">
              Explore Track <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

          {/* Card 4: Machine Learning */}
          <Link to="/catalog/machine-learning" className="p-10 rounded-3xl border border-richblack-800 bg-richblack-900/40 hover:bg-richblack-850/30 hover:border-pink-900/30 hover:shadow-2xl hover:shadow-pink-900/5 transition-all duration-300 flex flex-col justify-between min-h-[260px] group relative overflow-hidden">
            <div className="absolute top-0 right-0 h-[100px] w-[100px] rounded-full bg-pink-900/5 blur-[40px] pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-pink-900/20 border border-pink-800/30 text-pink-100 px-3 py-1 rounded-full">
                  AI & CV
                </span>
                <span className="text-[11px] font-mono text-richblack-500">12 Modules</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Machine Learning</h4>
              <p className="text-richblack-300 text-sm max-w-md leading-relaxed">
                Deploy face landmarker vector geometry and posture estimation models locally inside React client wrappers.
              </p>
            </div>
            <span className="text-xs font-semibold text-pink-100 flex items-center gap-1.5 mt-8 group-hover:text-white transition-colors">
              Explore Track <FaArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>

        </div>
      </div>

      {/* 6. REVIEWS SLIDER SECTION */}
      <div className="relative mx-auto my-12 flex w-11/12 max-w-[1260px] flex-col items-center justify-between gap-6 border-t border-richblack-800 pt-24 text-white">
        <h3 className="text-center text-3xl sm:text-4xl font-extrabold text-white">
          Reviews from other learners
        </h3>
        <p className="text-richblack-300 text-sm text-center max-w-md">
          See how active telemetry feedback helps students stay posture-focused and code consistently.
        </p>
        <div className="w-full">
          <ReviewSlider />
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  )
}

export default Home
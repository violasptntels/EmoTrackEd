// Camera utilities for video streaming and error handling

/**
 * Creates a video stream from user's webcam
 * @param {Function} setCurrentEmotion - Function to set current emotion
 * @returns {Promise<MediaStream | null>} A media stream or null if access fails
 */
export const getUserVideoStream = async (setCurrentEmotion) => {
  try {
    // Check if MediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("MediaDevices API not supported in this browser");
      return null;
    }
    
    // Request access to webcam with video and audio
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user" // Specifically request front-facing camera
      },
      audio: true
    });
    
    // Set up a timer to simulate emotion detection (in real app, this would be AI-based)
    const emotionDetectionInterval = setInterval(() => {
      const emotions = ["joy", "neutral", "sadness", "surprise", "fear"];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      if (setCurrentEmotion) {
        setCurrentEmotion(randomEmotion);
      }
    }, 3000);
    
    // Attach the interval ID to the stream for cleanup later
    stream.emotionDetectionInterval = emotionDetectionInterval;
    
    return stream;
  } catch (err) {
    console.error("Error accessing user camera:", err);
    return null;
  }
};

/**
 * Creates a mock video stream using canvas
 * @returns {MediaStream | null} A mock media stream or null if creation fails
 */
export const createMockVideoStream = (setCurrentEmotion) => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    
    // Get the canvas context
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Failed to get canvas context");
      return null;
    }
    
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a message
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Kamera Simulasi', canvas.width / 2, canvas.height / 2 - 40);
    ctx.font = '18px Arial';
    ctx.fillText('Mode Simulasi Aktif', canvas.width / 2, canvas.height / 2);
    ctx.font = '14px Arial';
    ctx.fillText('(Tidak menggunakan kamera asli)', canvas.width / 2, canvas.height / 2 + 30);
    
    const updateCanvas = () => {
      try {
        // Clear the bottom part for the timestamp
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        
        // Add timestamp
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(timeString, canvas.width / 2, canvas.height - 35);
        ctx.font = '12px Arial';
        ctx.fillText('Simulasi Deteksi Emosi', canvas.width / 2, canvas.height - 15);
        
        // Add simulated detection (changes every few seconds)
        if (Math.floor(now.getSeconds() / 3) % 5 === 0) {
          setCurrentEmotion('joy');
        } else if (Math.floor(now.getSeconds() / 3) % 5 === 1) {
          setCurrentEmotion('neutral');
        } else if (Math.floor(now.getSeconds() / 3) % 5 === 2) {
          setCurrentEmotion('sadness');
        } else if (Math.floor(now.getSeconds() / 3) % 5 === 3) {
          setCurrentEmotion('fear');
        } else {
          setCurrentEmotion('surprise');
        }
      } catch (updateErr) {
        console.error("Error updating canvas:", updateErr);
      }
    };
    
    // Update the canvas every second
    updateCanvas();
    const intervalId = setInterval(updateCanvas, 1000);
    
    // Create a stream from the canvas
    let mockStream;
    try {
      // Check if the canvas has the captureStream method
      if (typeof canvas.captureStream !== 'function') {
        console.error("Canvas captureStream not supported in this browser");
        clearInterval(intervalId);
        return null;
      }
      
      // @ts-ignore - this is a standard API but TypeScript might not recognize it
      mockStream = canvas.captureStream(30); // 30 FPS
      
      try {
        // Add a mock audio track if needed
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          const oscillator = audioContext.createOscillator();
          const dst = oscillator.connect(audioContext.createMediaStreamDestination());
          oscillator.start();
          const audioTrack = dst.stream.getAudioTracks()[0];
          mockStream.addTrack(audioTrack);
        }
      } catch (audioErr) {
        console.warn("Could not add mock audio track:", audioErr);
        // Continue without audio if it fails
      }
      
      // Store the interval ID to clear it later
      mockStream.intervalId = intervalId;
    } catch (err) {
      console.error("Error creating mock stream:", err);
      clearInterval(intervalId);
      return null;
    }
    
    return mockStream;
  } catch (err) {
    console.error("Fatal error in createMockVideoStream:", err);
    return null;
  }
};

/**
 * Safely stops a media stream by stopping all tracks
 * @param {MediaStream} stream - The stream to stop
 */
export const stopMediaStream = (stream) => {
  try {
    if (stream) {
      // Clear any interval that might be running for mock video
      if (stream.intervalId) {
        clearInterval(stream.intervalId);
      }
      
      // Safely stop each track
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        try {
          track.stop();
        } catch (trackErr) {
          console.warn("Error stopping track:", trackErr);
        }
      });
    }
  } catch (err) {
    console.error("Error stopping media stream:", err);
  }
};

/**
 * Safely clean up the video element
 * @param {HTMLVideoElement} videoElement - The video element to clean
 */
export const cleanupVideoElement = (videoElement) => {
  try {
    if (videoElement) {
      videoElement.onloadedmetadata = null;
      videoElement.onerror = null;
      videoElement.srcObject = null;
      videoElement.load(); // Force resource release
    }
  } catch (err) {
    console.error("Error cleaning up video element:", err);
  }
};

/**
 * Parses and formats webcam error messages to be user friendly
 * @param {Error} error - The error object from getUserMedia
 * @returns {string} A user-friendly error message
 */
export const getWebcamErrorMessage = (error) => {
  if (!error) return "Terjadi kesalahan saat mengakses kamera.";

  // Common getUserMedia error names and messages
  switch(error.name) {
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return "Kamera tidak ditemukan. Pastikan perangkat kamera tersambung dengan benar.";
    
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return "Akses ke kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.";
    
    case 'NotReadableError':
    case 'TrackStartError':
      return "Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi yang mungkin menggunakan kamera dan coba lagi.";
    
    case 'OverconstrainedError':
      return "Kamera tidak mendukung pengaturan yang diminta. Coba gunakan mode simulasi.";
    
    case 'TypeError':
      return "Parameter tidak valid. Coba muat ulang halaman.";
    
    case 'AbortError':
      return "Akses kamera dibatalkan. Coba muat ulang halaman.";
    
    case 'SecurityError':
      return "Akses kamera ditolak karena alasan keamanan. Coba gunakan mode simulasi.";
    
    default:
      return `Tidak dapat mengakses kamera: ${error.message || error.name || "Kesalahan tidak diketahui"}`;
  }
};

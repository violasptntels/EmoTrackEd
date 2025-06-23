/**
 * Mengambil video stream dari kamera pengguna
 * @param {Function} setCurrentEmotion - Opsional callback untuk simulasi deteksi emosi
 * @returns {Promise<MediaStream|null>}
 */
export const getUserVideoStream = async (setCurrentEmotion) => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("MediaDevices API tidak tersedia di browser ini");
      return null;
    }

    let videoDevices = [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        console.warn("Tidak ada kamera yang terdeteksi");
        // Continue anyway to try getUserMedia without deviceId
      }
    } catch (enumError) {
      console.error("Gagal mendapatkan daftar perangkat:", enumError);
      // Continue anyway to try getUserMedia without device info
    }

    const constraintList = [
      { video: true, audio: true },
      { video: { deviceId: { exact: videoDevices[0].deviceId } }, audio: true },
      { video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user", frameRate: { ideal: 30 } }, audio: true },
      { video: true, audio: false }
    ];

    for (const constraints of constraintList) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Berhasil mendapatkan stream dengan constraint:", constraints);

        if (setCurrentEmotion) {
          const emotions = ["joy", "neutral", "sadness", "surprise", "fear"];
          const interval = setInterval(() => {
            const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
            setCurrentEmotion(randomEmotion);
          }, 3000);
          stream.emotionDetectionInterval = interval;
        }

        return stream;
      } catch (err) {
        console.warn("Gagal dengan constraint:", constraints, err);
        continue;
      }
    }

    return null;
  } catch (err) {
    console.error("Kesalahan saat akses kamera:", err);
    return null;
  }
};

/**
 * Membuat video stream palsu (simulasi)
 */
export const createMockVideoStream = (setCurrentEmotion) => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    
    // Make sure we can get a context, otherwise return null
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("Tidak dapat mendapatkan context dari canvas untuk mock stream");
      return null;
    }

    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the initial text
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '20px Arial';
    ctx.fillText('Mode Simulasi Kamera', canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = '16px Arial';
    ctx.fillText('Tidak ada akses kamera nyata', canvas.width / 2, canvas.height / 2);

    const updateCanvas = () => {
      // Redraw only the bottom info area
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      
      const now = new Date();
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = '16px Arial';
      ctx.fillText(now.toLocaleTimeString(), canvas.width / 2, canvas.height - 35);
      ctx.fillText('Simulasi Deteksi Emosi', canvas.width / 2, canvas.height - 15);

      // Update emotion every second based on the current second
      const second = now.getSeconds() % 5;
      const emotions = ["joy", "neutral", "sadness", "fear", "surprise"];
      if (typeof setCurrentEmotion === 'function') {
        setCurrentEmotion(emotions[second]);
      }
    };

    // Initial update
    updateCanvas();
    
    // Set interval for regular updates
    const intervalId = setInterval(updateCanvas, 1000);

    // Create stream from canvas
    let stream;
    try {
      stream = canvas.captureStream(30);
      stream.intervalId = intervalId;
    } catch (err) {
      console.error("Gagal membuat stream dari canvas:", err);
      clearInterval(intervalId);
      return null;
    }

    return stream;  } catch (err) {
    console.error("Gagal membuat mock stream:", err);
    
    // Create a fallback if canvas.captureStream is not available
    try {
      // Create a static image as absolute fallback
      const img = document.createElement('img');
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480">' +
        '<rect width="640" height="480" fill="#6366f1" />' +
        '<text x="320" y="240" font-family="Arial" font-size="24" fill="white" text-anchor="middle">' +
        'Mode Simulasi Kamera' +
        '</text>' +
        '<text x="320" y="280" font-family="Arial" font-size="18" fill="white" text-anchor="middle">' +
        'Browser tidak mendukung simulasi kamera' +
        '</text>' +
        '</svg>'
      );
      
      // Simulate a MediaStream object as best we can
      return {
        getVideoTracks: () => [{
          enabled: true,
          // Basic stubs for track methods
          stop: () => {},
          getSettings: () => ({ width: 640, height: 480 })
        }],
        getTracks: () => [{
          enabled: true,
          stop: () => {}
        }],
        // Add a method to get the image source for fallback
        getImageSource: () => img.src
      };
    } catch (fallbackErr) {
      console.error("Complete failure creating any mock video:", fallbackErr);
      return null;
    }
  }
};

/**
 * Menghentikan semua track dari stream
 */
export const stopMediaStream = (stream) => {
  if (stream) {
    if (stream.intervalId) clearInterval(stream.intervalId);
    stream.getTracks().forEach(track => {
      try {
        track.stop();
      } catch (err) {
        console.warn("Gagal menghentikan track:", err);
      }
    });
  }
};

/**
 * Bersihkan elemen video
 */
export const cleanupVideoElement = (videoElement) => {
  try {
    if (videoElement) {
      videoElement.onloadedmetadata = null;
      videoElement.onerror = null;
      videoElement.srcObject = null;
      videoElement.load();
    }
  } catch (err) {
    console.error("Gagal membersihkan elemen video:", err);
  }
};

/**
 * Format pesan error dari kamera
 */
export const getWebcamErrorMessage = (error) => {
  if (!error) return "Terjadi kesalahan saat mengakses kamera. Mode simulasi diaktifkan.";

  switch (error.name) {
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return "Kamera tidak ditemukan. Mode simulasi diaktifkan.";
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return "Akses kamera ditolak. Cek pengaturan izin di browser. Mode simulasi diaktifkan.";
    case 'NotReadableError':
      return "Kamera sedang digunakan oleh aplikasi lain. Mode simulasi diaktifkan.";
    case 'OverconstrainedError':
      return "Kamera tidak mendukung konfigurasi yang diminta. Mode simulasi diaktifkan.";
    case 'SecurityError':
      return "Akses kamera diblokir karena alasan keamanan. Mode simulasi diaktifkan.";
    case 'TypeError':
      // Often happens when MediaDevices API is not available
      return "Browser Anda tidak mendukung akses kamera. Mode simulasi diaktifkan.";
    default:
      return `Tidak dapat mengakses kamera: ${error.message || error.name}. Mode simulasi diaktifkan.`;
  }
};

/**
 * Tes akses kamera dan info perangkat
 */
export const testCameraAccess = async () => {
  try {
    // Check if mediaDevices API is available
    if (!navigator?.mediaDevices || !navigator?.mediaDevices?.getUserMedia) {
      console.warn("MediaDevices API tidak tersedia");
      return { 
        success: false, 
        message: "API MediaDevices tidak tersedia di browser ini. Mode simulasi akan digunakan sebagai gantinya.", 
        devices: [],
        useMock: true 
      };
    }
    
    let videoDevices = [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        return { 
          success: false, 
          message: "Tidak ada kamera yang terdeteksi. Mode simulasi akan digunakan.", 
          devices: [],
          useMock: true 
        };
      }
    } catch (enumError) {
      console.error("Gagal mendapatkan daftar perangkat:", enumError);
      return { 
        success: false, 
        message: "Gagal mengakses daftar perangkat kamera. Mode simulasi akan digunakan.", 
        error: enumError,
        useMock: true 
      };
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: videoDevices.length > 0 
        ? { deviceId: { exact: videoDevices[0].deviceId }, width: { ideal: 640 }, height: { ideal: 480 } }
        : true
    });

    const track = stream.getVideoTracks()[0];
    const trackInfo = {
      settings: track?.getSettings?.(),
      capabilities: track?.getCapabilities?.()
    };

    stream.getTracks().forEach(track => track.stop());

    return {
      success: true,
      message: "Kamera berhasil diakses",
      devices: videoDevices.map(d => ({ id: d.deviceId, label: d.label || "Unnamed Camera" })),
      trackInfo
    };
  } catch (err) {
    return {
      success: false,
      message: getWebcamErrorMessage(err),
      error: { name: err.name, message: err.message }
    };
  }
};

/**
 * Fungsi placeholder untuk polyfill kamera (menghindari error)
 */
export const initializeBrowserCameraPolyfills = () => {
  console.log("initializeBrowserCameraPolyfills() dipanggil - tidak ada polyfill khusus diperlukan.");
};

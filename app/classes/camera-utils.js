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
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const updateCanvas = () => {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
      const now = new Date();
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.font = '16px Arial';
      ctx.fillText(now.toLocaleTimeString(), canvas.width / 2, canvas.height - 35);
      ctx.fillText('Simulasi Deteksi Emosi', canvas.width / 2, canvas.height - 15);

      const second = now.getSeconds() % 5;
      const emotions = ["joy", "neutral", "sadness", "fear", "surprise"];
      if (setCurrentEmotion) setCurrentEmotion(emotions[second]);
    };

    updateCanvas();
    const intervalId = setInterval(updateCanvas, 1000);

    const stream = canvas.captureStream(30);
    stream.intervalId = intervalId;

    return stream;
  } catch (err) {
    console.error("Gagal membuat mock stream:", err);
    return null;
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
  if (!error) return "Terjadi kesalahan saat mengakses kamera.";

  switch (error.name) {
    case 'NotFoundError':
    case 'DevicesNotFoundError':
      return "Kamera tidak ditemukan.";
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      return "Akses kamera ditolak. Cek pengaturan izin di browser.";
    case 'NotReadableError':
      return "Kamera sedang digunakan oleh aplikasi lain.";
    case 'OverconstrainedError':
      return "Kamera tidak mendukung konfigurasi yang diminta.";
    case 'SecurityError':
      return "Akses kamera diblokir karena alasan keamanan.";
    default:
      return `Tidak dapat mengakses kamera: ${error.message || error.name}`;
  }
};

/**
 * Tes akses kamera dan info perangkat
 */
export const testCameraAccess = async () => {
  try {
    // Check if mediaDevices API is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { success: false, message: "API MediaDevices tidak tersedia di browser ini", devices: [] };
    }
    
    let videoDevices = [];
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      videoDevices = devices.filter(device => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        return { success: false, message: "Tidak ada kamera yang terdeteksi", devices: [] };
      }
    } catch (enumError) {
      console.error("Gagal mendapatkan daftar perangkat:", enumError);
      return { success: false, message: "Gagal mengakses daftar perangkat kamera", error: enumError };
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

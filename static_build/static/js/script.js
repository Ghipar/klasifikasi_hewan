var video = document.querySelector("#video-webcam");
var fileInput = document.querySelector("#file-input");
var takePictureButton = document.getElementById("take-picture-button");
var dataID = "";
var dataEN = "";
var confidenceId = 0;
var confidenceEn = 0;
var videoContainer = document.getElementById("video-container");
const predictionIdBox = document.getElementById("predBoxId");
const predictionEnBox = document.getElementById("predBoxEN");
const name = document.getElementById("name");
const audioElement = document.getElementById("myAudio");
const audioElementAnimal = document.getElementById("myAudioAnimal");
const animalVideo = document.getElementById("animalVideo");
const animalVideoContainer = document.getElementById("videoContainer");
const playIcon = document.querySelector(".play-icon");
const speaker = document.querySelector(".speaker");
var btnUpload = document.getElementById("import-image"); // Elemen <img>
var btnReset = document.getElementById("btnreset"); // Elemen <img>
let isPlayingRead = false;
let isPlayingAnimal = false;
let language = "Id";
var totalData = 100 - parseInt(confidenceId);
var totalDataEn = 100 - parseInt(confidenceEn);
let currentDataID = null;
let currentDataEN = null;
let myChart;

// Modal handling
var modal = document.getElementById("myModal");
var btn = document.getElementById("languageLogo");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function () {
    modal.style.display = "block";
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

// Ambil elemen teks hasil dan judul
// const resultText = document.querySelector('.name');
// const resultTitle = document.querySelector('.titleResult');

// Fungsi untuk memeriksa panjang teks dan mengatur posisi judul
// function adjustTitlePosition() {
// console.log();

//   const textLength = resultText.textContent.length; // Hitung panjang teks (termasuk spasi)
//   if (textLength > 8) {
//     resultTitle.style.marginTop = '-10px'; // Geser ke atas
//     console.log('berhasil');
    
//   } else {
//     resultTitle.style.marginTop = '10px'; // Kembali ke posisi awal
//     console.log('gagal');
//   }
// }

// Jalankan fungsi saat halaman dimuat
// window.addEventListener('load', adjustTitlePosition);

// Jika teks berubah secara dinamis, tambahkan observer (opsional)
// const observer = new MutationObserver(adjustTitlePosition);
// observer.observe(resultText, { childList: true, characterData: true, subtree: true });

// Fungsi untuk memperbarui teks dan audio berdasarkan bahasa
function updateLanguageContent() {
    if (language === "Id" && dataID) {
        $("#name").html(dataID);
        $("#confidence").html(confidenceId + "%");
        myChart.data.datasets[0].data = [confidenceId, totalData];
        audioElement.src = staticPath + "audios/Id/" + dataID + ".mp3";
        audioElementAnimal.src = staticPath + "audios/Id/animalSound/" + dataID + ".mp3";
        animalVideo.src = staticPath + "videos/Id/" + dataID + ".mp4";
        // adjustTitlePosition();
    } else if (language === "En" && dataEN) {
        $("#name").html(dataEN);
        $("#confidence").html(confidenceEn + "%");
        myChart.data.datasets[0].data = [confidenceEn, totalDataEn];
        audioElement.src = staticPath + "audios/En/" + dataEN + ".mp3";
        audioElementAnimal.src = staticPath + "audios/En/animalSound/" + dataEN + ".mp3";
        animalVideo.src = staticPath + "videos/En/" + dataEN + ".mp4";
    }
    myChart.update();
}

// Fungsi bahasa
function setLanguageId() {
    language = "Id";
    modal.style.display = "none";
    $("#text1Logo").html("Pengenalan");
    $("#text2Logo").html("Hewan");
    $("#resBtn").html("Ulang");
    $("#imgBtn").html("Unggah Gambar");
    $("#predBtn").html("Prediksi");
    $("#titleAccuracy").html("Akurasi");
    $("#titleResult").html("Hasil");
    $("#soundTitle").html("Suara Hewan");
    $("#text1LgTitle").html("Pilih");
    $("#text2LgTitle").html("Bahasa");
    $("#btnLgId").html("Bahasa indonesia");
    $("#btnLgEn").html("Bahasa inggris");
    $("#noSoundText").html("Hewan tidak memliki suara");
    updateLanguageContent();
}

function setLanguageEn() {
    language = "En";
    modal.style.display = "none";
    $("#text1Logo").html("Introducing");
    $("#text2Logo").html("Animal");
    $("#resBtn").html("Reset");
    $("#imgBtn").html("Upload Image");
    $("#predBtn").html("Predict");
    $("#titleAccuracy").html("Accuracy");
    $("#titleResult").html("Result");
    $("#soundTitle").html("Animal Sound");
    $("#text1LgTitle").html("Choose");
    $("#text2LgTitle").html("Language");
    $("#btnLgId").html("Indonesian Language");
    $("#btnLgEn").html("English Language");
    $("#noSoundText").html("There is no animal sound");
    updateLanguageContent();
}

document.getElementById("btnLgId").addEventListener("click", setLanguageId);
document.getElementById("btnLgEn").addEventListener("click", setLanguageEn);

// Inisialisasi chart dan modal saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("accuracyChart").getContext("2d");
    myChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            datasets: [{
                data: [confidenceId, totalData],
                backgroundColor: ["#1f85c6", "transparent"],
                borderWidth: 0,
            }],
        },
        options: {
            responsive: false,
            cutout: "75%",
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
            },
        },
    });
    modal.style.display = "block";
    btnReset.style.pointerEvents = "auto"; // Menonaktifkan interaksi
    btnReset.style.opacity = "1"; // Efek visual nonaktif

    // Inisialisasi kamera saat halaman dimuat
    startCamera();
});

// Fungsi untuk memulai kamera
async function startCamera() {
  const video = document.getElementById('video-webcam');
  if (!video) {
    console.error('Elemen video tidak ditemukan di DOM');
    alert('Elemen video tidak ditemukan. Periksa HTML.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false
    });
    video.srcObject = stream;
    video.play();

    // Periksa kamera yang aktif
    const tracks = stream.getVideoTracks();
    const settings = tracks[0].getSettings();
    const facingMode = settings.facingMode || 'unknown';
    console.log('Kamera yang digunakan:', facingMode);
    if (facingMode === 'environment') {
        video.style.transform = 'scaleX(1)';
      } else {
        video.style.transform = 'scaleX(-1)'; // Kamera depan tetap mirrored
      }
  } catch (err) {
    console.error('Gagal mengakses kamera:', err.name, err.message);
    if (err.name === 'NotFoundError') {
      alert('Tidak ada kamera yang ditemukan di perangkat Anda. Silakan unggah gambar sebagai alternatif.');
    } else {
      alert(`Gagal mengakses kamera: ${err.name} - ${err.message}`);
    }
  }
}

// Fungsi untuk menangani error akses kamera
function videoError(error) {
    console.error('Gagal mengakses kamera:', error);
    let message = '';
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        if (language === "Id") {
            message = 'Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser atau perangkat Anda:\n' +
                      '- Untuk Safari (iOS): Buka Settings > Safari > Camera, lalu pilih "Ask" atau "Allow".\n' +
                      '- Untuk Chrome (Android): Buka Settings > Site Settings > Camera, lalu izinkan situs ini.';
        } else {
            message = 'Camera access denied. Please allow camera access in your browser or device settings:\n' +
                      '- For Safari (iOS): Go to Settings > Safari > Camera, then select "Ask" or "Allow".\n' +
                      '- For Chrome (Android): Go to Settings > Site Settings > Camera, then allow this site.';
        }
        alert(message);

        // Tambahkan tombol untuk mencoba lagi setelah mengubah perizinan
        const retryButton = document.createElement('button');
        retryButton.textContent = language === "Id" ? 'Coba Lagi' : 'Try Again';
        retryButton.style.margin = '10px';
        retryButton.style.padding = '10px 20px';
        retryButton.style.backgroundColor = '#1f85c6';
        retryButton.style.color = '#fff';
        retryButton.style.border = 'none';
        retryButton.style.borderRadius = '5px';
        retryButton.style.cursor = 'pointer';
        retryButton.onclick = () => {
            startCamera(); // Coba lagi untuk mengakses kamera
            retryButton.remove(); // Hapus tombol setelah dicoba
        };
        videoContainer.appendChild(retryButton);
    } else {
        alert(language === "Id" ? 
              'Terjadi kesalahan saat mengakses kamera: ' + error.message : 
              'An error occurred while accessing the camera: ' + error.message);
    }
}

// Fungsi audio
function readSound() {
    if (!dataID && !dataEN) {
        alert(language === "Id" ? "Belum ada audio yang bisa diputar!" : "No audio available to play!");
        return;
    }
    if (isPlayingRead) {
        audioElement.pause();
        speaker.src = staticPath + "img/Speaker.png";
        speaker.dataset.state = "play";
        isPlayingRead = false;
    } else {
        const audioSrc = language === "Id" ?
            staticPath + "audios/Id/" + dataID + ".mp3" :
            staticPath + "audios/En/" + dataEN + ".mp3";
        console.log("Read audio source:", audioSrc); // Debugging
        if ((language === "Id" && currentDataID !== dataID) ||
            (language === "En" && currentDataEN !== dataEN) ||
            !audioElement.src) {
            audioElement.src = audioSrc;
            currentDataID = language === "Id" ? dataID : null;
            currentDataEN = language === "En" ? dataEN : null;
        }
        if (audioElement.ended) audioElement.currentTime = 0;
        audioElement.play()
            .then(() => {
                speaker.src = staticPath + "img/Speaker.png";
                speaker.dataset.state = "pause";
                isPlayingRead = true;
            })
            .catch((error) => console.error("Error playing audio:", error));
    }
}

audioElement.addEventListener("ended", function () {
    speaker.src = staticPath + "img/Speaker.png";
    speaker.dataset.state = "play";
    isPlayingRead = false;
    audioElement.currentTime = 0;
});

document.querySelector(".speaker").addEventListener("click", readSound);

function animalSound() {
    if (!dataID && !dataEN) {
        alert(language === "Id" ? "Belum ada audio yang bisa diputar!" : "No audio available to play!");
        return;
    }
    if (isPlayingAnimal) {
        audioElementAnimal.pause();
        playIcon.src = staticPath + "img/ic_play.png";
        playIcon.dataset.state = "play";
        isPlayingAnimal = false;
    } else {
        const audioSrc = language === "Id" ?
            staticPath + "audios/Id/animalSound/" + dataID + ".mp3" :
            staticPath + "audios/En/animalSound/" + dataEN + ".mp3";
        console.log("Animal audio source:", audioSrc); // Debugging
        if ((language === "Id" && currentDataID !== dataID) ||
            (language === "En" && currentDataEN !== dataEN) ||
            !audioElementAnimal.src) {
            audioElementAnimal.src = audioSrc;
            currentDataID = language === "Id" ? dataID : null;
            currentDataEN = language === "En" ? dataEN : null;
        }
        if (audioElementAnimal.ended) audioElementAnimal.currentTime = 0;
        audioElementAnimal.play()
            .then(() => {
                playIcon.src = staticPath + "img/ic_pause.png";
                playIcon.dataset.state = "pause";
                isPlayingAnimal = true;
            })
            .catch((error) => {
                console.error("Error playing animal sound:", error);
                language == "Id" ?
                    alert("Hewan ini tidak memiliki suara") : alert("This animal does not have any sound");
            });
    }
}

audioElementAnimal.addEventListener("ended", function () {
    playIcon.src = staticPath + "img/ic_play.png";
    playIcon.dataset.state = "play";
    isPlayingAnimal = false;
    audioElementAnimal.currentTime = 0;
});

document.querySelector(".play-icon").addEventListener("click", animalSound);

// Webcam handling
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

// Hapus inisialisasi langsung, digantikan dengan startCamera() di DOMContentLoaded
// if (navigator.getUserMedia) {
//     navigator.getUserMedia({ video: true }, handleVideo, videoError);
// }

document.getElementById("import-image").addEventListener("click", function () {
    fileInput.click();
});

function handleVideo(stream) {
    video.srcObject = stream;
    video.play();
}

// Event handlers
$(document).ready(function () {
    $("#btnreset").on("click", resetSnapshot);
});

async function SetPrediction() {
    const formData = new FormData($("#myForm")[0]);
    formData.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
    formData.append("gmbr", fileInput.files[0]);

    try {
        const [idResponse, enResponse] = await Promise.all([
            $.ajax({
                type: "POST",
                url: predictIdUrl,
                data: formData,
                processData: false,
                contentType: false,
            }),
            $.ajax({
                type: "POST",
                url: predictEnUrl,
                data: formData,
                processData: false,
                contentType: false,
            }),
        ]);

        // Simpan hasil prediksi untuk kedua bahasa
        dataID = idResponse.prediction; // Normalisasi ke lowercase
        confidenceId = parseInt(idResponse.confidence);
        totalData = 100 - confidenceId;

        dataEN = enResponse.prediction; // Normalisasi ke lowercase
        confidenceEn = parseInt(enResponse.confidence);
        totalDataEn = 100 - confidenceEn;

        // Perbarui UI berdasarkan bahasa saat ini
        if (language === "Id") {
            $("#name").html(dataID);
            $("#confidence").html(confidenceId + "%");
            myChart.data.datasets[0].data = [confidenceId, totalData];
            audioElement.src = staticPath + "audios/Id/" + dataID + ".mp3";
            audioElementAnimal.src = staticPath + "audios/Id/animalSound/" + dataID + ".mp3";
            animalVideo.src = staticPath + "videos/Id/" + dataID + ".mp4";
        } else {
            $("#name").html(dataEN);
            $("#confidence").html(confidenceEn + "%");
            myChart.data.datasets[0].data = [confidenceEn, totalDataEn];
            audioElement.src = staticPath + "audios/En/" + dataEN + ".mp3";
            audioElementAnimal.src = staticPath + "audios/En/animalSound/" + dataEN + ".mp3";
            animalVideo.src = staticPath + "videos/En/" + dataEN + ".mp4";
        }
        myChart.update();
    } catch (error) {
        console.error("Prediction error:", error);
    }
}

async function loadImage() {
    btnUpload.style.pointerEvents = "none"; // Menonaktifkan interaksi
    btnUpload.style.opacity = "0.5"; // Efek visual nonaktif
    const file = fileInput.files[0];
    if (!file) return;

    btnReset.style.pointerEvents = "none";
    btnReset.style.opacity = "0.5";
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.className = "img-container";
    img.style.cssText = "width: 600px; height: 400px; border-radius: 19px; margin: 12px; object-fit: cover;";
    videoContainer.innerHTML = "";
    videoContainer.appendChild(img);

    predictionIdBox.style.display = "block";
    if (!dataID || !dataEN) {
        console.log("menungguuu");
        await SetPrediction(); // Tunggu hingga prediksi selesai
    }
    const audioSrc = language === "Id"
        ? staticPath + "audios/Id/" + dataID + ".mp3"
        : staticPath + "audios/En/" + dataEN + ".mp3";
    const animalAudioSrc = language === "Id"
        ? staticPath + "audios/Id/animalSound/" + dataID + ".mp3"
        : staticPath + "audios/En/animalSound/" + dataEN + ".mp3";

    audioElement.src = audioSrc;
    audioElementAnimal.src = animalAudioSrc;

    try {
        const response = await fetch(animalAudioSrc);
        if (!response.ok) {
            $("#audio-player").css("display", "none");
            $("#noSound").css("display", "block");
        } else {
            $("#audio-player").css("display", "flex");
            $("#noSound").css("display", "none");
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
    console.log("dataID:", dataID, "dataEN:", dataEN); // Debugging
    //karena take shooot baru tampilkan
    $("#nolPersen").css("display", "none");
    $("#confidence").css("display", "flex");
    $("#accuracyChart").css("display", "block");
    $("#animalVideo").css("display", "block");
    if (predictionIdBox) {
        animalVideoContainer.style.display = "flex";
    }
    btnReset.style.pointerEvents = "auto";
    btnReset.style.opacity = "1";
}

// async function takeSnapshot() {
//     btnUpload.style.pointerEvents = "none"; // Menonaktifkan interaksi
//     btnUpload.style.opacity = "0.5"; // Efek visual nonaktif
//     predictionIdBox.style.display = "block";
//     if (!video) {
//         console.error("Video element not found.");
//         return;
//     }
//     btnReset.style.pointerEvents = "none";
//     btnReset.style.opacity = "0.5";
//     const canvas = document.createElement("canvas");
//     const context = canvas.getContext("2d");
//     canvas.width = video.offsetWidth;
//     canvas.height = video.offsetHeight;
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const img = document.createElement("img");
//     img.src = canvas.toDataURL("image/png");
//     img.className = "img-container";
//     videoContainer.innerHTML = "";
//     videoContainer.appendChild(img);

//     const blob = dataURItoBlob(img.src);
//     const formData = new FormData($("#myForm")[0]);
//     formData.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
//     formData.append("gmbr", blob, fileInput.files[0]);

//     try {
//         const [idResponse, enResponse] = await Promise.all([
//             $.ajax({
//                 type: "POST",
//                 url: predictIdUrl,
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//             }),
//             $.ajax({
//                 type: "POST",
//                 url: predictEnUrl,
//                 data: formData,
//                 processData: false,
//                 contentType: false,
//             }),
//         ]);

//         // Simpan hasil prediksi untuk kedua bahasa
//         dataID = idResponse.prediction; // Normalisasi ke lowercase
//         confidenceId = parseInt(idResponse.confidence);
//         totalData = 100 - confidenceId;

//         dataEN = enResponse.prediction; // Normalisasi ke lowercase
//         confidenceEn = parseInt(enResponse.confidence);
//         totalDataEn = 100 - confidenceEn;

//         // Perbarui UI berdasarkan bahasa saat ini
//         if (language === "Id") {
//             $("#name").html(dataID);
//             $("#confidence").html(confidenceId + "%");
//             myChart.data.datasets[0].data = [confidenceId, totalData];
//             audioElement.src = staticPath + "audios/Id/" + dataID + ".mp3";
//             audioElementAnimal.src = staticPath + "audios/Id/animalSound/" + dataID + ".mp3";
//             animalVideo.src = staticPath + "videos/Id/" + dataID + ".mp4";
//             console.log("looo : " + dataID);

//         } else {
//             $("#name").html(dataEN);
//             $("#confidence").html(confidenceEn + "%");
//             myChart.data.datasets[0].data = [confidenceEn, totalDataEn];
//             audioElement.src = staticPath + "audios/En/" + dataEN + ".mp3";
//             audioElementAnimal.src = staticPath + "audios/En/animalSound/" + dataEN + ".mp3";
//             animalVideo.src = staticPath + "videos/En/" + dataEN + ".mp4";
//         }

//         const audioSrc = language === "Id"
//             ? staticPath + "audios/Id/" + dataID + ".mp3"
//             : staticPath + "audios/En/" + dataEN + ".mp3";
//         const animalAudioSrc = language === "Id"
//             ? staticPath + "audios/Id/animalSound/" + dataID + ".mp3"
//             : staticPath + "audios/En/animalSound/" + dataEN + ".mp3";

//         audioElement.src = audioSrc;
//         audioElementAnimal.src = animalAudioSrc;

//         try {
//             const response = await fetch(animalAudioSrc);
//             if (!response.ok) {
//                 $("#audio-player").css("display", "none");
//                 $("#noSound").css("display", "block");
//             } else {
//                 $("#audio-player").css("display", "flex");
//                 $("#noSound").css("display", "none");
//             }
//         } catch (error) {
//             console.error("Fetch error:", error);
//         }
//         console.log("dataID:", dataID, "dataEN:", dataEN); // Debugging
//         //karena take shooot baru tampilkan
//         $("#nolPersen").css("display", "none");
//         $("#confidence").css("display", "flex");
//         $("#accuracyChart").css("display", "block");
//         $("#animalVideo").css("display", "block");
//         if (predictionIdBox) {
//             animalVideoContainer.style.display = "flex";
//         }
//         myChart.update();
//     } catch (error) {
//         console.error("Snapshot error:", error);
//     } finally {
//         // Aktifkan kembali btnReset setelah pemrosesan selesai (berhasil atau gagal)
//         btnReset.style.pointerEvents = "auto";
//         btnReset.style.opacity = "1";
//     }
// }
async function takeSnapshot() {
    // Nonaktifkan tombol upload selama pemrosesan
    btnUpload.style.pointerEvents = "none";
    btnUpload.style.opacity = "0.5";
  
    // Tampilkan predictionIdBox
    predictionIdBox.style.display = "block";
  
    const video = document.getElementById('video-webcam');
    const videoContainer = document.getElementById('video-container');
  
    if (!video) {
      console.error("Video element not found.");
      return;
    }
  
    // Nonaktifkan tombol reset selama pemrosesan
    btnReset.style.pointerEvents = "none";
    btnReset.style.opacity = "0.5";
  
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
  
    // Ambil dimensi preview yang terlihat di layar
    const previewWidth = videoContainer.offsetWidth;
    const previewHeight = videoContainer.offsetHeight;
  
    // Atur dimensi canvas sesuai dengan preview
    canvas.width = previewWidth;
    canvas.height = previewHeight;
  
    // Hitung rasio aspek video asli untuk memastikan capture sesuai preview
    const videoAspectRatio = video.videoWidth / video.videoHeight;
    const previewAspectRatio = previewWidth / previewHeight;
  
    let srcWidth, srcHeight, srcX, srcY;
    if (videoAspectRatio > previewAspectRatio) {
      srcHeight = video.videoHeight;
      srcWidth = video.videoHeight * previewAspectRatio;
      srcX = (video.videoWidth - srcWidth) / 2;
      srcY = 0;
    } else {
      srcWidth = video.videoWidth;
      srcHeight = video.videoWidth / previewAspectRatio;
      srcX = 0;
      srcY = (video.videoHeight - srcHeight) / 2;
    }
  
    context.drawImage(video, srcX, srcY, srcWidth, srcHeight, 0, 0, canvas.width, canvas.height);
  
    // Tampilkan gambar yang diambil
    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    img.className = "img-container"; // Gunakan kelas yang sudah ada
    videoContainer.innerHTML = ""; // Kosongkan container
    videoContainer.appendChild(img);
  
    // Tombol capture tidak ditambahkan kembali, sehingga akan disembunyikan
  
    // Konversi data URI ke blob untuk dikirim ke server
    const blob = dataURItoBlob(img.src);
    const formData = new FormData($("#myForm")[0]);
    formData.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());
    formData.append("gmbr", blob, fileInput.files[0]);
  
    try {
      const [idResponse, enResponse] = await Promise.all([
        $.ajax({
          type: "POST",
          url: predictIdUrl,
          data: formData,
          processData: false,
          contentType: false,
        }),
        $.ajax({
          type: "POST",
          url: predictEnUrl,
          data: formData,
          processData: false,
          contentType: false,
        }),
      ]);
  
      // Simpan hasil prediksi untuk kedua bahasa
      dataID = idResponse.prediction; // Normalisasi ke lowercase
      confidenceId = parseInt(idResponse.confidence);
      totalData = 100 - confidenceId;
  
      dataEN = enResponse.prediction; // Normalisasi ke lowercase
      confidenceEn = parseInt(enResponse.confidence);
      totalDataEn = 100 - confidenceEn;
  
      // Perbarui UI berdasarkan bahasa saat ini
      if (language === "Id") {
        $("#name").html(dataID);
        $("#confidence").html(confidenceId + "%");
        myChart.data.datasets[0].data = [confidenceId, totalData];
        audioElement.src = staticPath + "audios/Id/" + dataID + ".mp3";
        audioElementAnimal.src = staticPath + "audios/Id/animalSound/" + dataID + ".mp3";
        animalVideo.src = staticPath + "videos/Id/" + dataID + ".mp4";
        console.log("looo : " + dataID);
      } else {
        $("#name").html(dataEN);
        $("#confidence").html(confidenceEn + "%");
        myChart.data.datasets[0].data = [confidenceEn, totalDataEn];
        audioElement.src = staticPath + "audios/En/" + dataEN + ".mp3";
        audioElementAnimal.src = staticPath + "audios/En/animalSound/" + dataEN + ".mp3";
        animalVideo.src = staticPath + "videos/En/" + dataEN + ".mp4";
      }
  
      const audioSrc = language === "Id"
        ? staticPath + "audios/Id/" + dataID + ".mp3"
        : staticPath + "audios/En/" + dataEN + ".mp3";
      const animalAudioSrc = language === "Id"
        ? staticPath + "audios/Id/animalSound/" + dataID + ".mp3"
        : staticPath + "audios/En/animalSound/" + dataEN + ".mp3";
  
      audioElement.src = audioSrc;
      audioElementAnimal.src = animalAudioSrc;
  
      try {
        const response = await fetch(animalAudioSrc);
        if (!response.ok) {
          $("#audio-player").css("display", "none");
          $("#noSound").css("display", "block");
        } else {
          $("#audio-player").css("display", "flex");
          $("#noSound").css("display", "none");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
  
      console.log("dataID:", dataID, "dataEN:", dataEN); // Debugging
  
      // Tampilkan elemen UI setelah capture
      $("#nolPersen").css("display", "none");
      $("#confidence").css("display", "flex");
      $("#accuracyChart").css("display", "block");
      $("#animalVideo").css("display", "block");
      if (predictionIdBox) {
        animalVideoContainer.style.display = "flex";
      }
      myChart.update();
    } catch (error) {
      console.error("Snapshot error:", error);
    } finally {
      // Aktifkan kembali btnReset setelah pemrosesan selesai
      btnReset.style.pointerEvents = "auto";
      btnReset.style.opacity = "1";
    }
  
    // Hentikan stream kamera
    const stream = video.srcObject;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }



function resetSnapshot() {
    dataID = "";
    dataEN = "";
    videoContainer.innerHTML = `
        <video style="height: 400px; width: 600px; border-radius: 20px;" autoplay="true" id="video-webcam" autoplay muted playsinline>
            Browser tidak mendukung, silahkan update!!
        </video>
        <img style="height: 80px; width: 80px; position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); z-index: 3;"
            src="${staticPath}img/ic_capture.png" alt="" id="take-picture-button" onclick="takeSnapshot()" />
    `;
    video = document.querySelector("#video-webcam");
    // Coba akses kamera lagi setelah reset
    startCamera();
    $("#nolPersen").css("display", "flex");
    $("#confidence").css("display", "none");
    $("#accuracyChart").css("display", "none");
    $("#animalVideo").css("display", "none");
    $("#audio-player").css("display", "flex");
    $("#noSound").css("display", "none");
    myChart.data.datasets[0].data = [0, 100];
    myChart.update();
    animalVideo.src = "";
    predictionIdBox.style.display = "none";
    animalVideoContainer.style.display = "none";
    $("#name").html("Loading...");
    audioElement.src = "";
    audioElementAnimal.src = "";
    btnUpload.style.pointerEvents = "auto";
    btnUpload.style.opacity = "1";
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/png" });
}
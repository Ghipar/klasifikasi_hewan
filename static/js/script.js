var video = document.getElementById("video-webcam");
var capture = document.getElementById("take-picture-button");

// video.addEventListener("timeupdate", function () {  
//     var videoPosition = video.currentTime / video.duration;

//      // Mendapatkan lebar dan tinggi container
//      var containerWidth = video.clientWidth;
//      var containerHeight = video.clientHeight;

//      // Menghitung posisi gambar berdasarkan posisi video
//      var captureLeft = containerWidth * videoPosition - capture.clientWidth / 2;
//      var captureTop = containerHeight / 2 - capture.clientHeight / 2;

//      capture.style.left = captureLeft + 'px';
//      capture.style.top = captureTop + 'px';
// })
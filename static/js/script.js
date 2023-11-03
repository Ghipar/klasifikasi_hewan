
var video = document.querySelector("#video-webcam");
var fileInput = document.querySelector("#file-input");
var takePictureButton = document.querySelector("#take-picture-button");

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia;

if (navigator.getUserMedia) {
    navigator.getUserMedia({ video: true }, handleVideo, videoError);
}

function handleVideo(stream) {
    video.srcObject = stream;
}

function videoError(e) {
    alert("Izinkan menggunakan webcam untuk demo!");
}

function loadImage() {
    var file = fileInput.files[0];
    if (file) {
        var img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        var videoContainer = document.getElementById("video-container");
        videoContainer.innerHTML = "";
        videoContainer.appendChild(img);

        // Move the "Take Picture" button back inside the container
        // videoContainer.appendChild(takePictureButton);
    }
}

function takeSnapshot() {
    if (!video) {
        console.error("Video element not found.");
        return;
    }

    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");

    var width = video.offsetWidth;
    var height = video.offsetHeight;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);

    var img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");

    var videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";
    videoContainer.appendChild(img);

    // Move the "Take Picture" button back inside the container
    // videoContainer.appendChild(takePictureButton);
}

function resetSnapshot() {
    var videoContainer = document.getElementById("video-container");
    videoContainer.innerHTML = "";
    videoContainer.innerHTML =
        '<video autoplay="true" id="video-webcam">Browsermu tidak mendukung bro, upgrade donk!</video>';
    video = document.querySelector("#video-webcam");

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ video: true }, handleVideo, videoError);
    }

    // Move the "Take Picture" button back inside the container
    videoContainer.appendChild(takePictureButton);
}
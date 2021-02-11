
// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/JIbbcrURR/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

function resultShow() {
  $('.result-messege').fadeIn(700);
  $('.result-messege-image').fadeIn(700);

}


function endloading() {
  $('.loadDot').fadeOut();

  setTimeout(resultShow, 400);

}






// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  let image = document.getElementById("face-image");
  const prediction = await model.predict(image, false);
  prediction.sort(function (a, b) {
    return parseFloat(b.probability) - parseFloat(a.probability);
  });

  $(prediction).load(endloading());

  switch (prediction[0].className) {
    case "토끼상":
      resultMessege = "입체형 마스크";
      resultimg = "/img/maskill/threemask.png";
      break;
    case "찐빵상":
      resultMessege = "평면 마스크";
      resultimg = "/img/maskill/basicmask.png";
      break;
    case "고양이상":
      resultMessege = "새부리 마스크";
      resultimg = "/img/maskill/birdmask.png";
      break;
    case "입큰상":
      resultMessege = "인싸 마스크";
      resultimg = "/img/maskill/openmask.png";
      break;
    case "사막여우상":
      resultMessege = "패션 마스크";
      resultimg = "/img/maskill/fashionmask.png";
      break;
    default:
      resultMessege = "알수 없음";
      break;
  }
  $(".result-messege").html(resultMessege);
  $("#id_img").attr("src", resultimg);




}



for (let i = 0; i < maxPredictions; i++) {
  const classPrediction =
    prediction[i].className +
    ": " +
    prediction[i].probability.toFixed(2);
  labelContainer.childNodes[i].innerHTML = classPrediction;
}














function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function (e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);

    init().then(() => {
      predict();
    });

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith($('.file-upload-input').clone());
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();

  $('.loadDot').show();
  $('.result-messege').hide();
  $('.result-messege-image').hide();

}


$('.image-upload-wrap').bind('dragover', function () {
  $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
  $('.image-upload-wrap').removeClass('image-dropping');
});



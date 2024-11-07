const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatHistory = document.querySelector(".chat-history");
const imageUpload = document.getElementById("image-upload");
const languageSelect = document.getElementById("language-select");
const selectTag = document.querySelectorAll("select");

const countries = {
  "am-ET": "Amharic",
  "ar-SA": "Arabic",
  "be-BY": "Bielarus",
  "bem-ZM": "Bemba",
  "bi-VU": "Bislama",
  "bjs-BB": "Bajan",
  "bn-IN": "Bengali",
  "bo-CN": "Tibetan",
  "br-FR": "Breton",
  "bs-BA": "Bosnian",
  "ca-ES": "Catalan",
  "cop-EG": "Coptic",
  "cs-CZ": "Czech",
  "cy-GB": "Welsh",
  "da-DK": "Danish",
  "dz-BT": "Dzongkha",
  "de-DE": "German",
  "dv-MV": "Maldivian",
  "el-GR": "Greek",
  "en-GB": "English",
  "es-ES": "Spanish",
  "et-EE": "Estonian",
  "eu-ES": "Basque",
  "fa-IR": "Persian",
  "fi-FI": "Finnish",
  "fn-FNG": "Fanagalo",
  "fo-FO": "Faroese",
  "fr-FR": "French",
  "gl-ES": "Galician",
  "gu-IN": "Gujarati",
  "ha-NE": "Hausa",
  "he-IL": "Hebrew",
  "hi-IN": "Hindi",
  "hr-HR": "Croatian",
  "hu-HU": "Hungarian",
  "id-ID": "Indonesian",
  "is-IS": "Icelandic",
  "it-IT": "Italian",
  "ja-JP": "Japanese",
  "kk-KZ": "Kazakh",
  "km-KM": "Khmer",
  "kn-IN": "Kannada",
  "ko-KR": "Korean",
  "ku-TR": "Kurdish",
  "ky-KG": "Kyrgyz",
  "la-VA": "Latin",
  "lo-LA": "Lao",
  "lv-LV": "Latvian",
  "men-SL": "Mende",
  "mg-MG": "Malagasy",
  "mi-NZ": "Maori",
  "ms-MY": "Malay",
  "mt-MT": "Maltese",
  "my-MM": "Burmese",
  "ne-NP": "Nepali",
  "niu-NU": "Niuean",
  "nl-NL": "Dutch",
  "no-NO": "Norwegian",
  "ny-MW": "Nyanja",
  "ur-PK": "Pakistani",
  "pau-PW": "Palauan",
  "pa-IN": "Panjabi",
  "ps-PK": "Pashto",
  "pis-SB": "Pijin",
  "pl-PL": "Polish",
  "pt-PT": "Portuguese",
  "rn-BI": "Kirundi",
  "ro-RO": "Romanian",
  "ru-RU": "Russian",
  "sg-CF": "Sango",
  "si-LK": "Sinhala",
  "sk-SK": "Slovak",
  "sm-WS": "Samoan",
  "sn-ZW": "Shona",
  "so-SO": "Somali",
  "sq-AL": "Albanian",
  "sr-RS": "Serbian",
  "sv-SE": "Swedish",
  "sw-SZ": "Swahili",
  "ta-LK": "Tamil",
  "te-IN": "Telugu",
  "tet-TL": "Tetum",
  "tg-TJ": "Tajik",
  "th-TH": "Thai",
  "ti-TI": "Tigrinya",
  "tk-TM": "Turkmen",
  "tl-PH": "Tagalog",
  "tn-BW": "Tswana",
  "to-TO": "Tongan",
  "tr-TR": "Turkish",
  "uk-UA": "Ukrainian",
  "uz-UZ": "Uzbek",
  "vi-VN": "Vietnamese",
  "wo-SN": "Wolof",
  "xh-ZA": "Xhosa",
  "yi-YD": "Yiddish",
  "zu-ZA": "Zulu",
};

selectTag.forEach((tag, id) => {
  for (let country_code in countries) {
    let selected =
      id == 0
        ? country_code == "en-GB"
          ? "selected"
          : ""
        : country_code == "hi-IN"
        ? "selected"
        : "";
    let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

sendButton.addEventListener("click", sendMessage);
messageInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// imageUpload.addEventListener("change", handleImageUpload);

const URL = "https://teachablemachine.withgoogle.com/models/F5LBGsQm8/";

let model, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function loadModel() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
}

// Handle image upload from user's computer
async function handleImageUpload(event) {
  handleImage();
  if (!model) {
    await loadModel();
  }

  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    const imgElement = document.createElement("img");
    imgElement.src = event.target.result;
    imgElement.onload = () => predict(imgElement);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

// Run the image (from webcam or file) through the image model
async function predict(inputElement) {
  const prediction = await model.predict(inputElement);
  let maxPrediction = prediction[0];

  // Find the prediction with the highest probability
  for (let i = 1; i < maxPredictions; i++) {
    if (prediction[i].probability > maxPrediction.probability) {
      maxPrediction = prediction[i];
    }
  }
  console.log(`Disease: ${maxPrediction.className}`);
  // Display only the max probability prediction
  let dis_data = `Disease: ${maxPrediction.className}`;

  // const apiResponseMessage = document.createElement("div");
  // apiResponseMessage.classList.add("chat-message", "ai-message");
  // apiResponseMessage.textContent = `${dis_data}`;
  // chatHistory.appendChild(apiResponseMessage);
  // chatHistory.scrollTop = chatHistory.scrollHeight;

  elab_disease(dis_data);
}

function elab_disease(message) {
  // Simulate AI response (replace with actual backend functionality)
  setTimeout(() => {
    const aiMessage = document.createElement("div");
    aiMessage.classList.add("chat-message", "ai-message");
    fetch("/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    })
      .then((response) => response.json())
      .then((data) => {
        aiMessage.innerHTML = `${data}`;
        console.log(data);
      });

    chatHistory.appendChild(aiMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
  }, 1000);
}

function sendMessage() {
  const message = messageInput.value.trim();
  if (message !== "") {
    // Display user message
    const userMessage = document.createElement("div");
    userMessage.classList.add("chat-message", "user-message");
    userMessage.textContent = message;
    chatHistory.appendChild(userMessage);

    // Simulate AI response (replace with actual backend functionality)
    setTimeout(() => {
      const aiMessage = document.createElement("div");
      aiMessage.classList.add("chat-message", "ai-message");
      fetch("/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: message }),
      })
        .then((response) => response.json())
        .then((data) => {
          // if (languageSelect.value != "en-GB") {
          //   data = LanguageTranslator(data, "en-GB", languageSelect.value);
          // }
          aiMessage.innerHTML = `${data}`;
          console.log(data);
        });

      chatHistory.appendChild(aiMessage);
      chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to bottom
    }, 1000);

    messageInput.value = ""; // Clear input field
  }
}

function handleImage() {
  const file = imageUpload.files[0];

  if (file) {
    const reader = new FileReader();

    const file = imageUpload.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      fetch("/detect", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    reader.onload = function (e) {
      const imgWrapper = document.createElement("div");
      imgWrapper.classList.add("img-wrapper");

      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "50%";

      imgWrapper.appendChild(img);

      const userMessage = document.createElement("div");
      userMessage.classList.add("chat-message", "user-message");
      userMessage.appendChild(imgWrapper);

      chatHistory.appendChild(userMessage);

      chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    reader.readAsDataURL(file);
  }
}

// exchageIcon.addEventListener("click", () => {
//   let tempText = fromText.value,
//     tempLang = selectTag[0].value;
//   fromText.value = toText.value;
//   toText.value = tempText;
//   selectTag[0].value = selectTag[1].value;
//   selectTag[1].value = tempLang;
// });

// fromText.addEventListener("keyup", () => {
//   if (!fromText.value) {
//     toText.value = "";
//   }
// });

// translateBtn.addEventListener("click", () => {
//   let text = fromText.value.trim(),
//     translateFrom = selectTag[0].value,
//     translateTo = selectTag[1].value;
//   if (!text) return;
//   toText.setAttribute("placeholder", "Translating...");
//   let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
//   fetch(apiUrl)
//     .then((res) => res.json())
//     .then((data) => {
//       toText.value = data.responseData.translatedText;
//       data.matches.forEach((data) => {
//         if (data.id === 0) {
//           toText.value = data.translation;
//         }
//       });
//       toText.setAttribute("placeholder", "Translation");
//     });
// });

// icons.forEach((icon) => {
//   icon.addEventListener("click", ({ target }) => {
//     if (!fromText.value || !toText.value) return;
//     if (target.classList.contains("fa-copy")) {
//       if (target.id == "from") {
//         navigator.clipboard.writeText(fromText.value);
//       } else {
//         navigator.clipboard.writeText(toText.value);
//       }
//     } else {
//       let utterance;
//       if (target.id == "from") {
//         utterance = new SpeechSynthesisUtterance(fromText.value);
//         utterance.lang = selectTag[0].value;
//       } else {
//         utterance = new SpeechSynthesisUtterance(toText.value);
//         utterance.lang = selectTag[1].value;
//       }
//       speechSynthesis.speak(utterance);
//     }
//   });
// });

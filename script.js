class Tokenizer {
  constructor() {
    this.tokenToId = {};
    this.idToToken = {};
    this.nextId = 0;
    this.specialTokens = {
      "<unk>": 0, // Unknown token
      "<pad>": 1, // Padding token
      "<cls>": 2, // Classification token (start of sentence)
      "<sep>": 3, // Separator token
    };
  }

  initSpecialTokens() {
    this.tokenToId = {};
    this.idToToken = {};
    for (const [token, id] of Object.entries(this.specialTokens)) {
      this.tokenToId[token] = id;
      this.idToToken[id] = token;
    }
    this.nextId = Object.keys(this.specialTokens).length;
  }

  train(textCorpus) {
    this.initSpecialTokens();
    const tokens = textCorpus.toLowerCase().match(/(\w+|[^\s\w])/g) || [];
    const tokenCounts = {};
    tokens.forEach((token) => {
      tokenCounts[token] = (tokenCounts[token] || 0) + 1;
    });
    const sortedTokens = Object.keys(tokenCounts).sort(
      (a, b) => tokenCounts[b] - tokenCounts[a]
    );
    sortedTokens.forEach((token) => {
      if (!this.tokenToId.hasOwnProperty(token)) {
        this.tokenToId[token] = this.nextId;
        this.idToToken[this.nextId] = token;
        this.nextId++;
      }
    });
  }

  encode(text) {
    if (Object.keys(this.tokenToId).length === 0) {
      throw new Error(
        "Tokenizer has not been trained yet. Please call train() first."
      );
    }
    const tokens = text.toLowerCase().match(/(\w+|[^\s\w])/g) || [];
    const encodedIds = tokens.map((token) => {
      return this.tokenToId[token] !== undefined
        ? this.tokenToId[token]
        : this.specialTokens["<unk>"];
    });
    return encodedIds;
  }

  decode(ids) {
    if (Object.keys(this.idToToken).length === 0) {
      throw new Error(
        "Tokenizer has not been trained yet. Please call train() first."
      );
    }
    const decodedTokens = ids.map((id) => {
      return this.idToToken[id] !== undefined
        ? this.idToToken[id]
        : `[UNKNOWN ID:${id}]`;
    });
    let result = "";
    decodedTokens.forEach((token, index) => {
      if (
        index > 0 &&
        token.match(/\w/) &&
        decodedTokens[index - 1].match(/\w/)
      ) {
        result += " ";
      }
      result += token;
    });
    return result.replace(/\s+/g, " ").trim();
  }
}

const tokenizer = new Tokenizer();
let isTrained = false;

const corpusTextarea = document.getElementById("corpusTextarea");
const encodeTextarea = document.getElementById("encodeTextarea");
const decodeTextarea = document.getElementById("decodeTextarea");
const trainButton = document.getElementById("trainButton");
const encodeButton = document.getElementById("encodeButton");
const decodeButton = document.getElementById("decodeButton");
const trainingStatus = document.getElementById("trainingStatus");
const encodedOutput = document.getElementById("encodedOutput");
const decodedOutput = document.getElementById("decodedOutput");
const vocabOutput = document.getElementById("vocabOutput");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanes = document.querySelectorAll(".tab-pane");

// Initial state: Set the first tab as active
document
  .querySelector('.tab-button[data-tab="train"]')
  .classList.add("border-b-2", "border-indigo-600");
document.getElementById("train").classList.add("active");
document.getElementById("train").classList.remove("hidden");

// Add event listeners for tab switching
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const tabId = button.dataset.tab;

    // Remove active classes from all buttons and panes
    tabButtons.forEach((btn) =>
      btn.classList.remove("border-b-2", "border-indigo-600")
    );
    tabPanes.forEach((pane) => pane.classList.add("hidden"));

    // Add active classes to the clicked button and corresponding pane
    button.classList.add("border-b-2", "border-indigo-600");
    document.getElementById(tabId).classList.remove("hidden");
    document.getElementById(tabId).classList.add("active");

    // If switching to the Vocabulary tab, refresh the display
    if (tabId === "vocab" && isTrained) {
      displayVocabulary();
    } else if (tabId === "vocab" && !isTrained) {
      vocabOutput.innerHTML =
        '<p class="text-gray-500 p-4">Train the tokenizer to see the vocabulary here.</p>';
    }
  });
});

function trainTokenizer() {
  const corpus = corpusTextarea.value.trim();
  if (corpus.length === 0) {
    showStatus(
      trainingStatus,
      "Please enter text to train the tokenizer.",
      "info"
    );
    return;
  }

  trainButton.innerHTML =
    '<span class="loading-spinner"></span><span class="ml-2">Training...</span>';
  trainButton.disabled = true;

  setTimeout(() => {
    try {
      tokenizer.train(corpus);
      isTrained = true;
      showStatus(
        trainingStatus,
        `Tokenizer successfully trained! Vocabulary size: ${
          Object.keys(tokenizer.tokenToId).length
        }`,
        "success"
      );
    } catch (error) {
      showStatus(
        trainingStatus,
        `Error training tokenizer: ${error.message}`,
        "error"
      );
    } finally {
      trainButton.innerHTML = "Train Tokenizer";
      trainButton.disabled = false;
    }
  }, 500);
}

function encodeText() {
  if (!isTrained) {
    showStatus(
      encodedOutput,
      "Error: Please train the tokenizer first.",
      "error"
    );
    return;
  }

  const text = encodeTextarea.value.trim();
  if (text.length === 0) {
    showStatus(encodedOutput, "Please enter text to encode.", "info");
    return;
  }

  encodeButton.innerHTML =
    '<span class="loading-spinner"></span><span class="ml-2">Encoding...</span>';
  encodeButton.disabled = true;

  setTimeout(() => {
    try {
      const encodedIds = tokenizer.encode(text);
      const outputHtml = `<strong>Encoded IDs:</strong><br/>[${encodedIds.join(
        ", "
      )}]`;
      showStatus(encodedOutput, outputHtml, "success");
      decodeTextarea.value = encodedIds.join(", ");
    } catch (error) {
      showStatus(
        encodedOutput,
        `Error encoding text: ${error.message}`,
        "error"
      );
    } finally {
      encodeButton.innerHTML = "Encode";
      encodeButton.disabled = false;
    }
  }, 300);
}

function decodeTokens() {
  if (!isTrained) {
    showStatus(
      decodedOutput,
      "Error: Please train the tokenizer first.",
      "error"
    );
    return;
  }

  const idsString = decodeTextarea.value.trim();
  if (idsString.length === 0) {
    showStatus(decodedOutput, "Please enter token IDs to decode.", "info");
    return;
  }

  decodeButton.innerHTML =
    '<span class="loading-spinner"></span><span class="ml-2">Decoding...';
  decodeButton.disabled = true;

  setTimeout(() => {
    try {
      const ids = idsString.split(",").map((id) => parseInt(id.trim(), 10));
      const decodedText = tokenizer.decode(ids);
      const outputHtml = `<strong>Decoded Text:</strong><br/>${decodedText}`;
      showStatus(decodedOutput, outputHtml, "success");
    } catch (error) {
      showStatus(
        decodedOutput,
        `Error decoding tokens: ${error.message}`,
        "error"
      );
    } finally {
      decodeButton.innerHTML = "Decode";
      decodeButton.disabled = false;
    }
  }, 300);
}

function displayVocabulary() {
  let vocabHtml =
    '<p class="font-semibold text-gray-700 mb-2">Vocabulary Mappings:</p>';
  vocabHtml +=
    '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">';
  const sortedVocab = Object.entries(tokenizer.tokenToId).sort(
    ([, a], [, b]) => a - b
  );
  sortedVocab.forEach(([token, id]) => {
    vocabHtml += `<div class="bg-white p-2 rounded-md shadow-sm border border-gray-100 flex justify-between">
                                <span class="text-indigo-600 font-mono">${token}</span>
                                <span class="text-gray-500 font-semibold">${id}</span>
                              </div>`;
  });
  vocabHtml += "</div>";
  vocabOutput.innerHTML = vocabHtml;
}

function showStatus(element, message, type) {
  element.innerHTML = message;
  element.classList.remove(
    "hidden",
    "bg-red-100",
    "text-red-800",
    "bg-green-100",
    "text-green-800",
    "bg-blue-100",
    "text-blue-800"
  );
  if (type === "success") {
    element.classList.add("bg-green-100", "text-green-800");
  } else if (type === "error") {
    element.classList.add("bg-red-100", "text-red-800");
  } else {
    element.classList.add("bg-blue-100", "text-blue-800");
  }
  element.classList.remove("hidden");
}

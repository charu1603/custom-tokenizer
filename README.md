# Custom JavaScript Tokenizer

This project is a simple, yet powerful, custom tokenizer built in vanilla JavaScript. It's designed to be a self-contained, single-file solution that you can use as a foundation for a larger natural language processing (NLP) project or a learning tool. The tokenizer learns a vocabulary from a given text corpus and provides functionality to encode text into token IDs and decode token IDs back into text. It also supports special tokens, which are essential for many modern language models.

## Features

-   **Vocabulary Learning:** The `train()` method analyzes an input text corpus and builds a vocabulary of unique words, punctuation, and special tokens.
-   **Encoding:** The `encode()` method converts a given string into an array of numerical token IDs based on the learned vocabulary.
-   **Decoding:** The `decode()` method performs the reverse operation, converting an array of token IDs back into a human-readable string.
-   **Performance:** A simple frequency-based approach makes training and encoding/decoding fast for smaller to medium-sized texts.
-   **Self-Contained:** The entire project, including the UI and logic, is contained in a single HTML file, making it easy to set up and run.


## Usage

The web-based demo provides an interactive way to test the tokenizer.

1.  **Input Text:** Paste or type a large block of text into the "Text Corpus" textarea. This will be used to train the tokenizer's vocabulary.
2.  **Train Tokenizer:** Click the "Train Tokenizer" button. The tokenizer will process the text, build a vocabulary, and display the vocabulary size and the mappings.
3.  **Encode Text:** Enter a new sentence or phrase into the "Text to Encode" textarea.
4.  **Encode:** Click the "Encode" button. The tokens and their corresponding IDs will be displayed.
5.  **Decode Tokens:** The encoded tokens from the previous step will automatically appear in the "Token IDs to Decode" textarea. You can edit this list if you wish.
6.  **Decode:** Click the "Decode" button. The original text will be reconstructed from the token IDs.

## Code Quality and Documentation

-   The code is written in a clear, modular fashion using a `Tokenizer` class.
-   Each method is thoroughly commented to explain its purpose, parameters, and return values.
-   Error handling is included to gracefully handle cases like an untrained tokenizer or unknown tokens.

**Screenshot 1: Initial View**


**Screenshot 2: After Training**


**Screenshot 3: Encoding and Decoding**


- [Chrome APIs](https://developer.chrome.com/docs/extensions/reference/api)

# 📘 `manifest.json` Key Explanations – Chrome Extension

This document explains the purpose of common keys in a Chrome extension's `manifest.json` file (Manifest V3).

---

## 🔹 `manifest_version`
- **Type**: Integer
- **Purpose**: Specifies the version of the manifest file format. Chrome requires version **3** for all new extensions.

---

## 🔹 `name`
- **Type**: String
- **Purpose**: The name of your extension, shown in Chrome Web Store and Extensions page.

---

## 🔹 `version`
- **Type**: String
- **Purpose**: The version of your extension. Use semantic versioning like `"1.0"`.

---

## 🔹 `description`
- **Type**: String
- **Purpose**: Short description of what your extension does.

---

## 🔹 `action`
- **Purpose**: Defines the behavior of the toolbar button (extension icon).
- **Common fields**:
  - `default_popup`: HTML file shown when the icon is clicked.
  - `default_icon`: Icons in various sizes.
  - `default_title`: Tooltip shown on hover.

---

## 🔹 `permissions`
- **Purpose**: Declares access to Chrome APIs (e.g., `tabs`, `storage`, `activeTab`).
- **Examples**:
  - `"activeTab"`: Temporarily interact with the active tab.
  - `"storage"`: Use `chrome.storage` API for saving settings.

---

## 🔹 `host_permissions`
- **Purpose**: Specifies which websites your extension can interact with.
- **Example**: 
  - `"<all_urls>"`: All sites.
  - `"https://*.example.com/*"`: Specific domain.

---

## 🔹 `content_scripts`
- **Purpose**: Automatically inject scripts into web pages.
- **Common fields**:
  - `matches`: List of URLs where the script runs.
  - `js`: JavaScript files to inject.
  - `css`: Optional styles to inject.

---

## 🔹 `background`
- **Purpose**: Specifies a background script or service worker to run persistent logic.
- **Manifest V3 Example**:
  ```json
  "background": {
    "service_worker": "background.js"
  }
  ```

---

## 🔹 `options_page`
- **Purpose**: Declares a settings page users can open from the extension menu.
- **Value**: Path to `options.html`.

---

## 🔹 `icons`
- **Purpose**: Defines icons used by the extension.
- **Example**:
  ```json
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
  ```

---

## 📝 Notes
- Chrome prompts users based on your `permissions` and `host_permissions`.
- Use only the permissions you truly need (principle of least privilege).


# 🧠 How to Use Google Gemini API with Fetch

This guide explains how to integrate Google Gemini API in a frontend project (like a Chrome extension) using `fetch()`.

---

## 🔑 1. Get Your Gemini API Key

1. Visit [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Copy your API key
3. Store it securely (e.g., using `chrome.storage.sync` in Chrome extensions)

---

## 🔗 2. API Endpoint

```text
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY
```

---

## 🧾 3. Basic Fetch Request

```js
const API_KEY = "your_gemini_api_key";
const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + API_KEY;

const data = {
  contents: [
    {
      parts: [
        { text: "Summarize this article about AI..." }
      ]
    }
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 256
  }
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
})
  .then((response) => response.json())
  .then((result) => console.log("Gemini result:", result))
  .catch((error) => console.error("Error:", error));
```

---

## ⚙️ 4. generationConfig Parameters

| Parameter           | Description                                                   | Recommended |
|---------------------|---------------------------------------------------------------|-------------|
| `temperature`       | Controls randomness (0 = deterministic, 1 = creative)         | `0.5–0.9`   |
| `maxOutputTokens`   | Max tokens in output (like length)                            | `256–1024`  |
| `topP`              | Limits diversity (alternative to temperature)                 | `1.0`       |
| `topK`              | Chooses from top K next tokens                                | `40`        |
| `stopSequences`     | Array of strings to stop generation when encountered          | `[]`        |

---

## 📦 5. Storing the API Key in Chrome Extension

```js
// Save key
chrome.storage.sync.set({ geminiApiKey: "your_key_here" });

// Retrieve key
chrome.storage.sync.get(["geminiApiKey"], (result) => {
  const key = result.geminiApiKey;
  // use in fetch call
});
```

---

## 🆓 6. Free Tier Limits (as of 2025)

| Model               | Requests/Minute | Requests/Day | Tokens/Minute | Pricing |
|---------------------|------------------|---------------|----------------|---------|
| **Gemini 1.5 Flash**| 15               | 1,500         | 1,000,000      | Free    |
| **Gemini 1.5 Pro**  | 2                | 50            | 32,000         | Free    |

🔗 [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)

---

## ✅ Tips

- Use `temperature: 0.2–0.5` for summaries (less randomness).
- Use `temperature: 0.8–1.0` for creative content.
- Always handle errors from the API gracefully.
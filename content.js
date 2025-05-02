function getArticleText() {
    const article = document.querySelector("article");
    if (article) return article.innerText;

    // if no article tag
    const paragraphs = Array.from(document.querySelectorAll("p"));
    const paraContent = paragraphs.map((p) => p.innerText).join("\n");
    return paraContent;
}

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.type === "GET_ARTICLE_TEXT") {
        const text = getArticleText();
        sendResponse({ text: text });
    }
});
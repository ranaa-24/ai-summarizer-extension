const response = document.getElementById('response');
const copy = document.getElementById('copy-btn');


document.getElementById('btn').onclick = () => {
    const summaryType = document.getElementById("summary-type").value;

    //Loader
    response.innerHTML = '<div class="loading"><div class="loader"></div></div>';

    // get the key
    chrome.storage.sync.get(['geminiApiKey'], ({ geminiApiKey }) => {
        if (!geminiApiKey) {
            response.innerText = '❗No API Key found. Click the puzzle piece icon 🔧 in your browser toolbar, then click the three dots ⋮ next to "QuickSummary" and choose Options to set your Gemini API key.';

            return;
        }

        //scrape the pege
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
            chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async (result) => {
                if (chrome.runtime.lastError) {
                    response.innerText = "Error: Could not connect to the page, Try Reload";
                    return;
                }

                if (!result.text) {
                    response.innerText = "Could not Extract the text from this page."
                    return;
                }

                try {
                    const summary = await getAiSummary(result.text, summaryType, geminiApiKey);
                    response.innerText = summary;
                } catch (error) {
                    response.innerText = `API Error : ${error.message}`;
                }

            })
        })

    })
}

async function getAiSummary(rawData, summaryType, geminiApiKey) {
    const max = 25000;
    const pageContent = rawData.length > max ? rawData.slice(0, max) + "..." : rawData;

    const promptType = {
        brife: `Summarize in 2 to 3 sentences \n\n ${pageContent}`,
        detailed: `Generate a detailed summary with all the importent topics \n\n ${pageContent}`,
        bullets: `Summarize in 6-7 Bullet points of important notes (start each line with "-> ") \n\n ${pageContent}`
    }

    const prompt = promptType[summaryType] || promptType["brife"];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`

    const res = await fetch(url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.2 }
            })
        }
    )

    if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error?.message || "Request Failed");
    }

    const data = await res.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No summary available. Please check your input or API key.";  // scroll
}

// Gemini API Response Looks like - 
// {
//     "candidates": [
//       {
//         "content": {
//           "parts": [
//             { "text": "Here is the summary of the article..." }
//           ]
//         },
//         "finishReason": "STOP",
//         "index": 0,
//         "safetyRatings": [ /* optional safety data */ ]
//       }
//     ],
//     "promptFeedback": {
//       "blockReason": null
//     }
//   }



copy.onclick = () => {
    const txt = response.innerText;
    if (!txt) return;

    navigator.clipboard.writeText(txt).then(() => {
        let prevText = copy.innerText;
        copy.innerText = "Copied!"
        setTimeout(() => {
            copy.innerText = prevText;
        }, 2000);
    })
}
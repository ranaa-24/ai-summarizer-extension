const input = document.getElementById('apiKey');
const save = document.getElementById('saveBtn');

// if the api key already been set, triggering the callback when DOM loads 
document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {
        if (geminiApiKey) input.value = geminiApiKey;
    })

    save.addEventListener('click', () => {
        const apiKey = input.value.trim();
        if(!apiKey)return;

        // saving the api key in chrome acc storage
        chrome.storage.sync.set({geminiApiKey : apiKey}, () => {
            alert("API Key Saved Successfully!");
            window.close();
        })
    })

    input.addEventListener('keypress', (e) => {
        if(e.key == "Enter") save.click();
    })
});



let lastText= "";
document.addEventListener("mouseup", () =>{
    const selectedText = window.getSelection().toString().trim();

    if(selectedText && selectedText !== lastText) {
        lastText = selectedText;
        chrome.storage.local.set({
            selectedText: selectedText,
            pageTitle: document.title
        });
    }
})
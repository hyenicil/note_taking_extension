document.addEventListener("DOMContentLoaded", () => {
    const areaSelect = document.getElementById("contentAreaSelect");
    const newAreaInput = document.getElementById("newArea");
    const addAreaBtn = document.getElementById("addHeaderAreaBtn");
    const addBtn = document.getElementById("addBtn");
    const headerInput = document.getElementById("contentAreaHeader");
    const contentsInput = document.getElementById("contents");
    const noteList = document.getElementById("noteList");

    let notes = JSON.parse(localStorage.getItem("notes") || "{}");

    if (Object.keys(notes).length === 0) {
        notes["Genel"] = [];
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadAreas() {
        areaSelect.innerHTML = '<option value="">--Konu Seçin--</option>';
        Object.keys(notes).forEach(area => {
            const option = document.createElement("option");
            option.value = area;
            option.textContent = area;
            areaSelect.appendChild(option);
        });
    }

    function listing() {
        noteList.innerHTML = "";
        const selected = areaSelect.value;
        if (!notes[selected]) return;

        notes[selected].forEach((not, index) => {
            const li = document.createElement("li");
            li.dataset.index = index; // ✅ data-index ekle
            li.innerHTML = `
                <div class="note-topic">${selected}</div>
                <div class="note-title">${not.header}</div>
                <div class="note-body">${not.contents}</div>
                <button class="note-delete">Sil</button>
                <button class="note-download">İndir</button>
            `;
            noteList.appendChild(li);
        });
    }

    // ✅ Event delegation kullan
    noteList.addEventListener("click", (e) => {
        const selected = areaSelect.value;
        if (!notes[selected]) return;

        const li = e.target.closest("li");
        if (!li) return;

        const index = parseInt(li.dataset.index);

        if (e.target.classList.contains("note-delete")) {
            e.stopPropagation(); // bubble engelle
            notes[selected].splice(index, 1);
            localStorage.setItem("notes", JSON.stringify(notes));
            listing();
        }

        if (e.target.classList.contains("note-download")) {
            e.stopPropagation(); // bubble engelle
            const not = notes[selected][index];
            downloadPDF(not.header, not.contents);
        }
    });

    addBtn.addEventListener("click", () => {
        const header = headerInput.value.trim();
        const contents = contentsInput.value.trim();
        const selected = areaSelect.value;

        if (!selected) {
            alert("Lütfen konu seçin");
            return;
        }

        if (!header || !contents) {
            alert("Başlık ve içerik boş olamaz.");
            return;
        }

        notes[selected].push({ header, contents });
        localStorage.setItem("notes", JSON.stringify(notes));

        listing();

        headerInput.value = "";
        contentsInput.value = "";
    });

    addAreaBtn.addEventListener("click", () => {
        const area = newAreaInput.value.trim();
        if (!area) return;

        if (!notes[area]) {
            notes[area] = [];
            localStorage.setItem("notes", JSON.stringify(notes));
        }

        newAreaInput.value = "";
        loadAreas();
    });

    chrome.storage.local.get("selectedText", (data) => {
        if (data.selectedText) {
            contentsInput.value = data.selectedText;
        }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === "local") {
            if (changes.selectedText) {
                contentsInput.value = changes.selectedText.newValue;
            }
            if (changes.pageTitle) {
                headerInput.value = changes.pageTitle.newValue;
            }
        }
    });

    function downloadPDF(header, contents) {
        const { jsPDF } = window.jspdf; // ⚡ UMD modülü doğru kullan
        const doc = new jsPDF();

        doc.text(header, 10, 20);
        const lines = doc.splitTextToSize(contents, 180);
        doc.text(lines, 10, 30);
        doc.save(header + ".pdf");
    }

    areaSelect.addEventListener("change", listing);
    loadAreas();
    listing();
});
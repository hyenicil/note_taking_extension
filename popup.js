document.addEventListener("DOMContentLoaded", ()=>{
    const areaSelect = document.getElementById("contentAreaSelect");
    const newAreaInput = document.getElementById("newArea");
    const addAreaBtn = document.getElementById("addHeaderAreaBtn");
    const addBtn = document.getElementById("addBtn");
    const headerInput = document.getElementById("contentAreaHeader");
    const contentsInput = document.getElementById("contents");
    const noteList = document.getElementById("noteList");

    let notes = JSON.parse(localStorage.getItem("notes") || "{}");

    if(Object.keys(notes).length === 0) {
        notes["Genel"] = [];
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function loadAreas() {
        areaSelect.innerHTML = "";

        Object.keys(notes).forEach(
            area=> {
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

        notes[selected].forEach((not) => {
            const li = document.createElement("li");
            li.textContent = `${not.header}:${not.contents}`;
            noteList.appendChild(li);
        });
    }

    addBtn.addEventListener("click", () => {
        const header   = headerInput.value.trim();
        const contents = contentsInput.value.trim();
        const selected = areaSelect.value;

        if(!header || !contents) {
            alert("Başlık ve içerik boş olamaz.")
            return;
        }

        notes[selected].push({header, contents});
        localStorage.setItem("notes", JSON.stringify(notes));
        listing();
        headerInput.value= "";
        contentsInput.value="";
    });


    addAreaBtn.addEventListener("click", ()=> {
        const area = newAreaInput.value.trim();
        if(!area) return;

        if(!notes[area]) {
            notes[area] = [];
            localStorage.setItem("notes",JSON.stringify(notes));
        }
        newAreaInput.value = "";
        loadAreas();
    });

    areaSelect.addEventListener("change", listing);
    loadAreas();
    listing();
});
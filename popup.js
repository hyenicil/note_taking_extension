document.addEventListener("DOMContentLoaded", ()=>{
   const addBtn = document.getElementById("addBtn");
   const headerInput = document.getElementById("header");
   const contentsInput = document.getElementById("contents");
   const noteList = document.getElementById("noteList");

   let notes = JSON.parse(localStorage.getItem("notes") || "[]");

   function listing() {
       noteList.innerHTML = "";
       notes.forEach((not, index) => {
           const li = document.createElement("li");
           li.textContent = `${not.header}:${not.contents}`;
           noteList.appendChild(li);
       });
    }
    listing();

   addBtn.addEventListener("click", () => {
      const header   = headerInput.value.trim();
      const contents = contentsInput.value.trim();

      if(!header || !contents) {
          alert("Başlık ve içerik boş olamaz.")
      }

      notes.push({header, contents});
      localStorage.setItem("notes", JSON.stringify(notes));
      listing();

      headerInput.value= "";
      contentsInput.value="";
   });
});
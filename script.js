let notes =
JSON.parse(
localStorage.getItem("notes")
) || [];

let editIndex = null;

function saveStorage() {

    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );

}

function renderNotes(search="") {

    const container =
    document.getElementById(
        "notesContainer"
    );

    container.innerHTML = "";

    notes
    .filter(note =>
        note.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

        note.content
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    .forEach((note,index)=>{

        container.innerHTML += `

        <div class="note">

            <h3>${note.title}</h3>

            <p>
                ${note.date}
                ${note.time}
            </p>

            <p>${note.content}</p>

            <div class="note-actions">

                <button onclick="editNote(${index})">
                    Изменить
                </button>

                <button onclick="deleteNote(${index})">
                    Удалить
                </button>

            </div>

        </div>

        `;
    });
}

function openForm() {

    document
    .getElementById("modal")
    .classList
    .remove("hidden");

}

function closeForm() {

    document
    .getElementById("modal")
    .classList
    .add("hidden");

}

function saveNote() {

    const note = {

        title:
        document.getElementById("title").value,

        date:
        document.getElementById("date").value,

        time:
        document.getElementById("time").value,

        content:
        document.getElementById("content").value

    };

    if(editIndex !== null){

        notes[editIndex] = note;
        editIndex = null;

    }else{

        notes.push(note);

    }

    saveStorage();
    renderNotes();
    closeForm();
}

function editNote(index){

    editIndex = index;

    let note = notes[index];

    title.value = note.title;
    date.value = note.date;
    time.value = note.time;
    content.value = note.content;

    openForm();
}

function deleteNote(index){

    notes.splice(index,1);

    saveStorage();
    renderNotes();

}

function exportNotes(){

    const data =
    JSON.stringify(
        notes,
        null,
        2
    );

    const blob =
    new Blob(
        [data],
        {type:"application/json"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    link.download =
    "notes.json";

    link.click();
}
function exportHtmlReport() {

    let html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Архив заметок</title>

        <style>

            body{
                font-family: Arial, sans-serif;
                max-width: 900px;
                margin: 40px auto;
                padding: 20px;
                background: #f4f4f4;
            }

            h1{
                text-align:center;
            }

            .note{
                background:white;
                padding:20px;
                margin-bottom:20px;
                border-radius:10px;
                box-shadow:0 2px 8px rgba(0,0,0,.1);
            }

            .meta{
                color:#666;
                margin-bottom:10px;
            }

        </style>

    </head>

    <body>

    <h1>Архив заметок</h1>
    `;

    notes.forEach(note => {

        html += `

        <div class="note">

            <h2>${note.title}</h2>

            <div class="meta">

                Дата: ${note.date}<br>
                Время: ${note.time}

            </div>

            <p>${note.content}</p>

        </div>

        `;

    });

    html += `
    </body>
    </html>
    `;

    const blob = new Blob(
        [html],
        { type: "text/html" }
    );

    const link =
        document.createElement("a");

    link.href =
        URL.createObjectURL(blob);

    link.download =
        "notes-report.html";

    link.click();
}
function importNotes(event){

    const file =
    event.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = e => {

        notes =
        JSON.parse(e.target.result);

        saveStorage();
        renderNotes();
    };

    reader.readAsText(file);
}

document
.getElementById("search")
.addEventListener(
"input",
e => renderNotes(e.target.value)
);

renderNotes();
import { fetchJSONWithTimeout } from "/books/index.js";

function removeExternalBook(book_index) {
    let externalBooks = window.localStorage.getItem("externalBooks");

    if (externalBooks == null) {
        return;
    }
    externalBooks = JSON.parse(externalBooks);

    externalBooks.splice(book_index, 1);

    window.localStorage.setItem("externalBooks", JSON.stringify(externalBooks));
    reloadExternalBooksDisplay();
}

async function reloadExternalBooksDisplay() {
    let imported_books = document.getElementById("imported_books");
    let externalBooks = window.localStorage.getItem("externalBooks");
    if (externalBooks == null) {
        return;
    }
    externalBooks = JSON.parse(externalBooks);
    
    imported_books.innerHTML = "";

    await Promise.all(externalBooks.map((book_url, book_index) => fetchJSONWithTimeout(`${book_url}/summary.json`).then(book => {
        imported_books.innerHTML += `
            <div class="book" style="background: linear-gradient(135deg, ${book.primaryColor}, ${book.secondaryColor})">
                <div>
                    <div class="book_title">${book.name.medium}</div>
                    <div class="book_subtitle">${book_url}</div>
                </div>
                <div class="booktext--right">
                    <img class="ionicon" style="filter: invert(100%) sepia(9%) saturate(7497%) hue-rotate(180deg) brightness(103%) contrast(93%); width: 24px" src="/assets/wifi.svg">
                    <button><img class="ionicon" style="filter: invert(100%) sepia(9%) saturate(7497%) hue-rotate(180deg) brightness(103%) contrast(93%); width: 24px" src="/assets/close.svg"></button>
                </div>
            </div>`
    }).catch(() => {
        imported_books.innerHTML += `
            <div class="book" style="background: linear-gradient(135deg, #000000, #000000)">
                <div>
                    <div class="book_title">Unavailable</div>
                    <div class="book_subtitle">${book_url}</div>
                </div>
                <div class="booktext--right">
                    <img class="ionicon" style="filter: invert(100%) sepia(9%) saturate(7497%) hue-rotate(180deg) brightness(103%) contrast(93%); width: 24px" src="/assets/wifi.svg">
                    <button><img class="ionicon" style="filter: invert(100%) sepia(9%) saturate(7497%) hue-rotate(180deg) brightness(103%) contrast(93%); width: 24px" src="/assets/close.svg"></button>
                </div>
            </div>`
    })));
    
    for (let [button_index, button] of imported_books.getElementsByTagName("button").entries()) {
        let bound = removeExternalBook.bind(null, button_index);
        button.addEventListener("click", e => bound());
    }
}

reloadExternalBooksDisplay()

async function AddImportURL(event){
    event.preventDefault();
    let externalBooks = window.localStorage.getItem("externalBooks");
    if (externalBooks == null) {
        externalBooks = "[]";
    }
    externalBooks = JSON.parse(externalBooks);

    externalBooks.push(event.target.elements.import_url.value);

    externalBooks = [...new Set(externalBooks)];

    window.localStorage.setItem("externalBooks", JSON.stringify(externalBooks));
    reloadExternalBooksDisplay();
    return false;
}

let url_form = document.getElementById("URLForm");
url_form.addEventListener('submit', AddImportURL);

async function AddImportReference(event){
    event.preventDefault();
    let externalBooks = window.localStorage.getItem("externalBooks");
    if (externalBooks == null) {
        externalBooks = "[]";
    }
    externalBooks = JSON.parse(externalBooks);

    let known_references = {
        "ARF": "https://raw.githubusercontent.com/ACC-Hymns/acchymns-web/staging/books/ARF",
        "ARFR": "https://raw.githubusercontent.com/ACC-Hymns/acchymns-web/staging/books/ARFR",
        "PC": "https://raw.githubusercontent.com/ACC-Hymns/acchymns-web/staging/books/PC",
        "ZHJ": "https://raw.githubusercontent.com/ACC-Hymns/acchymns-web/staging/books/ZHJ"
    };

    if (event.target.elements.import_reference.value in known_references) {
        externalBooks.push(known_references[event.target.elements.import_reference.value]);
        externalBooks = [...new Set(externalBooks)];
        window.localStorage.setItem("externalBooks", JSON.stringify(externalBooks));
        reloadExternalBooksDisplay();
    }

    return false;
}

let reference_form = document.getElementById("ReferenceForm");
reference_form.addEventListener('submit', AddImportReference);


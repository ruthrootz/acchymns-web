import { filter, displaySongList } from "./search-tools.js";
import { getSongMetaData, getBookMetaData } from "../books/index.js"

const songList = document.getElementById('charactersList');
const searchBar = document.getElementById('searchBar');

let BOOK_METADATA = {};
let SONG_METADATA = {};
let songs = [];

searchBar.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        searchBar.blur();
        return;
    }
    const searchString = e.target.value.toLowerCase();
    window.history.replaceState(null, "", `search.html?q=${searchString}`);
    if(!searchString) { // No search term
        displaySongList([], songList, SONG_METADATA, BOOK_METADATA);
        return;
    }

    displaySongList(filter(songs, searchString, SONG_METADATA), songList, SONG_METADATA, BOOK_METADATA);
});

const loadSongs = async () => {
    BOOK_METADATA = await getBookMetaData();
    SONG_METADATA = await getSongMetaData();
    for (const book of Object.keys(SONG_METADATA)) {
        for (const songNum of Object.keys(SONG_METADATA[book])) {
            songs.push({
                book: book,
                song: songNum
            });
        }
    }
    const urlParams = new URLSearchParams(window.location.search);
    const searchString = urlParams.get("q");
    if (searchString == null){
        displaySongList([], songList, SONG_METADATA, BOOK_METADATA);
    } else {
        displaySongList(filter(songs, searchString, SONG_METADATA), songList, SONG_METADATA, BOOK_METADATA);
    }
};

loadSongs();
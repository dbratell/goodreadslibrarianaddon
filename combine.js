"use strict";

const search_field = document.querySelector("input[name=value]");
const radio_search = document.getElementById("filter_search");
const radio_work = document.getElementById("filter_work");
const combine_form = document.getElementById("combineForm");

function onSearchInput(event) {
    if (this.value && !this.value.match(/^[0-9,]*$/)) {
        if (radio_search && !radio_search.checked) {
            radio_search.click();
            const label = document.querySelector("label[for=filter_search]");
            if (label) {
                label.classList.add("autochanged");
                label.title = "LibTool: Enabled because you wrote a non-number";
            }
            radio_search.title = "LibTool: Enabled because you wrote a non-number";
        }
    }
}

function highlightReferrerBook() {
        // Highlight the book we came from
    if (document.referrer) {
        const book_number_regexp = /goodreads.com\/book\/(?:show\/|edit\/)?([0-9]+)[.-]?/;
        const match = book_number_regexp.exec(document.referrer);
        let number = null;
        if (match) {
            number = match[1];
            window.sessionStorage.setItem("LibTool:RecentBook", number);
        } else {
            number = window.sessionStorage.getItem("LibTool:RecentBook");
        }
        if (number) {
            const row_id = "book_row_" + number;
            const row = document.getElementById(row_id);
            if (row) {
                row.classList.add("recently-visited-book");
                row.title = "LibTool: This is the book you just came from";
            }
        }
    }
}

function addWorkIdsToBooks() {
    // Put work ids by work names
    const work_rows = document.querySelectorAll("form#combineForm table tbody tr");
    for (let work_row of work_rows) {
        const work_id_match = work_row.id.match(/^clickable_row_([0-9]+)$/);
        if (work_id_match) {
            const work_id = work_id_match[1];
            const work_title = document.querySelector(
                "td#book_title_" + work_id + " > strong");
            if (work_title) {
                const work_id_string = document.createElement("i");
                work_id_string.innerText = " (" + work_id + ")";
                work_id_string.title = "The work ID is " + work_id;
                work_title.after(work_id_string);
            }
        }
    }
}

function countCombines(event) {
    let count = 0;
    for (let i = 0; i < combine_form.length; i++) {
        const input = combine_form[i];
        if (input.id.startsWith("book_") && input.type == "checkbox" && input.checked)
            count++;
    }

    for (let i = 0; i < combine_form.length; i++) {
        const input = combine_form[i];
        if (input.name == "commit" && input.type == "submit") {
            input.value = "Combine (" + count + ") Editions";
            input.disabled = count < 2;
        }
    }
}

function setupCombineCounting() {
    if (combine_form) {
        countCombines();
        combine_form.addEventListener("change", countCombines);
        // We have to listen to "click" because there is script that
        // checks boxes when you click some text. They could have used
        // <label for=...> but they didn't.
        combine_form.addEventListener("click", countCombines);
    }
}

function init(options) {
    if (!options.disable_autoselectkeyword) {
        if (search_field) {
            onSearchInput.apply(search_field); // In case it was pre-filled.
            search_field.addEventListener("input", onSearchInput)
        }
    }

    if (!options.disable_highlightreferrerbook)
        highlightReferrerBook();

    if (!options.disable_workidoncombine)
        addWorkIdsToBooks();

    if (!options.disable_countcombines)
        setupCombineCounting();
}

// Get all options and call Init with them.
chrome.storage.sync.get(null, init);

"use strict";

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

const search_field = document.querySelector("input[name=value]");
const radio_search = document.getElementById("filter_search");
const radio_work = document.getElementById("filter_work");
if (search_field) {
    onSearchInput.apply(search_field); // In case it was pre-filled.
    search_field.addEventListener("input", onSearchInput)
}

// Highlight the book we came from
if (document.referrer) {
    const book_number_regexp = /goodreads.com\/book\/(?:show|edit\/)?([0-9]+)[.-]?/;
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

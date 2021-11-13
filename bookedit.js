"use strict";

const isbn10_field = document.getElementById("book_isbn");
const isbn13_field = document.getElementById("book_isbn13");

const title_field = document.getElementById("book_title");
const sort_title_field = document.getElementById("book_sort_by_title");

const language_select = document.querySelector("select#book_language_code");

const add_new_author_link = document.querySelector("a#addNewAuthor");

const book_cover_img = document.querySelector("div.rightContainer a > img");

function calculateIsbn10CheckDigit(isbn10) {
    let check_sum = 0;
    for (let i = 0; i < 9; i++) {
        check_sum += (10 - i) * parseInt(isbn10[i]);
    }
    // The correct check digit is the one that brings
    // check_sum to an multiple of 11. If that number is 10, then
    // the digit is an X.
    let check_digit = "" + ((11 - (check_sum % 11)) % 11);
    if (check_digit == "10")
        check_digit = "X";
    return check_digit;
}

function calculateIsbn13CheckDigit(isbn13) {
    let check_sum = 0;
    for (let i = 0; i < 6; i++) {
        const digit_0 = parseInt(isbn13[2 * i]);
        const digit_1 = parseInt(isbn13[2 * i + 1]);
        check_sum += digit_0 + 3 * digit_1;
    }
    // The correct check digit is the one that brings
    // check_sum to an even 10 when added.
    const check_digit = "" + ((10 - (check_sum % 10)) % 10);
    return check_digit;
}

function convertToIsbn13(isbn10) {
    const isbn13_without_check_digit = "978" +
          isbn10.substring(0, 9);
    const isbn13 = isbn13_without_check_digit +
          calculateIsbn13CheckDigit(isbn13_without_check_digit);
    return isbn13;
}

function isIsbn13Invalid(isbn13) {
    if (!isbn13)
        return false;
    return !isIsbn13Valid(isbn13);
}

function isIsbn13Valid(isbn13) {
    const isbn13_regexp = /^[0-9]{13}$/;
    if (!isbn13.match(isbn13_regexp))
        return false;

    return isbn13[12] == calculateIsbn13CheckDigit(isbn13);
}

function isIsbn10Invalid(isbn10) {
    if (!isbn10) {
        return false;
    }
    return !isIsbn10Valid(isbn10);
}

function isIsbn10Valid(isbn10) {
    const isbn10_regexp = /^[0-9]{9}[0-9X]$/;
    if (!isbn10.match(isbn10_regexp))
        return false

    return isbn10[9] == calculateIsbn10CheckDigit(isbn10);
}

function checkIsbn(field, type) {
    if (field) {
        const isInvalid = (type == 10 ?
                           isIsbn10Invalid :
                           isIsbn13Invalid)(field.value);
        field.classList[isInvalid ? "add" : "remove"]("invalidisbn");
        field.title = isInvalid ? "LibTool: Invalid ISBN" : "";
        return !isInvalid;
    }
    return false;
}

function checkIsbn10andIsbn13Match() {
    if (isbn13_field && isbn10_field &&
        isIsbn10Valid(isbn10_field.value) &&
        isIsbn13Valid(isbn13_field.value)) {
        const generated_isbn13 = convertToIsbn13(isbn10_field.value);
        const current_isbn13 = isbn13_field.value;
        if (current_isbn13 != generated_isbn13) {
            isbn10_field.classList.add("invalidisbn");
            isbn10_field.title = "LibTool: ISBN10 and ISBN13 mismatch";
        }
    }
}

function checkIsbn13(event) {
    if (event) {
        isbn13_field.classList.remove("updated")
        isbn13_field.title = "";
    }

    if (checkIsbn(isbn13_field, 13))
        checkIsbn10andIsbn13Match();
}

function checkIsbn10() {
    if (checkIsbn(isbn10_field, 10)) {
        if (isbn10_field.value && isbn13_field && !isbn13_field.value) {
            const generated_isbn13 = convertToIsbn13(isbn10_field.value);
            isbn13_field.value = generated_isbn13;
            isbn13_field.classList.add("updated")
            isbn13_field.title = "LibTool: Generated from ISBN10";
        }

        checkIsbn10andIsbn13Match();
    }
}

function onTitleEdited() {
    if (sort_title_field && title_field.value) {
        const auto_sort_title = title_field.value.toLowerCase();
        if (sort_title_field.classList.contains("autochanged") ||
            !sort_title_field.value ||
            auto_sort_title.startsWith(sort_title_field.value)) {
            // Current sort_title_field has no advanced content so we
            // can insert something generated, if that would help.
            if (sort_title_field.value != auto_sort_title) {
                sort_title_field.value = title_field.value.toLowerCase();
                sort_title_field.classList.add("autochanged");
                sort_title_field.title = "LibTool: Derived from title field";
            }
        }
    }
}

function onSortTitleEdited() {
    sort_title_field.classList.remove("autochanged");
    sort_title_field.title = "";
}

function enlargeImage() {
    const current_image_src = book_cover_img.src;
    // Large image source is the same without the ._SX98_ part.
    const keep_parts = current_image_src.match(/^(.*)\._SX[0-9]+_(\.jpg)$/);
    if (keep_parts) {
        book_cover_img.src = keep_parts[1] + keep_parts[2];
    }
}


function collectAuthor(name_id, role_id) {
    const name_field = document.querySelector("input#"+name_id);
    if (!name_field)
        return null;
    const role_field = document.querySelector("input#"+role_id);
    const name = name_field.value;
    const role = role_field ? role_field.value : "";
    return [name, role];
}

function setAuthor(name_id, role_id, name_role) {
    let old_name_role = collectAuthor(name_id, role_id);
    if (old_name_role === null) {
        add_new_author_link.click();
        old_name_role = collectAuthor(name_id, role_id);
        if (old_name_role == null) {
            // Give up, something is wrong.
            console.log("Libtool failed to add author field for " + name_id + " and " + role_id + ".");
            return;
        }
    }

    if (name_role[0] === old_name_role[0] && name_role[1] === old_name_role[1]) {
        // Already set
        return;
    }

    const name_field = document.querySelector("input#"+name_id);
    name_field.value = name_role[0];
    name_field.classList.add("updated");
    const role_field = document.querySelector("input#"+role_id);
    if (role_field) {
        if (role_field.value != name_role[1]) {
            role_field.value = name_role[1];
            role_field.classList.add("updated");
        }
    }
    // Maybe we need to press the save button too...
    if (name_id.startsWith("authorName_")) {
        const possible_author_number = name_id.split("_")[1];
        const possible_save_button_id = "saveBookAuthor_" + possible_author_number;
        const possible_save_button = document.getElementById(possible_save_button_id);
        if (possible_save_button && possible_save_button.innerText == "save") {
            possible_save_button.click();
        }
    }
}

function expandAuthorCommas() {
    const collectedAuthors = [];
    let phase = 0;
    let i = 0;
    let prevTr = null;
    // First the default author, then previous authors, then extra 1, 2, 3...
    // authors
    const existing_fields = []; // The non-numbered fields
    while (true) {
        let name_role = null;
        if (phase == 0) {
            name_role = collectAuthor("author_name", "book_author_role");
            existing_fields.push(["author_name", "book_author_role"])
            prevTr = document.getElementById("author_name").parentNode.parentNode;
            phase++;
        } else if (phase == 1) {
            prevTr = prevTr.nextSibling;
            while (prevTr &&
                   !(prevTr.id && prevTr.id.startsWith("bookAuthor_"))) {
                prevTr = prevTr.nextSibling;
            }
            if (prevTr) {
                const author_number = prevTr.id.substring(
                    "bookAuthor_".length,
                    prevTr.id.length);
                const author_show = document.getElementById(
                    "bookAuthorShow_" + author_number);
                if (author_show) {
                    if (author_show.style.display != "none") {
                        // Not in edit mode, yet...
                        const links = author_show.getElementsByTagName("a");
                        const edit_link = links[1];
                        if (edit_link.innerText == "edit") {
                            edit_link.click();
                        }
                    }
                    name_role = collectAuthor("authorName_" + author_number,
                                              "role_" + author_number);
                    existing_fields.push(["authorName_" + author_number,
                                          "role_" + author_number]);

                }
            }
            if (name_role === null) {
                phase = 2;
                continue;
            }
        } else {
            name_role = collectAuthor("book_authors_book_author" + i + "_name",
                                      "book_authors_book_author" + i + "_role");
            if (name_role === null)
                break;
        }

        if (name_role[0])
            collectedAuthors.push(name_role);
        i += 1;
    }

    const expanded_author_roles = [];
    const expanded_authors_check = {};
    for (let name_role of collectedAuthors) {
        const name_with_commas = name_role[0];
        const role = name_role[1];
        const names = name_with_commas.split(",");
        for (let name of names) {
            name = name.trim();
            const key = "" + name + "," + role;
            if (name && !(key in expanded_authors_check)) {
                expanded_authors_check[key] = "seen";
                expanded_author_roles.push([name.trim(), role]);
            }
        }
    }

    // Fill fields with the expanded data
    // First existing_fields fields, then numbered fields
    for (let i = 0; i < expanded_author_roles.length; i++) {
        const name_role = expanded_author_roles[i];
        if (i < existing_fields.length) {
            setAuthor(existing_fields[i][0], existing_fields[i][1], name_role);
        } else {
            setAuthor("book_authors_book_author" + i + "_name",
                      "book_authors_book_author" + i + "_role",
                      name_role);
        }
    }

    // Clear unused fields
    if (expanded_author_roles.length < existing_fields.length) {
        for (let i = existing_fields.length - expanded_author_roles.length;
             i < existing_fields.length;
             i++) {
            setAuthor(existing_fields[i][0], existing_fields[i][1], ["", ""]);
        }
    }
    // Clear unused numbered fields
    let next_unused_number = expanded_author_roles.length;
    if (next_unused_number < 1)
        next_unused_number = 1;
    while (true) {
        if (document.getElementById("book_authors_book_author" + next_unused_number + "_name")) {
            setAuthor("book_authors_book_author" + next_unused_number + "_name",
                      "book_authors_book_author" + i + "_role", ["", ""]);
            next_unused_number++;
        } else {
            break;
        }
    }
}

function onSomethingFocus(event) {
    // Default author fields have a limited length, 100 chars, which
    // won't fit long comma separated lists.
    if (event.target.type == "text" && event.target.name.match(".*author")) {
        event.target.removeAttribute("maxlength");
    }
}

function getRecentLanguagesList() {
    const recent_languages_string = window.localStorage.getItem("LibTool:RecentLanguages");
    if (recent_languages_string) {
        const recent_languages_list = recent_languages_string.split(",");
        return recent_languages_list;
    }
    return [];
}

function getLanguageLabel(language_code) {
    // Find the current option so we can use the same label.
    const option = document.querySelector(
        "option[value="+language_code+"]");
    const label = option ? option.innerText : language_code;
    return label;
}

function addRecentlyUsedLanguages() {
    const recent_languages_list = getRecentLanguagesList();
    let previous_element = language_select;
    const br = document.createElement("br");
    previous_element.after(br);
    previous_element = br;
    for (let language_code of recent_languages_list) {
        if (language_code) {
            const language_link = document.createElement("span");
            language_link.classList.add("libtool-command");
            language_link.classList.add("libtool-language-link");
            language_link.setAttribute("data-language-code", language_code);
            language_link.innerText = " → " + getLanguageLabel(language_code) + " ";
            language_link.addEventListener("click", onClickLanguage);
            previous_element.after(language_link);
            previous_element = language_link;
        }
    }
}
function onClickLanguage(event) {
    const language_code = this.getAttribute("data-language-code");
    language_select.value = language_code;
    language_select.dispatchEvent(new UIEvent("input"));
    language_select.dispatchEvent(new UIEvent("change"));
}


function onLanguageChanged(event) {
    this.libTool$HasChangedLanguage = true;
}

function onBookEditSubmitted(event) {
    if (language_select && language_select.libTool$HasChangedLanguage) {
        const selected_language_code = language_select.value;
        if (selected_language_code) {
            const recent_languages_list = getRecentLanguagesList();
            const new_recent_languages_list = [selected_language_code];
            for (let i = 0; i < recent_languages_list.length && new_recent_languages_list.length < 3; i++) {
                if (recent_languages_list[i] != selected_language_code) {
                    new_recent_languages_list.push(recent_languages_list[i]);
                }
            }

            window.localStorage.setItem("LibTool:RecentLanguages",
                                        new_recent_languages_list.join());
            language_select.libTool$HasChangedLanguage = false;
        }
    }
}

function init(options) {
    if (!options.disable_checkisbn) {
        if (isbn13_field) {
            checkIsbn13();
            isbn13_field.addEventListener("input", checkIsbn13);
        }

        if (isbn10_field) {
            checkIsbn10();
            isbn10_field.addEventListener("input", checkIsbn10);
        }
    }

    if (!options.disable_assistsorttitle) {
        if (title_field) {
            onTitleEdited();
            title_field.addEventListener("input", onTitleEdited);
        }

        if (sort_title_field) {
            sort_title_field.addEventListener("input", onSortTitleEdited);
        }
    }

    if (!options.disable_recentlanguages) {
        if (language_select) {
            addRecentlyUsedLanguages();
            language_select.addEventListener("change", onLanguageChanged);
            language_select.form.addEventListener("submit", onBookEditSubmitted);
        }
    }

    if (!options.disable_authorcommalist) {
        if (add_new_author_link) {
            const new_command = document.createElement("a");
            new_command.href = "#";
            new_command.innerText = "Expand commas (LibTool)";
            add_new_author_link.after(" - ", new_command);
            new_command.addEventListener("click", expandAuthorCommas);

            // Make sure to remove the maxlength limit or the comma expansion
            // will be hard to use. Since input fields can be added later, remove
            // it whenever something gets focus.
            document.addEventListener("focusin", onSomethingFocus);
        }
    }

    if (!options.disable_enlargecoverlink) {
        if (book_cover_img) {
            const cover_link = book_cover_img.parentNode;
            const new_link = document.createElement("span");
            new_link.classList.add("libtool-command");
            new_link.innerText = "Enlarge image (LibTool)";
            cover_link.before(new_link, document.createElement("br"));
            new_link.addEventListener("click", enlargeImage);
        }
    }
}

// Get all options and call Init with them.
chrome.storage.sync.get(null, init);

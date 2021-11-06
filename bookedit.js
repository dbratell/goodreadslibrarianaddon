"use strict";

const isbn10_field = document.getElementById("book_isbn");
const isbn13_field = document.getElementById("book_isbn13");

const title_field = document.getElementById("book_title");
const sort_title_field = document.getElementById("book_sort_by_title");

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
        if (sort_title_field.classList.contains("autochanged") ||
            !sort_title_field.value ||
            title_field.value.toLowerCase().startsWith(sort_title_field.value)) {
            // Current sort_title_field has no advanced content so we
            // can insert something generated.
            sort_title_field.value = title_field.value.toLowerCase();
            sort_title_field.classList.add("autochanged");
            sort_title_field.title = "LibTool: Derived from title field";
        }
    }
}

function onSortTitleEdited() {
    sort_title_field.classList.remove("autochanged");
    sort_title_field.title = "";
}

if (isbn13_field) {
    checkIsbn13();
    isbn13_field.addEventListener("input", checkIsbn13);
}

if (isbn10_field) {
    checkIsbn10();
    isbn10_field.addEventListener("input", checkIsbn10);
}

if (title_field) {
    onTitleEdited();
    title_field.addEventListener("input", onTitleEdited);
}

if (sort_title_field) {
    sort_title_field.addEventListener("input", onSortTitleEdited);
}

"use strict";

/** Move labels so that the author page becomes more compact and
 * requires less scrolling to find the "Save" button. */

/* Copy the save button to top? */
for (let i = 1; i < 4; i++) {
    const label = document.querySelector("label[for=author_genre" + i + "]")
    if (label) {
        const parent_p = label.parentNode;
        if (parent_p) {
            const genre_container = parent_p.nextSibling;
            if (genre_container &&
                genre_container.id == "author_genre" + i + "_container") {
                // Move the label
                const first_current_child = genre_container.firstChild;
                const spacer = document.createTextNode(": ");
                genre_container.insertBefore(spacer, first_current_child);
                genre_container.insertBefore(label, spacer)
                parent_p.remove();
            }
        }
    }
}

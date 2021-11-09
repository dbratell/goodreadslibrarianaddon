"use strict";

function getAllCheckboxes() {
    return document.querySelectorAll("div.option > input[type=checkbox]");
}

function getDefaultOptions() {
    const options = {}
    for (let checkbox of getAllCheckboxes()) {
        options[checkbox.id] = true;
    }
    return options;
}

function resetToDefaults() {
    chrome.storage.sync.clear(
        () => { restoreOptions(); }
    );
}

// Saves options to chrome.storage
function onCheckbox(event) {
    const checkbox = this;
    const option_string = "disable_" + checkbox.id;
    const options = {};
    options[option_string] = !checkbox.checked;
    chrome.storage.sync.set(
        options,
        function() {
            // Let user know options were saved by displaying Saved for 750ms.
            const status = document.querySelector("div.option > label[for="+checkbox.id + "] + span.status");
            status.classList.add("show");
            status.innerText = " Saved";
            setTimeout(() => {
                status.classList.remove("show");
                setTimeout(() => {
                    status.textContent = "";
                }, 1000);  // Remove after fading out for 1s
            },
                       750); // Show for 750ms
        }
    );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
    chrome.storage.sync.get(null, function(stored_options) {
        for (let checkbox of getAllCheckboxes())
            checkbox.checked = !stored_options["disable_" + checkbox.id];

        document.getElementById("loading").style.display = "none";
        document.getElementById("options").style.display = "block";
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
for (let checkbox of getAllCheckboxes())
    checkbox.addEventListener("change", onCheckbox);
document.getElementById("resetbutton").addEventListener(
    "click", resetToDefaults);

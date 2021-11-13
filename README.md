Chrome/Opera extension to simplify work for Librarians at Goodreads.

The Goodreads UI is not always optimal for the tasks a Goodreads
Librarian wants to perform so this extension tries to simplify some
things.

Born out of a feeling that things should be easier, and a lack of
ability to fix the actual site. And a wish to spend less time on
certain tasks.

Features
===

* Lets you write a comma separated list of authors and have them expanded
  into author fields so that you don't have to to copy one name at a time.

* **improved in the next release** Adds three small quick-links to choose a
  recently used language in the book edit page.

* Auto-generates "Sort by" from title because it takes less time than
  writing a sort by, even if you have to change one or two letters.

* Expand the cover photo on the book edit page so that you can check
  exactly what it says.

* Shows the work id by each work on the combine page.

* Auto-enable "keyword" when writing text in the combine search field so
  that the user doesn't have to redo the search after forgetting to do it.

* **new in the next release** Shows how many works are being combined to avoid accidents. 

* Highlights most recent book in the combination list to make it
  easier to find the edition to separate.

* Warns about mismatch between ISBN10 and ISBN13

* Warns about invalid ISBNs to cover when someone has put a truncated
  ISBN13 in the ISBN10 field.

* Auto-generates ISBN13 from ISBN10, to avoid cases where a edition ends
  up with one ISBN13 instance and one ISBN10 instance.

* Compacts the author edit page a bit to reduce the amount of
  scrolling needed to get to the save button.


Installation
===
The extension is published 
[in the Chrome Web Store](https://chrome.google.com/webstore/detail/goodreads-librarian-tools/pdfajdihdnkfpfhnpnjlipejcfojdfbm), and from there it can be installed in Opera,
Chrome and other Chromium based browsers.

The extension scripts are also compatible with Firefox but has not (yet) been packaged
and uploaded there.

To use the very latest version from github, it needs to be installed in 
"development mode". To use in development mode:

* Turn on "Developer Mode" on your extension page.
* Download/clone/checkout all files on your disk. 
* "Load Unpacked" on the extension page.

Note that running in developer mode bypasses all the controls Google does on
extensions so only do this if you trust the code and its developers.

Compatibility with Goodreads
===

The extension works with the current web version of Goodreads as of
November 2021. A new version is coming and it is likely that some of
the extension's functionality will disappear. Maybe the extension
won't even be needed.

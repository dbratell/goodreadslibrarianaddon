Chrome/Opera extension to simplify work for Librarians at Goodreads.

The UI for book editing is at times not optimal and this extension does
various things to make life as a librarian easier.

Born out of a feeling that things should be easier, and a lack of
ability to fix the actual site.

Features
===

* Lets you write a comma separated list of authors and have them expanded
  into author fields so that you don't have to to copy one name at a time.

* Autogenerates "Sort by" from title because it takes less time than
  writing a sort by, even if you have to change one or two letters.

* Expand the cover photo on the book edit page so that you can check
  exactly what it says.

* Highlights most recent book in the combination list to make it
  easier to find the edition to separate.

* Shows the work id by each work on the combine page.

* Warns about mismatch between ISBN10 and ISBN13

* Warns about invalid ISBNs to cover when someone has put a truncated
  ISBN13 in the ISBN10 field.

* Autogenerates ISBN13 from ISBN10, to avoid cases where a edition ends
  up with one ISBN13 instance and one ISBN10 instance.

* Auto-enable "keyword" when writing text in the combine search field so
  that the user doesn't have to redo the search after forgetting to do it.

* Puts the three most recently used languages at the top of the
  language select because if you work on a language specific group of
  books, scrolling that dropdown takes too long.

* Compacted the author edit page a bit to reduce the amount of
  scrolling needed to get to the save button.


Installation
===
The extension has not yet been uploaded to Chrome Web Store so it can
only be used in development mode.

To use in development mode, turn on "Developer Mode" on your extension page.
Download/clone/checkout all files on your disk. "Load Unpacked" and it
is running. Note that this bypasses all the controls Google does on
extensions so only do this if you trust the code and its developers.

Compatibility
===

The extension works with the current web version of Goodreads as of
november 2021. A new version is coming and it is likely that some of
the extension's functionality will disappear. Maybe the extension
won't even be needed.

$(document).ready(function() {
    var $noteTitle = $(".note-title");
    var $noteText = $(".note-textarea");
    var $saveNoteBtn = $(".save-note");
    var $newNoteBtn = $(".new-note");
    var $noteList = $(".list-container .list-group");

    // activeNote is used to keep track of the note in the textarea
    var activeNote = {};

    // A function for getting all notes from the db
    var getNotes = function () {
        var notesURL = '/api/notes';
        return $.ajax({
            url: notesURL,
            method: "GET",
            dataType: "json",
            statusCode: {
                404: function () {
                    alert("not found");
                    return;
                }
            }
        });
        // return $.ajax({
        //     url: "/api/notes",
        //     method: "GET"
        // });
    };

    // A function for saving a note to the db
    var saveNote = function (note) {
        return $.post("/api/notes", note)
            .then(function (data) {
                console.log("notes.html", data);
                alert("Adding note...");
            });
        // return $.ajax({
        //     url: "/api/notes",
        //     data: note,
        //     method: "POST"
        // });
    };

    // A function for updating a note to the db
    var updateNote = function (note, update) {
        return $.post("/api/notes/"+ note, update)
            .then(function (data) {
                console.log("notes.html", data);
                alert("Updating note...");
            });
        // return $.ajax({
        //     url: "/api/notes",
        //     data: note,
        //     method: "POST"
        // });
    };

    // A function for deleting a note from the db
    var deleteNote = function (note) {
        console.log(note);
        return $.ajax({
            url: "/api/notes/" + note,
            method: "DELETE",   
        })
        .then(function (data) {
            console.log("notes.html", data);
            alert("Deleting note...");
        });
    };

    // If there is an activeNote, display it, otherwise render empty inputs
    var renderActiveNote = function () {
        $saveNoteBtn.hide();

        if (activeNote.routeName) {
            $noteTitle.attr("readonly", true);
            $noteText.attr("readonly", false);
            $noteTitle.val(activeNote.title);
            $noteText.val(activeNote.text);
        } else {
            $noteTitle.attr("readonly", false);
            $noteText.attr("readonly", false);
            $noteTitle.val("");
            $noteText.val("");
        }
    };

    var renderRedoNote = function() {
        $saveNoteBtn.hide();
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val();
    }

    // Get the note data from the inputs, save it to the db and update the view
    var handleNoteSave = function () {
        return getNotes().then(function (data) {
            console.log(data);
            var newNote = {
                title: $noteTitle.val(),
                text: $noteText.val()
            };
            let index = search(newNote.title, data)
        
            if (index) {
                alert('note title already exist, chose another title!');
                renderRedoNote();
            }
            else {
                saveNote(newNote).then(function (data) {
                    getAndRenderNotes();
                    renderActiveNote();
                });
            }
        });
    };

    function search(key, inputArray) {
        for (i = 0; i < inputArray.length; i++) {
            if (inputArray[i].title.toLowerCase() === key.toLowerCase()) {
                return true;
            }
        }
    }

    // Update the clicked note
    var handleNoteUpdate = function (event) {
        // prevents the click listener for the list from being called when the button inside of it is clicked
        event.stopPropagation();
        console.log('Update button clicked');
        var note = $(this)
            .parent(".list-group-item")
            .data();
        var indexSelect = $(this).attr('dataIndex').trim()
        console.log(note);
        // console.log(updateNote);
        console.log(indexSelect);
        console.log(note.routeName);

        if (indexSelect === note.routeName) {
            note = {
                text: $noteText.val()
            };
        }

        updateNote(indexSelect, note).then(function () {
            getAndRenderNotes();
            // renderActiveNote();
        });
    };


    // Delete the clicked note
    var handleNoteDelete = function (event) {
        // prevents the click listener for the list from being called when the button inside of it is clicked
        event.stopPropagation();
        console.log('Delete button clicked');
        var note = $(this)
            .parent(".list-group-item")
            .data();
        var indexSelect = $(this).attr('dataIndex').trim()
        console.log(note);
        console.log(indexSelect);
        console.log(note.routeName);

        if (indexSelect === note.routeName) {
            note = {};
        }

        deleteNote(indexSelect).then(function () {
            getAndRenderNotes();
            activeNote = note;
            renderActiveNote();
        });
    };

    // Sets the activeNote and displays it
    var handleNoteView = function () {
        // console.log("active note clicked");
        activeNote = $(this).data();
        console.log(activeNote)
        var activeNoteInput = $(this).attr('dataIndex').trim();
        console.log(activeNoteInput);
        renderActiveNote();
    };

    // Sets the activeNote to and empty object and allows the user to enter a new note
    var handleNewNoteView = function () {
        activeNote = {};
        renderActiveNote();
    };

    // If a note's title or text are empty, hide the save button
    // Or else show it
    var handleRenderSaveBtn = function () {
        if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
            $saveNoteBtn.hide();
        } else {
            $saveNoteBtn.show();
        }
    };

    // Render's the list of note titles
    var renderNoteList = function (notes) {
        $noteList.empty();

        var noteListItems = [];

        for (var i = 0; i < notes.length; i++) {
            var note = notes[i];

            var $li = $("<li class='list-group-item'>").data(note);
            $li.attr('dataIndex', note.routeName);
            var $span = $("<span>").text(note.title);
            var $updateBtn = $(
                "<i class='material-icons float-right text-danger update-note'>save</i>"
                // "<i class='far fa-edit float-right text-danger update-note'>"
            );
            $updateBtn.attr('dataIndex', note.routeName);

            var $delBtn = $(
                "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
            );
            $delBtn.attr('dataIndex', note.routeName);
            $li.append($span, $delBtn, $updateBtn);
            noteListItems.push($li);
        }

        $noteList.append(noteListItems);
    };

    // Gets notes from the db and renders them to the sidebar
    var getAndRenderNotes = function () {
        return getNotes().then(function (data) {
            renderNoteList(data);
        });
    };

    $saveNoteBtn.on("click", handleNoteSave);
    $noteList.on("click", ".list-group-item", handleNoteView);
    $newNoteBtn.on("click", handleNewNoteView);
    $noteList.on("click", ".delete-note", handleNoteDelete);
    $noteList.on("click", ".update-note", handleNoteUpdate);
    $noteTitle.on("keyup", handleRenderSaveBtn);
    $noteText.on("keyup", handleRenderSaveBtn);

    // Gets and renders the initial list of notes
    getAndRenderNotes();
});
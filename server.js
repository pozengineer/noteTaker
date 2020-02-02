// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
const fs = require("fs");
const util = require("util");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Create a function which handles incoming requests and sends responses
function handleRequest(req, res) {

    // Capture the url the request is made to
    var path = req.url;

    // Depending on the URL, display a different HTML file.
    switch (path) {

        case "/":
            return displayRoot(res);

        case "/notes":
            return displayNotes(res);
        
        default:
            return display404(path, res);
    }
}

// When someone visits the "http://localhost:3000/" path, this function is run.
function displayRoot(res) {
    // Here we use the fs package to read our index.html file
    fs.readFile(__dirname + "./public/index.html", function(err, data) {
        if (err) throw err;
        // We then respond to the client with the HTML page by specifically telling the browser that we are delivering
        // an html file.
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

// When someone visits the "http://localhost:3000/notes" path, this function is run.
function displayNotes(res) {
    // Here we use the fs package to read our index.html file
    fs.readFile(__dirname + "./public/notes.html", function(err, data) {
        if (err) throw err;
        // We then respond to the client with the HTML page by specifically telling the browser that we are delivering
        // an html file.
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
}

// When someone visits any path that is not specifically defined, this function is run.
function display404(url, res) {
    var myHTML = "<html>" +
        "<body><h1>404 Not Found </h1>" +
        "<p>The page you were looking for: " + url + " can not be found</p>" +
        "</body></html>";

    // Configure the response to return a status code of 404 (meaning the page/resource asked for couldn't be found), and to be an HTML document
    res.writeHead(404, { "Content-Type": "text/html" });

    // End the response by sending the client the myHTML string (which gets rendered as an HTML document thanks to the code above)
    res.end(myHTML);
}
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Basic route that sends the user first to the AJAX Page

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});


// Displays all notes
app.get("/api/notes", function (req, res) {
    return res.json(notes);
});

// Displays a single note, or returns false
app.get("/api/notes/:character", function (req, res) {
    var chosen = req.params.notes;

    console.log(chosen);

    for (var i = 0; i < notes.length; i++) {
        if (chosen === notes[i].routeName) {
            return res.json(notes[i]);
        }
    }

    return res.json(false);
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});


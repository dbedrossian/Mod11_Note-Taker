const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const uuid = require('./uuid/uuid.js');
const { title } = require('process');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

fs.readFile("./db/db.json", 'utf8', (error, data) => {
    if(error) throw error
    var notes = JSON.parse(data)

    app.get('/api/notes', function (req, res) {
        res.json(notes)
    })

    app.post('/api/notes', (req, res) => {
        console.info(`${req.method} request received to add a new note`);
    
        const { title, text } = req.body;
    
        if (title && text) {
            const newNote = {
                title,
                text,
                id: uuid(),
            };

            notes.push(newNote);
            console.log(newNote);

            fs.writeFile(
                './db/db.json',
                JSON.stringify(notes),
                (writeErr) =>
                    writeErr
                        ? console.error(writeErr)
                        : console.info('Successfully updated notes!')
            );
    
            const response = {
                status: 'success',
                body: newNote,
            };
    
            console.log(response);
            res.status(201).json(response);
        } else {
            res.status(500).json('Error in posting note');
        }
    });

    app.get('/api/notes/:id', function (req, res){
        res.json(notes[req.params.id])
    })

    app.delete('/api/notes/:id', function (req, res){
        notes.splice(req.params.id, 1)

        fs.writeFile(
            './db/db.json',
            JSON.stringify(notes, '\t'),
            (writeErr) =>
            {
                if(writeErr) throw error;
                return true;
            }
        );
        console.log("deleted note" + req.params.id);
    })

    app.get('/notes', function (req, res) {
        res.sendFile(path.join(__dirname, "/public/notes.html"))
    })

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, "/public/index.html"))
    })
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
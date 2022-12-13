const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json')
const uuid = require('./uuid/uuid.js');
const { title } = require('process');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html')));


app.get('/notes', (req, res) => {
    res.status(200).json(`${req.method} request received to get notes`);
    console.info(`${req.method} request received to get notes`);
});

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);

    const { noteTitle, noteBody } = req.body;

    if (noteTitle && noteBody) {
        const newNote = {
            noteTitle,
            noteBody,
            review_id: uuid(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(newNote);

                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 4),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully updated reviews!')
                );
            }
        });

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

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
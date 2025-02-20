const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json()); // Middleware do parsowania JSON

const filePath = path.join(__dirname, 'data.json');

// Tworzymy plik JSON, jeśli nie istnieje
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf8');
}

// Trasa do obsługi POST dla /add-to-json
app.post('/add-to-json', (req, res) => {
    const { discord_id, hwid, pc_name } = req.body;
    const date = new Date().toISOString();

    if (!discord_id || !hwid || !pc_name) {
        return res.status(400).send('[-] Error 02');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('[-] Error 01');
        }

        let jsonData = JSON.parse(data);
        jsonData.push({ discord_id, date, hwid, pc_name });

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('[-] Error 03');
            }
            res.send('[+] Connected with API');
        });
    });
});

// Trasa GET do zwrócenia zawartości pliku JSON
app.get('/view-json', (req, res) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Błąd przy odczycie pliku');
        }
        res.header("Content-Type", "application/json");
        res.send(data);
    });
});

// Trasa DELETE do usuwania wpisu
app.delete('/delete-from-json', (req, res) => {
    const { discord_id, pc_name, date } = req.body;

    if (!discord_id || !pc_name || !date) {
        return res.status(400).send('[-] Error 04 - Missing parameters');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('[-] Error 05 - Read error');
        }

        let jsonData = JSON.parse(data);
        const newData = jsonData.filter(entry => 
            entry.discord_id !== discord_id || 
            entry.pc_name !== pc_name || 
            entry.date !== date
        );

        if (jsonData.length === newData.length) {
            return res.status(404).send('[-] Error 06 - Entry not found');
        }

        fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('[-] Error 07 - Write error');
            }
            res.send('[+] Entry deleted successfully');
        });
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

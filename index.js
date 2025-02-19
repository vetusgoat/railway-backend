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
    const { discord_id, username, avatar, hwid, pc_name } = req.body; // Dodaj username i avatar
    const date = new Date().toISOString();

    if (!discord_id || !username || !avatar || !hwid || !pc_name) { // Sprawdź nowe pola
        return res.status(400).send('Brak wymaganych danych!');
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Błąd przy odczycie pliku');
        }

        let jsonData = JSON.parse(data);
        jsonData.push({ discord_id, username, avatar, date, hwid, pc_name }); // Dodaj nowe pola

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Błąd przy zapisie do pliku');
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

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

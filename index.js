const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());  // Middleware do parsowania JSON

// Trasa do obsługi POST dla /add-to-json
app.post('/add-to-json', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    
    // Odczytujemy istniejący plik JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Błąd przy odczycie pliku');
        }

        // Parsujemy dane JSON
        let jsonData = JSON.parse(data);

        // Dodajemy nowy element (np. 1)
        jsonData.push(req.body.data);

        // Zapisujemy zaktualizowane dane do pliku
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) {
                return res.status(500).send('Błąd przy zapisie do pliku');
            }

            // Odpowiadamy, że dane zostały zapisane
            res.send('Dane zostały dodane do pliku JSON');
        });
    });
});

// Trasa GET do zwrócenia zawartości pliku JSON
app.get('/view-json', (req, res) => {
    const filePath = path.join(__dirname, 'data.json');
    
    // Odczytujemy plik JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Błąd przy odczycie pliku');
        }

        // Zwracamy zawartość pliku JSON w odpowiedzi
        res.header("Content-Type", "application/json");
        res.send(data);  // Zwracamy zawartość pliku JSON
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Serwer dziwwwwwwwwwała na porcie ${port}`);
});

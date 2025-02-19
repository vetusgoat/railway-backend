const express = require('express');
const fs = require('fs');
const app = express();

// Użyj middleware do parsowania JSON
app.use(express.json());

// Endpoint do dodawania danych do JSON
app.post('/add-to-json', (req, res) => {
    const newData = req.body.data;  // Przykładowe dane, np. "1"
    const filePath = './data.json';

    // Odczytanie pliku JSON, dodanie nowej wartości, zapisanie z powrotem
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).send('Błąd odczytu pliku.');
            return;
        }

        let jsonData = JSON.parse(data);
        jsonData.push(newData);  // Dodanie nowego elementu do tablicy

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500).send('Błąd zapisu pliku.');
                return;
            }
            res.status(200).send('Dane dodane do JSON!');
        });
    });
});

// Uruchomienie serwera
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});

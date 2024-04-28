const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

function validateEndpoint(req, res, next) {
    const validEndpoints = ['/dog', '/joke']; // Add other valid endpoints here

    if (validEndpoints.includes(req.path) || req.path === '/') {
        next(); 
    } else {
        // Serve the 404page.html from the views folder
        res.status(404).sendFile(path.join(__dirname, 'views', '404page.html'));
    }
}

app.use(express.static(path.join(__dirname, 'views')));
app.use(validateEndpoint);

// Default landing page
app.get('/', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'landingpage.html'));
});

// Endpoint to serve random jokes
app.get('/joke', (req, res) => {
    fs.readFile(path.join(__dirname, 'texts', 'joke.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error, this will be fixed soon as possible. Thank you for understanding!' });
            return;
        }

        const jokes = JSON.parse(data);
        const randomIndex = Math.floor(Math.random() * jokes.length);
        res.json({ joke: jokes[randomIndex].joke });
    });
});

app.get('/dog', (req, res) => {
    const directory = path.join(__dirname, 'images', 'dogs');
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error, this will be fixed soon as possible. Thank you for understanding!' });
            return;
        }

        const imageFiles = files.filter(file => {
            return file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png');
        });

        const randomIndex = Math.floor(Math.random() * imageFiles.length);
        const randomImage = imageFiles[randomIndex];

        const imagePath = path.join(directory, randomImage);
        res.sendFile(imagePath);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();
const smartsheetToken = process.env.SMARTSHEET_TOKEN;
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.static('public'));

app.get('/sheet-data', async (req, res) => {
    const sheetID = req.query.sheetID;

    const smartsheetUrl = `https://api.smartsheet.com/2.0/sheets/${sheetID}`;

    try {
        const response = await fetch(smartsheetUrl, {
            headers: {
                 'Authorization': `Bearer ${smartsheetToken}`
            }
        });

        const data = await response.json();

        const responseData = {
            rows: data.rows.map(row => ({
                cells: row.cells.map(cell => cell.value)
            }))
        };

        res.json(responseData);
    } catch (error) {
        console.error('Error fetching Smartsheet data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log('Proxy server running');
});

import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const __dirname = path.resolve();
const smartsheetToken = process.env.SMARTSHEET_TOKEN;
const port = process.env.PORT || 3000;

const smartsheetIDs = {
    "108": {
        salads: process.env.SMARTSHEET_ID_108_SALADS,
        bowls: process.env.SMARTSHEET_ID_108_BOWLS,
        plates: process.env.SMARTSHEET_ID_108_PLATES,
    },
    "103": {
        salads: process.env.SMARTSHEET_ID_103_SALADS,
        bowls: process.env.SMARTSHEET_ID_103_BOWLS,
        plates: process.env.SMARTSHEET_ID_103_PLATES,
    }
};

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/:store/:category', express.static(path.join(__dirname, 'public')));

app.get('/sheet-data/:store/:category', async (req, res) => {
    const { store, category } = req.params;
    const sheetID = smartsheetIDs[store][category];
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

app.get('/:store/:category', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log('Proxy server running');
});

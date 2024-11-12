import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT;
const sheetID = process.env.SMARTSHEET_ID;
const smartsheetToken = process.env.SMARTSHEET_TOKEN;

const app = express();
app.use(cors());

app.get('/sheet-data', async (req, res) => {
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

app.listen(port, () => {
    console.log(`Proxy server running on http://localhost:${port}`);
});

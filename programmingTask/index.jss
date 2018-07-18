
const contracts = require('./routes/contracts');
const express = require('express');
const app = express();


app.use('/api/contracts', contracts);
//User API Route for contracts
app.use(express.json());
//User JSON
app.use(express.static('public'));
//Give acces to files in the public folder, e.g. html, css, jquery

const port = process.env.PORT || 3000;
//Set Port to envieremental variable or to 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));
//Listen of PORT
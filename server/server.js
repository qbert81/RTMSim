const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the cors package
const crypto = require('crypto');
const bodyParser = require('body-parser');
const port = 5000;
const app = express()



app.use(cors()); // Use the cors middleware
app.use(express.json());

app.post('/encrypt/md5', (req, res) => {
    console.log(req.body.data)
    const dataToEncrypt = req.body.data;
    const encryptedData = crypto.createHash('md5').update(dataToEncrypt).digest('hex');
    res.json({ encryptedData });

});

app.post('/encrypt/base64', (req, res) => {
    const dataToEncrypt = req.body.data;
    const encryptedData = Buffer.from(dataToEncrypt, 'utf-8').toString('base64');

    res.json({ encryptedData });
});

app.post('/encrypt/base64hex', (req, res) => {
    const hexInput = req.body.data;
    console.log(hexInput)
    console.log(hexInput.length)
    
    let encryptedData =  btoa(hexInput.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
    res.json({ encryptedData });
  });

app.post('/post/', async (req, res) => {
    const params = req.body.params
    const headers = req.body.headers
    

    let url = req.body.targetUrl;

    if(params != undefined) {
        url += params
    }
    data = (req.body.data);

    console.log(url)
    
    //const response = await axios.post(url, data)
        try {
            // Post the client's data to the external server using Axios
        const externalResponse = await axios.post(url, data, {headers})

            
            console.log(externalResponse.status,externalResponse.data)
            // Relay the external server's response back to the client
            res.json(externalResponse.data);
        } catch (error) {
            if (error.response) {
                // If the external server responded with an error, relay the error message back to the client
                //console.log(error)
                res.status(error.response.status).json(error.response.data);
                console.error('Error:', error.response.data);
                
            } else {
                // If an error occurred during the request, respond with a general error message
                console.error('Error:', error.message);
                res.status(500).json({ error: 'An error occurred' });
            }
        }
});


/*app.post('/post/', (req, res) => {
    res.json({ "users": ["a", "b", "c"] })
});*/


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/api", (req, res) => {
    res.json({ "users": ["a", "b", "c"] })
})


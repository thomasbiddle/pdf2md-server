const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const fs = require('fs')
const pdf2md = require('@opendocsg/pdf2md')
const path = require('path');

const app = express();

// Enable File Upload
app.use(fileUpload({
    createParentPath: true
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// Start
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

app.post('/convert', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            // PDF file should be passed in the "pdfFile" key of the message body
            let pdf = req.files.pdfFile.data;

            let markdown = await pdf2md(pdf)

            res.send({
                status: true,
                data: markdown
            });
        }
    } catch (err) {
        console.log(err)
        res.status(500).send(err);
    }
});

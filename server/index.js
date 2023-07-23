const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

let port = process.env.PORT ||  5000 ;
const db = process.env.DB;

mongoose.connect(db).then(() => {
    console.log("Connection successful");
}).catch((err) => {
    console.log(err);
});

app.get('/', (req, res) => {
    res.send({ message: "Hello HK" });
});

const fileSchema = new mongoose.Schema({
    data: {
        type: String,
        required: true,
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
    fileName: { // Add the 'fileName' field to store the original file name
        type: String,
        required: true,
    },
    extension: { // Add the 'extension' field to store the file extension
        type: String,
        required: true,
    },
});

const File = mongoose.model("File", fileSchema);

app.post('/upload', async (req, res) => {
    const base64Data = req.body.data;
    const fileName = req.body.fileName;

    if (!base64Data || !fileName) {
        return res.status(400).json({ message: 'No file data or file name provided.' });
    }

    const extension = fileName.split('.').pop();

    const newFile = new File({
        data: base64Data,
        uploadDate: Date.now(),
        fileName: fileName, // Save the original file name in the database
        extension: extension,
    });

    try {
        await newFile.save();
        res.json({ message: 'File uploaded successfully.' });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Failed to upload the file.' });
    }
});

// Endpoint to get all files
app.get('/getFiles', async (req, res) => {
    try {
        const files = await File.find({}, 'data uploadDate fileName extension'); // Retrieve only 'data', 'uploadDate', 'fileName', and 'extension' fields
        res.json(files);
    } catch (error) {
        console.error('Error retrieving files:', error);
        res.status(500).json({ message: 'Failed to retrieve files.' });
    }
});

app.delete('/deleteFile/:id', async (req, res) => {
    const fileId = req.params.id;

    try {
        const deletedFile = await File.findByIdAndDelete(fileId);
        if (!deletedFile) {
            return res.status(404).json({ message: 'File not found.' });
        }
        res.json({ message: 'File deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Failed to delete the file.' });
    }
});

app.listen(port, () => {
    console.log(`Server Listening : `, { port });
});

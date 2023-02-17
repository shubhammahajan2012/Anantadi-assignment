const AWS = require('aws-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const videoUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      const key = `${uuid.v4()}-${file.originalname}`;
      cb(null, key);
    },
  }),
}).single('video');

app.post('/upload/video', (req, res) => {
  videoUpload(req, res, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error uploading video file');
    }

    console.log(req.file);

    res.status(200).json({
      Location: req.file.location,
      Key: req.file.key,
    });
  });
});

app.post('/upload/json', (req, res) => {
  console.log(req.body);

  // Do whatever you want to do with the uploaded JSON object

  res.status(200).send('JSON object uploaded successfully');
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port 3001');
});

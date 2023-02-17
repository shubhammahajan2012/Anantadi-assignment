import React, { useState } from 'react';
import { Grid, Button, TextField, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import axios from 'axios';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [jsonObject, setJsonObject] = useState(null);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);

  const handleFileInputChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleJsonObjectInputChange = (event) => {
    setJsonObject(JSON.parse(event.target.value));
  };

  const handleVideoUpload = () => {
    const formData = new FormData();
    formData.append('video', file);

    axios
      .post('/upload/video', formData)
      .then((response) => {
        setVideos([...videos, response.data]);
        setSuccessSnackbarOpen(true);
      })
      .catch((error) => {
        console.log(error);
        setErrorSnackbarOpen(true);
      });
  };

  const handleJsonObjectUpload = () => {
    axios
      .post('/upload/json', jsonObject)
      .then(() => {
        setJsonObject(null);
        setSuccessSnackbarOpen(true);
      })
      .catch((error) => {
        console.log(error);
        setErrorSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessSnackbarOpen(false);
    setErrorSnackbarOpen(false);
  };

  return (
    <div>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            type="file"
            label="Video"
            onChange={handleFileInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleVideoUpload}>
            Upload Video
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            type="text"
            label="JSON Object"
            onChange={handleJsonObjectInputChange}
          />
          <Button variant="contained" color="primary" onClick={handleJsonObjectUpload}>
            Upload JSON Object
          </Button>
        </Grid>
        <Grid item xs={12}>
          <h2>Uploaded Videos</h2>
          <ul>
            {videos.map((video) => (
              <li key={video.Key}>
                <a href={video.Location}>{video.Key}</a>
              </li>
            ))}
          </ul>
        </Grid>
      </Grid>
      <Snackbar open={successSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity="success" onClose={handleSnackbarClose}>
          Upload successful!
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert severity="error" onClose={handleSnackbarClose}>
          Upload failed. Please try again later.
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;

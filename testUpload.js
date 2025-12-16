import express from 'express';
import multer from 'multer';
import cors from 'cors';

const app = express();
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

app.post('/test-upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'No file received' });
  }
  
  res.json({ 
    message: 'File received successfully',
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype
  });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
});
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('public/images'));
app.use('/data', express.static('data'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.body.type === 'image') {
      cb(null, 'public/images');
    } else {
      cb(null, 'uploads');
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('media'), (req, res) => {
  const content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
  const filePath = req.body.type === 'image' ? '/images/' : '/uploads/';
  content.push({
    name: req.body.name,
    url: filePath + req.file.filename,
    type: req.body.type
  });
  fs.writeFileSync('data/content.json', JSON.stringify(content, null, 2));
  res.redirect('/');
});

// Premium page route
app.get('/premium', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'premium.html'));
});

app.get('/shorts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shorts.html'));
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

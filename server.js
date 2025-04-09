// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const app = express();

// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));
// app.use('/images', express.static('public/images'));
// app.use('/data', express.static('data'));

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (req.body.type === 'image') {
//       cb(null, 'public/images');
//     } else {
//       cb(null, 'uploads');
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

// app.post('/upload', upload.single('media'), (req, res) => {
//   const content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
//   const filePath = req.body.type === 'image' ? '/images/' : '/uploads/';
//   content.push({
//     name: req.body.name,
//     url: filePath + req.file.filename,
//     type: req.body.type
//   });
//   fs.writeFileSync('data/content.json', JSON.stringify(content, null, 2));
//   res.redirect('/');
// });

// // Premium page route
// app.get('/premium', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'premium.html'));
// });

// app.get('/shorts', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'shorts.html'));
// });

// app.listen(3000, () => {
//   console.log('Server running at http://localhost:3000');
// });


// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const session = require('express-session'); // Session management for login
// const bcrypt = require('bcryptjs'); // For password hashing

// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));
// app.use('/images', express.static('public/images'));
// app.use('/data', express.static('data'));

// app.use(express.urlencoded({ extended: true })); // To parse form data
// app.use(express.json()); // For JSON data

// // Session configuration
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true
// }));

// // Path to user data file (users.json)
// const usersFilePath = 'data/users.json';

// // Helper function to read the users.json file
// const readUsersFromFile = () => {
//   if (fs.existsSync(usersFilePath)) {
//     const rawData = fs.readFileSync(usersFilePath, 'utf8');
//     return JSON.parse(rawData);
//   }
//   return [];
// };

// // Helper function to write to the users.json file
// const writeUsersToFile = (users) => {
//   fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
// };

// // Storage configuration for multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (req.body.type === 'image') {
//       cb(null, 'public/images');
//     } else {
//       cb(null, 'uploads');
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage });

// // Route to handle file upload
// app.post('/upload', upload.single('media'), (req, res) => {
//   const content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
//   const filePath = req.body.type === 'image' ? '/images/' : '/uploads/';
//   content.push({
//     name: req.body.name,
//     url: filePath + req.file.filename,
//     type: req.body.type
//   });
//   fs.writeFileSync('data/content.json', JSON.stringify(content, null, 2));
//   res.redirect('/');
// });

// // Route for signup page
// app.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'signup.html'));
// });

// // Handle user signup
// app.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;
  
//   // Read users from file
//   const users = readUsersFromFile();
  
//   // Check if user already exists
//   const existingUser = users.find(user => user.email === email);
//   if (existingUser) {
//     return res.status(400).send('User already exists. Please log in.');
//   }

//   // Hash the password and store the new user
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = { username, email, password: hashedPassword };
//   users.push(newUser);

//   // Write the updated users list back to users.json
//   writeUsersToFile(users);

//   // Redirect to login page
//   res.redirect('/login');
// });

// // Route for login page
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// // Handle user login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Read users from file
//   const users = readUsersFromFile();
  
//   // Find user by email
//   const user = users.find(user => user.email === email);
//   if (!user) {
//     return res.status(400).send('User not found. Please sign up.');
//   }

//   // Compare the provided password with the stored hashed password
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(400).send('Incorrect password.');
//   }

//   // Store user session
//   req.session.user = user;

//   // Redirect to the home page or dashboard
//   res.redirect('/profile');
// });

// // Route to display the user's profile
// app.get('/profile', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }

//   const user = req.session.user;
//   res.send(`
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>User Profile</title>
//         <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//       </head>
//       <body class="bg-gray-900 text-white">
//         <div class="flex justify-center items-center min-h-screen">
//           <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
//             <h1 class="text-2xl font-bold mb-4">Welcome, ${user.username}</h1>
//             <img src="${user.profileImage || '/images/default.jpg'}" alt="Profile Image" class="rounded-full mb-4" width="150" />
//             <p>Email: ${user.email}</p>
//             <a href="/logout" class="text-red-500 mt-4 inline-block">Logout</a>
//           </div>
//         </div>
//       </body>
//     </html>
//   `);
// });

// // Logout route
// app.get('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.redirect('/');
//   });
// });

// // Premium page route
// app.get('/premium', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login');
//   }
//   res.sendFile(path.join(__dirname, 'public', 'premium.html'));
// });

// // Route for shorts page
// app.get('/shorts', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'shorts.html'));
// });

// app.listen(3000, () => {
//   console.log('Server running at http://localhost:3000');
// });


// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const session = require('express-session'); // Session management for login
// const bcrypt = require('bcryptjs'); // For password hashing
// app.set('view engine', 'ejs');


// // Middleware to serve static files like images
// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));
// app.use('/images', express.static('public/images'));
// app.use('/data', express.static('data'));

// // Middleware to parse form data and JSON
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Session configuration
// app.use(session({
//   secret: 'your-secret-key',
//   resave: false,
//   saveUninitialized: true
// }));

// // Path to user data file (users.json)
// const usersFilePath = 'data/users.json';

// // Helper function to read the users.json file
// const readUsersFromFile = () => {
//   if (fs.existsSync(usersFilePath)) {
//     const rawData = fs.readFileSync(usersFilePath, 'utf8');
//     return JSON.parse(rawData);
//   }
//   return [];
// };

// // Helper function to write to the users.json file
// const writeUsersToFile = (users) => {
//   fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
// };

// // Storage configuration for multer to handle file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // Ensure that images are saved in the public/images directory
//     cb(null, 'public/images');
//   },
//   filename: (req, file, cb) => {
//     // Naming the file with a timestamp and original file name
//     cb(null, Date.now() + '-' + file.originalname);
//   }
// });

// // Initialize multer with the defined storage
// const upload = multer({ storage });

// // Route for the signup page
// app.get('/signup', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'signup.html'));
// });

// // Handle user signup
// app.post('/signup', upload.single('profileImage'), async (req, res) => {
//   const { username, email, password } = req.body;

//   // Handle the profile image if uploaded
//   const profileImage = req.file ? '/images/' + req.file.filename : '/images/default.jpg'; // Default image if no profile is uploaded

//   // Read users from file
//   const users = readUsersFromFile();

//   // Check if the user already exists
//   const existingUser = users.find(user => user.email === email);
//   if (existingUser) {
//     return res.status(400).send('User already exists. Please log in.');
//   }

//   // Hash the password before storing
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const newUser = { username, email, password: hashedPassword, profileImage }; // Add profileImage to the user object
//   users.push(newUser);

//   // Write the updated users list back to users.json
//   writeUsersToFile(users);

//   // Redirect to login page after successful signup
//   res.redirect('/');
// });

// // Route for the login page
// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'login.html'));
// });

// // Handle user login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Read users from file
//   const users = readUsersFromFile();

//   // Find user by email
//   const user = users.find(user => user.email === email);
//   if (!user) {
//     return res.status(400).send('User not found. Please sign up.');
//   }

//   // Compare the provided password with the stored hashed password
//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid) {
//     return res.status(400).send('Incorrect password.');
//   }

//   // Store the user session
//   req.session.user = user;

//   // Redirect to the user's profile page
//   res.redirect('/');
// });

// app.get('/profile', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login'); // Redirect to login if user is not logged in
//   }

//   const user = req.session.user;

//   // Render the profile page and pass the user object
//   res.render('profile', { user });
// });

// // Route to display the user's profile page
// app.get('/profile', (req, res) => {
//   if (!req.session.user) {
//     return res.redirect('/login'); // Redirect to login if user is not logged in
//   }

//   const user = req.session.user;

//   // Handle profile image fallback if no image is available
//   const profileImage = user.profileImage || '/images/default.jpg'; // Fallback to default image if no profile image

//   // Render the profile page
//   res.send(`
//     <!DOCTYPE html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>User Profile</title>
//         <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//       </head>
//       <body class="bg-gray-900 text-white">
//         <div class="flex justify-center items-center min-h-screen">
//           <div class="bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center">
//             <h1 class="text-2xl font-bold mb-4">Welcome, ${user.username}</h1>
//             <img src="${profileImage}" alt="Profile Image" class="rounded-full mb-4" width="150" />
//             <p>Email: ${user.email}</p>
//             <a href="/logout" class="text-red-500 mt-4 inline-block">Logout</a>
//           </div>
//         </div>
//       </body>
//     </html>
//   `);
// });

// // Logout route to destroy the session
// app.get('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.redirect('/');
//   });
// });


// // Handle file upload
// app.post('/upload', upload.single('file'), (req, res) => {
//   if (req.file) {
//     // You can save the file path to the user's profile in your database
//     const filePath = `/uploads/${req.file.filename}`;

//     // For now, just redirect back to the profile page
//     res.redirect('/profile'); // Optionally, send file path to user data
//   } else {
//     res.status(400).send('No file uploaded.');
//   }
// });
// app.get('/profile', (req, res) => {
//   const user = {
//     username: 'John Doe',
//     email: 'john@example.com',
//     profileImage: '/uploads/your-uploaded-image.jpg' // Path to the uploaded image
//   };
  
//   res.render('profile', { user });
// });


// // Start the server
// app.listen(3000, () => {
//   console.log('Server running at http://localhost:3000');
// });


const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const session = require('express-session');
const bcrypt = require('bcryptjs');
app.set('view engine', 'ejs');

// Middleware to serve static files like images and videos
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Serve files from 'uploads' folder
app.use('/images', express.static('public/images'));
app.use('/data', express.static('data')); // Ensure data folder is public

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Path to user data file (users.json)
const usersFilePath = 'data/users.json';

// Helper function to read the users.json file
const readUsersFromFile = () => {
  if (fs.existsSync(usersFilePath)) {
    const rawData = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(rawData);
  }
  return [];
};

// Helper function to write to the users.json file
const writeUsersToFile = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Storage configuration for multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure that files are saved in the 'uploads' directory
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir); // Create the uploads directory if it doesn't exist
    }
    cb(null, uploadsDir); // Save to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Naming the file with a timestamp and the original file name
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Initialize multer with the defined storage
const upload = multer({ storage });

// Route for the signup page
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle user signup
app.post('/signup', upload.single('profileImage'), async (req, res) => {
  const { username, email, password } = req.body;

  // Handle the profile image if uploaded
  const profileImage = req.file ? '/uploads/' + req.file.filename : '/uploads/default.jpg'; // Default image if no profile is uploaded

  // Read users from file
  const users = readUsersFromFile();

  // Check if the user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send('User already exists. Please log in.');
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { username, email, password: hashedPassword, profileImage }; // Add profileImage to the user object
  users.push(newUser);

  // Write the updated users list back to users.json
  writeUsersToFile(users);

  // Redirect to login page after successful signup
  res.redirect('/login');
});

// Route for the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Read users from file
  const users = readUsersFromFile();

  // Find user by email
  const user = users.find(user => user.email === email);
  if (!user) {
    return res.status(400).send('User not found. Please sign up.');
  }

  // Compare the provided password with the stored hashed password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).send('Incorrect password.');
  }

  // Store the user session
  req.session.user = user;

  // Redirect to the user's profile page
  res.redirect('/profile');
});

// Route for the user's profile page
app.get('/profile', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if user is not logged in
  }

  const user = req.session.user;
  const profileImage = user.profileImage || '/uploads/default.jpg'; // Fallback to default image if no profile image

  // Fetch user's uploaded files from files.json
  const filesDataPath = path.join(__dirname, 'data', 'files.json');
  let uploadedFiles = [];
  if (fs.existsSync(filesDataPath)) {
    uploadedFiles = JSON.parse(fs.readFileSync(filesDataPath, 'utf8'));
  }

  // Render the profile page with user data and their uploaded files
  res.render('profile', { user, uploadedFiles });
});

// Handle file upload with title and description
app.post('/upload', upload.single('file'), (req, res) => {
  const { title, description } = req.body;

  // If file is uploaded, add file info along with title and description
  if (req.file) {
    const filePath = '/uploads/' + req.file.filename; // Path to the uploaded file

    // Create an object to store file data along with title and description
    const fileData = {
      title: title,
      description: description,
      fileUrl: filePath,
      type: req.file.mimetype.startsWith('video') ? 'video' : 'image' // Determine file type
    };

    // Read existing files data (stored in JSON)
    const filesDataPath = path.join(__dirname, 'data', 'files.json');
    let filesData = [];

    if (fs.existsSync(filesDataPath)) {
      filesData = JSON.parse(fs.readFileSync(filesDataPath, 'utf8'));
    }

    // Add the new file data to the existing list
    filesData.push(fileData);

    // Save the updated files data back to the JSON file
    fs.writeFileSync(filesDataPath, JSON.stringify(filesData, null, 2));

    // Redirect to the homepage or profile page after upload
    res.redirect('/');
  } else {
    res.status(400).send('No file uploaded.');
  }
});

// Logout route to destroy the session
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// Route to serve uploaded files (get all images/videos in the uploads folder)
// Fetch uploaded files with title, description, and file URL
// Route to fetch uploaded files (image/video metadata)
app.get('/uploads-list', (req, res) => {
  const filesDataPath = path.join(__dirname, 'data', 'files.json');
  
  // Check if the file with uploaded content data exists
  if (fs.existsSync(filesDataPath)) {
    const filesData = JSON.parse(fs.readFileSync(filesDataPath, 'utf8'));
    res.json(filesData); // Send the list of files with title, description, and URL
  } else {
    res.status(404).send('No files found');
  }
});


// Route to render the homepage (index.html) with uploaded files
app.get('/', (req, res) => {
  const filesDataPath = path.join(__dirname, 'data', 'files.json');
  let filesData = [];

  if (fs.existsSync(filesDataPath)) {
    filesData = JSON.parse(fs.readFileSync(filesDataPath, 'utf8'));
  }

  res.render('index', { files: filesData }); // Render the index page with files data
});

// Start the server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

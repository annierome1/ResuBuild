import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import Users from './models/User.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resumes: [{ type: mongoose.Schema.Types.Mixed }], // To store user's resumes
});
const User = mongoose.model('Users', userSchema);

// Authentication middleware
const authenticate = (req, res, next) => {
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
        
    }
};


// Generate descriptions endpoint (existing functionality)
app.post('/api/generate-description', async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ error: 'Job title is required' });
    }

    try {
        const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: "system",
                        content: "You are helping fill in a resume, generate one sentence descriptions based on the job the user has worked.",
                    },
                    {
                        role: "user",
                        content: `Generate 3 professional descriptions of what was done for this job: ${title}`,
                    }
                ],
                max_tokens: 100,
                n: 1,
            }),
        });

        const data = await openAiResponse.json();

        console.log('OpenAI Response Status:', openAiResponse.status);
        console.log('OpenAI Response Body:', data);

        if (data.choices && Array.isArray(data.choices)) {
            const suggestions = data.choices.map(choice => choice.message.content.trim());
            res.json({ suggestions });
        } else {
            res.status(500).json({ error: 'Unexpected response from OpenAI' });
        }
    } catch (error) {
        console.error('Error fetching descriptions:', error);
        res.status(500).send('Error generating descriptions');
    }
});








app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    console.log('Signup request received:', req.body); // Log incoming request

    if (!username || !password) {
        console.log('Validation failed: Missing username or password');
        return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            console.log(`Username "${username}" already exists.`);
            return res.status(400).json({ error: 'Username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });

        console.log('Saving new user to database...');
        await newUser.save();

        console.log('User saved successfully:', newUser);
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});



/*

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Hash the password (using bcrypt, for example)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

*/
// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error during login' });
    }
});

// Save resume
app.post('/api/save-resume', authenticate, async (req, res) => {
    const { resumeData } = req.body;

    if (!resumeData) {
        return res.status(400).json({ error: 'Resume data is required' });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.resumes.push(resumeData);
        await user.save();
        res.status(200).json({ message: 'Resume saved successfully' });
    } catch (error) {
        console.error('Error saving resume:', error);
        res.status(500).json({ error: 'Error saving resume' });
    }
});

// Retrieve resumes
app.get('/api/get-resumes', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ resumes: user.resumes });
    } catch (error) {
        console.error('Error retrieving resumes:', error);
        res.status(500).json({ error: 'Error retrieving resumes' });
    }
});

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, '../resume-builder/build')));

// Handle all other routes by serving the frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../resume-builder/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

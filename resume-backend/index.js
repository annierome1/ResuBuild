import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Resume from './models/Resume.js'

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

const router = express.Router();


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
                        content: "You are helping fill in a resume, generate one sentence, presice descriptions based on the job the user has worked.",
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

    console.log('Signup request received:', req.body); 

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


        res.json({ token, username: user.username }); // Ensure username is included
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error during login' });
    }
});



app.post('/api/resume/save', async (req, res) => {
    const { username, resumeName, userObject, forceNew = false } = req.body;
    try {
      const existing = await Resume.findOne({ username, resumeName });
  
      if (forceNew) {
        if (existing) {
          return res
            .status(409)
            .json({ error: 'Resume name already in use. Choose a different name.' });
        }
        const newResume = new Resume({ username, resumeName, userObject });
        await newResume.save();
        return res.status(201).json({ message: 'Resume saved as NEW successfully' });
      } else {
        if (existing) {
          existing.userObject = userObject;
          await existing.save();
          return res.status(200).json({ message: 'Resume progress saved successfully' });
        }
        const newResume = new Resume({ username, resumeName, userObject });
        await newResume.save();
        return res.status(201).json({ message: 'Resume progress saved successfully' });
      }
    } catch (err) {
      console.error('Error saving resume:', err);
      return res
        .status(500)
        .json({ error: 'Error saving resume', details: err.message });
    }
  });
  





// Get List of Resumes for a User
app.get('/api/resume/list', async (req, res) => {
    const { username } = req.query;

    try {
        const resumes = await Resume.find({ username }).select("resumeName");
        res.status(200).json(resumes);
    } catch (error) {
        res.status(500).json({ error: "Error fetching resumes" });
    }
});

// 🔹 Load a Specific Resume by Name
app.get('/api/resume/load', async (req, res) => {
    const { username, resumeName } = req.query;

    try {
        const resume = await Resume.findOne({ username, resumeName });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        
    } catch (error) {
        res.status(500).json({ error: "Error loading resume" });
    }
});

app.delete('/api/resume/delete', async (req, res) => {
  const { username, resumeName } = req.body;
  if (!username || !resumeName) {
    return res.status(400).json({ error: 'username and resumeName required' });
  }

  try {
    const result = await Resume.findOneAndDelete({ username, resumeName });
    if (!result) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    return res.status(200).json({ message: 'Deleted successfully', resumeName });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post("/api/generate-cover-letter", async (req, res) => {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData || !jobDescription) {
        return res.status(400).json({ error: "Missing resume data or job description." });
    }

    const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];
    const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
    const  {firstName, lastName, email, phone, city, state, zipCode} = resumeData;

    const formattedResume = `
    Name: ${firstName || ""} ${lastName || ""}
    City, State, Zip: ${city || ""}, ${state || ""} ${zipCode || ""}
    Email: ${email || ""}
    Phone: ${phone || ""}
    
    Experience:
    ${experience.map(exp => `- **${exp.title}** at *${exp.company}* (${exp.startDate || "N/A"} - ${exp.endDate || "N/A"}) 
      - Responsibilities: ${exp.description.join("; ")}`).join("\n")}

    Projects:
    ${projects.map(proj => `- **${proj.title}**: ${proj.description.join("; ")}
      - Technologies Used: ${proj.technologies || "N/A"}`).join("\n")}
    `;

        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: [
                    { 
                        role: "system", 
                        content: `You are an expert career coach writing tailored cover letters. 
                        Your goal is to create a compelling, professional, unique, and structured cover letter that matches the user's experience 
                        with the job they are applying for. Follow these guidelines:
                        - Make 3 or 4 paragraphs
                        - Use a confident and professional tone
                        - Relate experiences and projects to the skills needed in the job description
                        - Avoid generic phrases like "I am writing to apply..."
                        - Customize the cover letter to show enthusiasm for the company and role.
                        `
                    },
                    { 
                        role: "user", 
                        content: `Here is my resume:\n${formattedResume}\n\nHere is the job description:\n${jobDescription}\n\nGenerate a tailored, structured, and professional cover letter.` 
                    }
                ],
                max_tokens: 600,
            }),
        });

        const data = await openAiResponse.json();

        if (data.choices && data.choices[0].message.content) {
            res.json({ coverLetter: data.choices[0].message.content });
        } else {
            res.status(500).json({ error: "AI failed to generate a cover letter." });
        }

    
});

app.post("/api/save-cover-letter", async (req, res) => {
    const { userToken, coverLetter } = req.body;

    if (!userToken || !coverLetter) {
        return res.status(400).json({ error: "Missing token or cover letter." });
    }

    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ error: "User not found." });

        user.coverLetters.push({ content: coverLetter, date: new Date() });
        await user.save();

        res.json({ message: "Cover letter saved successfully." });
    } catch (error) {
        console.error("Error saving cover letter:", error);
        res.status(500).json({ error: "Failed to save cover letter." });
    }
});

// Serve static files from the frontend build folder
app.use(express.static(path.join(__dirname, '../resume-builder', 'build')));

// Handle all other routes by serving the frontend's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../resume-builder', 'build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

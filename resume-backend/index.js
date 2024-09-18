import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/generate-description', async (req, res) => {
    const { title } = req.body;

    if (!title){
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
                        content: "You are helping fill in a resume, generate one sentence descriptions based on the job the user has worked."
                    },
                    {
                        role: "user", 
                        content: `Generate 3 professional descriptions of what was done for this job: ${title}`
                    }
                ],
                max_tokens: 100,  // Limit the number of tokens in the response
                n: 1,  // Number of completions to generate (for `chat` models, n refers to alternative completions, but you can just return 1 response)
            }),
        });

        const data = await openAiResponse.json();
        
        // Log the entire response to check its structure
        console.log ('OpenAI Response Status:', openAiResponse.status);
        console.log('OpenAI Response Body:', data);


        // Now, safely access 'choices' only if it exists
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
// Serve static files from the React app (in production)
app.use(express.static(path.join(__dirname, '../resume-backend/build')));

// Handle any other routes and serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../resume-backend/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


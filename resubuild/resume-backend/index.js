import fetch from 'node-fetch';
import express from 'express';
import cors from 'cors';

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
                'Authorization': `Bearer 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`, // Add your OpenAI API Key here
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

app.listen(5001, () => {
    console.log('Server started on port 5001');
});
import fetch from 'node-fetch';
import express from 'express';
import OpenAI from "openai";

const app = express();
app.use(express.json());

app.post('/api/generate-description', async (req, res) => {
    const { title } = req.body;

    if (!title){
        return res.status(400).json({ error: 'Job title is required' });
    }

    try {
        const openAiResponse = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                prompt: `Generate 3 professional work descriptions for a job title: ${title}`,
                max_tokens: 100,
                n: 3,
                stop: null,
            }),
        });

        const data = await openAiResponse.json();
        
        // Log the entire response to check its structure
        console.log ('OpenAI Response Status:', openAiResponse.status);
        console.log('OpenAI Response Body:', data);


        // Now, safely access 'choices' only if it exists
        if (data.choices && Array.isArray(data.choices)) {
            const suggestions = data.choices.map(choice => choice.text.trim());
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
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML file

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
});

// Google Gemini AI Integration (if you have API key)
async function analyzeImageWithGemini(imageBuffer) {
    try {
        // Replace with actual Gemini API call
        const base64Image = imageBuffer.toString('base64');
        
        // Mock response for now - replace with real API call
        const mockAnalysis = {
            overallScore: 75 + Math.random() * 20,
            analysis: {
                colorHarmony: { score: Math.round(75 + Math.random() * 20) },
                composition: { score: Math.round(70 + Math.random() * 25) },
                technicalExecution: { score: Math.round(65 + Math.random() * 30) },
                emotionalImpact: { score: Math.round(70 + Math.random() * 25) }
            },
            artStyle: getRandomArtStyle(),
            feedback: {
                strengths: [
                    "Excellent color balance and harmony",
                    "Strong compositional flow",
                    "Good use of contrast"
                ],
                improvements: [
                    "Consider enhancing details in focal areas",
                    "Could benefit from stronger lighting"
                ],
                technical: [
                    "Solid brush technique",
                    "Good understanding of form"
                ],
                overall: "This artwork shows strong fundamentals with room for refinement."
            }
        };
        
        return mockAnalysis;
    } catch (error) {
        console.error('Analysis error:', error);
        throw error;
    }
}

function getRandomArtStyle() {
    const styles = ['Contemporary', 'Impressionist', 'Abstract', 'Realist', 'Expressionist'];
    return styles[Math.floor(Math.random() * styles.length)];
}

// API Routes
app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        console.log('Analyzing image:', req.file.originalname);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Analyze image
        const analysis = await analyzeImageWithGemini(req.file.buffer);
        
        res.json({
            success: true,
            analysis: analysis
        });
        
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to analyze image' 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' });
        }
    }
    res.status(500).json({ error: error.message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Package.json dependencies needed:
/*
{
  "dependencies": {
    "express": "^4.18.2",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
*/
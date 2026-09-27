import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Automatically ensure data folder exists
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PLACES_FILE = path.join(DATA_DIR, 'places.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
};

// Helper function to split text into chunks for TTS processing
function splitTextIntoChunks(text, maxLength = 180) {
  if (!text) return [];
  const sentences = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks.length > 0 ? chunks : [text];
}

// Base route for health check
app.get('/', (req, res) => {
  res.send('🚀 Yerevan TimeLens API is running successfully');
});

// GET all places
app.get(`/api/places`, (req, res) => {
  res.json(readData(PLACES_FILE));
});

// GET single place
app.get(`/api/places/:id`, (req, res) => {
  const places = readData(PLACES_FILE);
  const place = places.find(p => p.id === req.params.id);
  if (!place) return res.status(404).json({ error: 'Place not found' });
  res.json(place);
});

// AUTH: Login with Email & Password
app.post(`/api/auth/login`, (req, res) => {
  const { email, password } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// AUTH: Register New User
app.post(`/api/auth/register`, (req, res) => {
  const { name, email, age, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const users = readData(USERS_FILE);
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    email,
    age: age || '',
    password,
    collectedStamps: []
  };

  users.push(newUser);
  writeData(USERS_FILE, users);

  const { password: _, ...userWithoutPassword } = newUser;
  res.json(userWithoutPassword);
});

// POST: Add Stamp to User Passport
app.post(`/api/users/stamp`, (req, res) => {
  const { userId, placeId } = req.body;
  const users = readData(USERS_FILE);
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.collectedStamps.some(s => s.placeId === placeId)) {
    user.collectedStamps.push({ placeId, collectedAt: new Date().toISOString() });
    writeData(USERS_FILE, users);
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// POST: Multi-language Text-To-Speech (English, Russian, Armenian)
// POST: Multi-language Text-To-Speech (English, Russian, Armenian)
app.post('/api/tts', async (req, res) => {
  try {
    const { text, lang } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    const langMap = { en: 'en', ru: 'ru', hy: 'hy' };
    const targetLang = langMap[lang] || 'en';

    const chunks = splitTextIntoChunks(text, 180);
    const audioBuffers = [];

    for (const chunk of chunks) {
      // Switch to client=gtx and translate.googleapis.com for stable, token-less access
      const url = `https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=${targetLang}&q=${encodeURIComponent(chunk)}`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Google TTS rejected request with status ${response.status}: ${errText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(Buffer.from(arrayBuffer));
    }

    const combinedBuffer = Buffer.concat(audioBuffers);
    
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': combinedBuffer.length,
    });
    
    res.send(combinedBuffer);
  } catch (err) {
    console.error('TTS Generation Error:', err.message);
    res.status(500).json({ error: 'Failed to generate TTS audio', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Yerevan TimeLens Server running on port ${PORT}`);
});
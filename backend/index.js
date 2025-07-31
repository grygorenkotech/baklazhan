const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const questionsPath = path.join(__dirname, 'data', 'questions.json');
const keyPath = path.join(__dirname, 'data', 'key.json');
const archetypesPath = path.join(__dirname, 'data', 'archetypes.json');

// GET /api/questions
app.get('/api/questions', (req, res) => {
  const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
  res.json(questions);
});

// POST /api/result
app.post('/api/result', (req, res) => {
  const answers = req.body.answers; // масив індексів відповідей
  const keyData = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const archetypes = JSON.parse(fs.readFileSync(archetypesPath, 'utf8'));

  // Підрахунок архетипів за відповідями
  const counts = {};
  answers.forEach((ans, idx) => {
    const keyEntry = keyData.keys[idx];
    if (keyEntry && keyEntry.variants[ans]) {
      let archetype = keyEntry.variants[ans].trim();
      if (!archetype.endsWith('"')) archetype += '"';
      counts[archetype] = (counts[archetype] || 0) + 1;
    }
  });

  // Сортуємо архетипи за кількістю згадок
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const main = sorted[0] ? sorted[0][0] : null;
  console.log('main:', main);
  console.log('archetypes keys:', Object.keys(archetypes));
  const top3 = sorted.slice(0, 3).map(([name, count]) => ({
    archetype: name,
    count,
    description: archetypes[name] || ''
  }));

  res.json({
    main,
    mainDescription: archetypes[main] || '',
    top3
  });
});

// GET /api/archetypes
app.get('/api/archetypes', (req, res) => {
  const archetypes = JSON.parse(fs.readFileSync(archetypesPath, 'utf8'));
  res.json(archetypes);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
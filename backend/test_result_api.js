// Для запуску: node --experimental-modules backend/test_result_api.js або перейменуйте на .mjs
import fetch from 'node-fetch';

async function testResultApi() {
  const answers = Array(20).fill(1); // наприклад, всі другі варіанти (індекс 1)
  const res = await fetch('http://localhost:3001/api/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });
  const data = await res.json();
  console.log('main:', data.main);
  console.log('mainDescription:', data.mainDescription ? data.mainDescription.slice(0, 60) + '...' : '');
  console.log('top3:', data.top3.map(t => t.archetype + ' (' + t.count + ')').join(', '));
  if (data.main && data.mainDescription && data.top3 && data.top3.length > 0) {
    console.log('✅ Тест пройдено успішно!');
  } else {
    console.error('❌ Тест не пройдено!');
    process.exit(1);
  }
}

testResultApi(); 
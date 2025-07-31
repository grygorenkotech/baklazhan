const API_URL = 'http://localhost:3001/api';

const questionsDiv = document.getElementById('questions');
const form = document.getElementById('quiz-form');
const resultDiv = document.getElementById('result');

let questions = [];

async function loadQuestions() {
  const res = await fetch(`${API_URL}/questions`);
  questions = await res.json();
  renderQuestions();
}

function renderQuestions() {
  questionsDiv.innerHTML = '';
  questions.forEach((q, idx) => {
    const block = document.createElement('div');
    block.className = 'question-block';
    const title = document.createElement('div');
    title.className = 'question-title';
    title.textContent = `${idx + 1}. ${q.question}`;
    block.appendChild(title);
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    q.options.forEach((opt, oidx) => {
      const label = document.createElement('label');
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `q${idx}`;
      radio.value = oidx;
      if (oidx === 0) radio.required = true;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(opt));
      optionsDiv.appendChild(label);
    });
    block.appendChild(optionsDiv);
    questionsDiv.appendChild(block);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const answers = [];
  for (let i = 0; i < questions.length; i++) {
    const val = form[`q${i}`].value;
    answers.push(Number(val));
  }
  const res = await fetch(`${API_URL}/result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  });
  const data = await res.json();
  showResult(data);
});

function showResult(data) {
  let html = '';
  if (data.main) {
    html += `<h2>Твій основний архетип: ${data.main}</h2>`;
    if (data.mainDescription) {
      html += `<div class="main-desc">${data.mainDescription.replace(/\n/g, '<br>')}</div>`;
    }
  } else {
    html += `<p>Не вдалося визначити архетип. Спробуйте ще раз!</p>`;
  }
  if (data.top3 && data.top3.length > 0) {
    html += `<h3>Топ-3 архетипи:</h3><ol>`;
    html += data.top3.map(item =>
      `<li><b>${item.archetype}</b> (${item.count}):<br>${(item.description || '').replace(/\n/g, '<br>')}</li>`
    ).join('');
    html += `</ol>`;
  }
  resultDiv.innerHTML = html;
  resultDiv.classList.remove('hidden');
  document.getElementById('archetypes-link').classList.remove('hidden');
  window.scrollTo({ top: resultDiv.offsetTop, behavior: 'smooth' });
}

loadQuestions(); 
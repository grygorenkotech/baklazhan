document.addEventListener('DOMContentLoaded', () => {
  const questionsContainer = document.getElementById('questions');
  const quizForm = document.getElementById('quiz-form');
  const resultDiv = document.getElementById('result');
  const archetypesLink = document.getElementById('archetypes-link');

  // Відображення запитань
  questionsContainer.innerHTML = questionsData.map((q, idx) => `
    <div class="question-block" style="margin-bottom:24px;">
      <p class="question-title" style="font-weight:bold; margin-bottom:8px;">${q.question}</p>
      <div class="options" style="display:flex; flex-direction:column; gap:6px;">
        ${q.options.map((opt, oidx) => `
          <label style="display:flex; align-items:center; gap:8px;">
            <input type="radio" name="q${idx}" value="${oidx}" required>
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Збір унікальних архетипів з keyData
  const archetypeSet = new Set();
  keyData.forEach(variants => variants.forEach(name => archetypeSet.add(name)));
  const archetypeNames = Array.from(archetypeSet);

  // Якщо є опис архетипів, підключіть archetypesData з archetypes-data.js
  // const archetypesData = { ... }

  quizForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let answers = [];
    for (let i = 0; i < questionsData.length; i++) {
      const selected = quizForm.querySelector(`input[name="q${i}"]:checked`);
      if (selected) answers.push(Number(selected.value));
    }

    // === Логіка підрахунку архетипів ===
    const counts = {};
    answers.forEach((ans, idx) => {
      const keyEntry = keyData[idx];
      if (keyEntry && keyEntry[ans]) {
        let archetype = keyEntry[ans].trim();
        // Додаємо лапки, якщо потрібно (як у бекенді)
        if (!archetype.endsWith('"')) archetype += '"';
        counts[archetype] = (counts[archetype] || 0) + 1;
      }
    });

    // Сортуємо архетипи за кількістю згадок
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const main = sorted[0] ? sorted[0][0] : null;
    const top3 = sorted.slice(0, 3).map(([name, count]) => ({
      archetype: name,
      count,
      description: (typeof archetypesData !== 'undefined' && archetypesData[name]) ? archetypesData[name] : ''
    }));

    // Вивід результату з описом
    let html = '';
    if (main) {
      html += `<h2>Твій основний архетип: ${main}</h2>`;
      if (typeof archetypesData !== 'undefined' && archetypesData[main]) {
        html += `<div class="main-desc">${archetypesData[main].replace(/\n/g, '<br>')}</div>`;
      }
    } else {
      html += `<p>Не вдалося визначити архетип. Спробуйте ще раз!</p>`;
    }
    if (top3.length > 0) {
      html += `<h3>Топ-3 архетипи:</h3><ol>`;
      html += top3.map(item =>
        `<li>
          <b>${item.archetype}</b> (${item.count}):
          <div style="margin-top:4px;">${(item.description || '').replace(/\n/g, '<br>')}</div>
        </li>`
      ).join('');
      html += `</ol>`;
    }
    resultDiv.innerHTML = html;
    resultDiv.classList.remove('hidden');
    archetypesLink.classList.remove('hidden');
    window.scrollTo({ top: resultDiv.offsetTop, behavior: 'smooth' });
  });
});
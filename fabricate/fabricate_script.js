const messages = {
    '100': "천생연분, 100% 운명적인 사랑입니다! ❤️",
    '95': "영혼의 단짝, 찰떡궁합! 모든 것이 완벽해요. ✨",
    '90': "환상의 조합! 서로를 완벽하게 보완하는 관계네요. 💑",
    '80': "긍정적인 기운이 넘치는 관계! 함께 있으면 행복해져요. 😊",
    '70': "서로에게 좋은 영향을 주는 사이네요. 앞으로가 더 기대됩니다. 👍",
    '60': "노력하면 더 좋아질 수 있는 사이! 함께 만들어가세요. 🤝",
    '50': "알아갈 시간이 조금 필요해요. 대화가 중요합니다. ☕️",
    '40': "서로의 다름을 인정하는 노력이 필요합니다. 끈기가 중요해요. 🔑",
    '30': "운명의 장난일까요? 서로를 이해하는 마음이 있다면 가능성은 있습니다. 😉"
};
const confettiColors = ['#fce38a', '#f38181', '#a9d18e', '#82c9e8', '#d48fbe'];
const body = document.body;
const EFFECT_DURATION = 10000;

let fixedScores = [];

document.getElementById('add-fixed-btn').addEventListener('click', addFixedScore);

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    renderSavedList();
}

function addFixedScore() {
    const name1 = document.getElementById('fixed-name1').value.trim();
    const name2 = document.getElementById('fixed-name2').value.trim();
    const score = parseInt(document.getElementById('fixed-score').value, 10);

    if (!name1 || !name2 || isNaN(score) || score < 0 || score > 100) {
        alert("이름과 0-100 사이의 유효한 점수를 입력해주세요.");
        return;
    }

    fixedScores.push({ name1, name2, score });
    renderSavedList();

    document.getElementById('fixed-name1').value = '';
    document.getElementById('fixed-name2').value = '';
    document.getElementById('fixed-score').value = '';
}

function renderSavedList() {
    const savedList = document.getElementById('saved-list');
    savedList.innerHTML = '';

    fixedScores.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
                <span>${item.name1} & ${item.name2}: ${item.score}점</span>
                <button class="delete-btn" data-index="${index}">삭제</button>
            `;
        savedList.appendChild(li);
    });

    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteFixedScore(index);
        });
    });
}

function deleteFixedScore(index) {
    fixedScores.splice(index, 1);
    renderSavedList();
}

function calculateCompatibility() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    const scoreDisplay = document.getElementById('score-display');
    const messageDisplay = document.getElementById('message-display');
    const loadingState = document.getElementById('loading-state');
    const calculateBtn = document.getElementById('calculate-btn');

    if (!name1 || !name2) {
        scoreDisplay.innerText = "이름을 모두 입력해주세요.";
        messageDisplay.innerText = "";
        return;
    }

    scoreDisplay.className = '';
    messageDisplay.className = '';
    scoreDisplay.innerText = "";
    messageDisplay.innerText = "";
    loadingState.style.display = 'block';
    calculateBtn.disabled = true;

    setTimeout(() => {
        loadingState.style.display = 'none';

        let compatibilityScore;
        const fixedRule = fixedScores.find(rule =>
            (rule.name1 === name1 && rule.name2 === name2) ||
            (rule.name1 === name2 && rule.name2 === name1)
        );

        if (fixedRule) {
            compatibilityScore = fixedRule.score;
            loadingState.innerText = '계산 중...';
            loadingState.style.display = 'block';
            setTimeout(() => {
                loadingState.style.display = 'none';
                displayResult(compatibilityScore, scoreDisplay, messageDisplay);
            }, 2000);
        } else {
            let score1 = 0;
            for (let i = 0; i < name1.length; i++) score1 += name1.charCodeAt(i);
            let score2 = 0;
            for (let i = 0; i < name2.length; i++) score2 += name2.charCodeAt(i);
            let diff = Math.abs(score1 - score2);
            compatibilityScore = (100 - (diff % 100));
            compatibilityScore = Math.max(30, compatibilityScore);
            displayResult(compatibilityScore, scoreDisplay, messageDisplay);
        }
    }, 5000);
}

function displayResult(compatibilityScore, scoreDisplay, messageDisplay) {
    let message;
    if (compatibilityScore === 100) message = messages['100'];
    else if (compatibilityScore >= 95) message = messages['95'];
    else if (compatibilityScore >= 90) message = messages['90'];
    else if (compatibilityScore >= 80) message = messages['80'];
    else if (compatibilityScore >= 70) message = messages['70'];
    else if (compatibilityScore >= 60) message = messages['60'];
    else if (compatibilityScore >= 50) message = messages['50'];
    else if (compatibilityScore >= 40) message = messages['40'];
    else message = messages['30'];

    countUp(scoreDisplay, compatibilityScore, () => {
        if (compatibilityScore === 100) {
            scoreDisplay.classList.add('sparkle-super-on');
            createExplosiveConfetti(scoreDisplay, 250);
            createFlashParticles(scoreDisplay, 50);
            createStars(100);
        } else if (compatibilityScore >= 95) {
            scoreDisplay.classList.add('sparkle-strong-on');
            createConfetti(100);
            createStars(50);
            createFlashParticles(scoreDisplay, 30);
        } else if (compatibilityScore >= 90) {
            scoreDisplay.classList.add('show-score');
            createStars(50);
            createConfetti(50);
        } else if (compatibilityScore >= 80) {
            scoreDisplay.classList.add('sparkle-mild-on');
            createStars(30);
        } else if (compatibilityScore >= 65) {
            scoreDisplay.classList.add('show-score');
            createLameConfetti(50);
        } else {
            scoreDisplay.classList.add('show-score');
        }

        typeWriter(messageDisplay, message, () => {
            messageDisplay.classList.add('fadeIn');
            document.getElementById('calculate-btn').disabled = false;
        });
    });
}

function countUp(element, endValue, callback) {
    let startValue = 0;
    console.debug(startValue);
    const duration = 2000;
    const startTime = Date.now();
    function animate() {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime) / duration);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(easedProgress * endValue);
        element.innerText = `${currentValue}점`;
        if (progress < 1) requestAnimationFrame(animate);
        else { element.innerText = `${endValue}점`; callback(); }
    }
    animate();
}

function typeWriter(element, text, callback) {
    let i = 0;
    element.innerText = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else {
            callback();
        }
    }
    type();
}

function createLameConfetti(count) {
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('lame-confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.animationDuration = `${EFFECT_DURATION / 1000}s`;
        confetti.style.background = '#d3d3d3';
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        body.appendChild(confetti);
        setTimeout(() => confetti.remove(), EFFECT_DURATION);
    }
}

function createExplosiveConfetti(element, count) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 300 + 150;
        confetti.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        confetti.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        confetti.style.left = `${rect.left + rect.width / 2}px`;
        confetti.style.top = `${rect.top + rect.height / 2}px`;
        confetti.style.animationDuration = `${EFFECT_DURATION / 1000}s`;
        confetti.style.animationDelay = `${Math.random() * 0.3}s`;
        body.appendChild(confetti);
        setTimeout(() => confetti.remove(), EFFECT_DURATION);
    }
}

function createStars(count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        const size = Math.random() * 8 + 7;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDuration = `${EFFECT_DURATION / 1000}s`;
        star.style.animationDelay = `${Math.random() * 1.5}s`;
        body.appendChild(star);
        setTimeout(() => star.remove(), EFFECT_DURATION);
    }
}

function createFlashParticles(element, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('flash-particle');
        const rect = element.getBoundingClientRect();
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 200 + 100;
        particle.style.left = `${rect.left + rect.width / 2 + Math.cos(angle) * distance}px`;
        particle.style.top = `${rect.top + rect.height / 2 + Math.sin(angle) * distance}px`;
        particle.style.animationDuration = `1s`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
}
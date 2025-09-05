// fabricate_script.js
document.addEventListener('DOMContentLoaded', () => {
    setInputValueFromUrl("name1");
    setInputValueFromUrl("name2");
    addFixedScoresFromUrl();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auto-run') === 'true') calculateCompatibility();
});

let fixedScores = [];

document.getElementById('add-fixed-btn').addEventListener('click', addFixedScore);

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    renderSavedList();
}

function addFixedScoresFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const allNames1 = urlParams.getAll('fixed-name1');
    const allNames2 = urlParams.getAll('fixed-name2');
    const allScores = urlParams.getAll('fixed-score');

    if (allNames1.length !== allNames2.length || allNames1.length !== allScores.length) return;

    for (let i = 0; i < allNames1.length; i++) {
        const name1 = allNames1[i];
        const name2 = allNames2[i];
        const score = parseInt(allScores[i], 10);
        if (!name1 || !name2 || isNaN(score) || score < 0 || score > 100) continue;
        fixedScores.push({ name1, name2, score });
    }
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
        li.innerHTML = `<span>${item.name1} & ${item.name2}: ${item.score}점</span>
                        <button class="delete-btn" data-index="${index}">삭제</button>`;
        savedList.appendChild(li);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', e => deleteFixedScore(e.target.dataset.index));
    });
}

function deleteFixedScore(index) {
    fixedScores.splice(index, 1);
    renderSavedList();
}

const messages = {
    0: "음… 아직 서로 잘 모르는 상태네요. 😅",
    5: "조금 어색하지만 가능성은 있어요. 🤏",
    10: "서로에 대해 호기심은 있지만 아직 멀었네요. 🧐",
    15: "작은 대화가 필요합니다. 💬",
    20: "조금씩 친해지는 중이에요. 🌱",
    25: "서로를 관찰하고 이해하려는 노력이 필요해요. 👀",
    30: "운명의 장난일까요? 😉",
    35: "서로 조금씩 마음이 통하는 중이에요. 💌",
    40: "서로의 다름을 인정하는 노력이 필요합니다. 🔑",
    45: "서로의 장점과 단점을 이해할 때입니다. ⚖️",
    50: "알아갈 시간이 조금 필요해요. ☕️",
    55: "관계가 조금씩 깊어지고 있어요. 🌸",
    60: "노력하면 더 좋아질 수 있는 사이! 🤝",
    65: "조금씩 신뢰가 쌓이는 중입니다. ✨",
    70: "서로에게 좋은 영향을 주는 사이네요. 👍",
    75: "함께라서 즐거운 관계예요. 😄",
    80: "긍정적인 기운이 넘치는 관계! 😊",
    85: "서로의 장점을 충분히 느끼고 있어요. 🌈",
    90: "환상의 조합! 💑",
    95: "영혼의 단짝, 찰떡궁합! ✨",
    100: "천생연분, 100% 운명적인 사랑입니다! ❤️🎉"
};

function getMessageByScore(score) {
    const rounded = Math.floor(score / 5) * 5;
    return messages[rounded] || messages[0];
}

function setInputValueFromUrl(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    const input = document.getElementById(paramName);
    if (input && urlParams.has(paramName)) input.value = urlParams.get(paramName);
}

function calculateCompatibility() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    const scoreDisplay = document.getElementById('score-display');
    const messageDisplay = document.getElementById('message-display');
    const loadingState = document.getElementById('loading-state');
    const btn = document.getElementById('calculate-btn');

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
    btn.disabled = true;

    setTimeout(() => {
        loadingState.style.display = 'none';

        // fixedScore 우선 적용
        const fixed = fixedScores.find(rule =>
            (rule.name1 === name1 && rule.name2 === name2) ||
            (rule.name1 === name2 && rule.name2 === name1)
        );

        let score;
        if (fixed) {
            score = fixed.score;
        } else {
            // 랜덤 제거, 항상 동일 계산
            const sum1 = [...name1].reduce((a, c) => a + c.charCodeAt(0), 0);
            const sum2 = [...name2].reduce((a, c) => a + c.charCodeAt(0), 0);
            score = 100 - (Math.abs(sum1 - sum2) % 100);
            score = Math.max(30, score);
        }
        displayResult(score, scoreDisplay, messageDisplay);
    }, 1000);
}


function countUp(element, endValue, callback) {
    const duration = 2000;
    const startTime = Date.now();
    function animate() {
        const now = Date.now();
        const progress = Math.min(1, (now - startTime)/duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.floor(eased * endValue);
        element.innerText = `${val}점`;
        if(progress < 1) requestAnimationFrame(animate);
        else { element.innerText = `${endValue}점`; callback(); }
    }
    animate();
}

function typeWriter(el, text, cb) {
    let i = 0;
    el.innerText = '';
    function type() {
        if(i < text.length) {
            el.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        } else cb();
    }
    type();
}

function displayResult(score, scoreDisplay, messageDisplay) {
    const message = getMessageByScore(score);

    countUp(scoreDisplay, score, () => {
        scoreDisplay.classList.add('show-score');

        // ==================== 효과 목록 ====================
        const effectsList = [
            effectExplosiveConfetti, effectSideBursts, effectFireParticles, effectSnowflakes,
            effectHearts, effectGlitter, effectStars, effectRibbons, effectLaserBeams, effectBubbles,
            effectDiamonds, effectWaveParticles, effectNeonCircles, effectFireworks, effectRocket,
            effectRainbowFireworks, effectNeonFireworks, effectGalaxy, effectSparks, effectSnow
        ];

        // 점수에 따른 실행할 효과 개수 결정
        let effectCount;
        if (score <= 40) effectCount = 0;
        else if (score <= 70) effectCount = 1;
        else if (score <= 90) effectCount = 2;
        else if (score <= 95) effectCount = 3;
        else if (score <= 99) effectCount = 4;
        else effectCount = 5;

        // 중복 없이 랜덤 선택
        const chosenEffects = [];
        const effectsCopy = [...effectsList];
        for (let i = 0; i < effectCount; i++) {
            const idx = Math.floor(Math.random() * effectsCopy.length);
            chosenEffects.push(effectsCopy[idx]);
            effectsCopy.splice(idx, 1); // 이미 선택된 효과 제거
        }

        // ==================== 선택된 효과 통합 ====================
        const combinedParticles = [];
        const combinedEmitters = [];

        chosenEffects.forEach(fn => {
            const { particles, emitters } = fn(true); // true를 전달해서 config만 반환하도록 수정
            if (particles) combinedParticles.push(particles);
            if (emitters) combinedEmitters.push(...emitters);
        });

        if (combinedParticles.length || combinedEmitters.length) {
            tsParticles.load("tsparticles", {
                particles: combinedParticles,
                emitters: combinedEmitters
            });
        }

        // 메시지 출력
        typeWriter(messageDisplay, message, () => {
            messageDisplay.classList.add('fadeIn');
            document.getElementById('calculate-btn').disabled = false;
        });
    });
}


// ==================== 20개 효과 (returnConfig 지원) ====================

// 1. 폭죽 대폭발
function effectExplosiveConfetti(returnConfig = false) {
    const config = {
        particles: { number: { value: 200 }, color: { value: ["#ff0","#f00","#0ff"] }, shape: { type: "circle" }, move: { speed: 12, outModes: "destroy" } },
        emitters: [{ position: { x: "50%", y: "50%" }, rate: { quantity: 200, delay: 0 } }]
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 2. 좌우 연속 폭죽
function effectSideBursts(returnConfig = false) {
    const emitters = ["10%", "90%"].map(pos => ({
        position: { x: pos, y: "60%" },
        rate: { quantity: 30, delay: 0 }
    }));
    const config = {
        particles: { number: { value: 30 }, color: { value: ["#ff0","#0f0","#00f"] }, shape: { type: "circle" }, move: { speed: 8, outModes: "destroy" } },
        emitters
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 3. 단일 불꽃
function effectFireParticles(returnConfig = false) {
    const config = {
        particles: { number: { value: 50 }, color: { value: ["#ff0000","#ff6600"] }, shape: { type: "circle" }, move: { speed: 8, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 4. 눈송이
function effectSnowflakes(returnConfig = false) {
    const config = {
        particles: { number: { value: 100 }, color: { value: "#fff" }, shape: { type: "circle" }, move: { speed: 2, outModes: "destroy" } },
        emitters: [{ position: { x: "50%", y: "0%" }, rate: { quantity: 100, delay: 0 } }]
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 5. 하트
function effectHearts(returnConfig = false) {
    const config = {
        particles: { number: { value: 80 }, color: { value: ["#ff0077","#ff66aa"] }, shape: { type: "char", character: { value: ["❤"] } }, move: { speed: 5, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 6. 반짝이
function effectGlitter(returnConfig = false) {
    const config = {
        particles: { number: { value: 200 }, color: { value: ["#fff","#ff0","#f0f"] }, shape: { type: "circle" }, move: { speed: 6, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 7. 별
function effectStars(returnConfig = false) {
    const config = {
        particles: { number: { value: 80 }, color: { value: ["#ffff00","#ffdd00"] }, shape: { type: "star" }, move: { speed: 5, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 8. 리본
function effectRibbons(returnConfig = false) {
    const config = {
        particles: { number: { value: 60 }, color: { value: ["#ff69b4","#00f","#0f0"] }, shape: { type: "polygon", sides: 4 }, move: { speed: 4, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 9. 레이저
function effectLaserBeams(returnConfig = false) {
    const config = {
        particles: { number: { value: 120 }, color: { value: ["#ff0","#0ff","#f0f"] }, shape: { type: "circle" }, move: { speed: 12, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 10. 버블
function effectBubbles(returnConfig = false) {
    const config = {
        particles: { number: { value: 70 }, color: { value: ["#aaf","#fff"] }, shape: { type: "circle" }, move: { speed: 2, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 11. 다이아몬드
function effectDiamonds(returnConfig = false) {
    const config = {
        particles: { number: { value: 60 }, color: { value: ["#0ff","#0aa","#0f0"] }, shape: { type: "polygon", sides: 4 }, move: { speed: 5, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 12. 웨이브 입자
function effectWaveParticles(returnConfig = false) {
    const config = {
        particles: { number: { value: 90 }, color: { value: ["#ff0","#f0f","#0ff"] }, shape: { type: "circle" }, move: { speed: 8, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 13. 네온 원
function effectNeonCircles(returnConfig = false) {
    const config = {
        particles: { number: { value: 80 }, color: { value: ["#0ff","#f0f"] }, shape: { type: "circle" }, move: { speed: 6, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 14. 폭죽+별
function effectFireworks(returnConfig = false) {
    if (returnConfig) {
        return {
            particles: { number: { value: 280 }, color: { value: ["#ff0","#f00","#0ff","#ffff00","#ffdd00"] }, shape: { type: "circle" }, move: { speed: 12, outModes: "destroy" } },
            emitters: [{ position: { x: "50%", y: "50%" }, rate: { quantity: 280, delay: 0 } }]
        };
    }
    effectExplosiveConfetti();
    effectStars();
}

// 15. 로켓
function effectRocket(returnConfig = false) {
    const config = {
        particles: { number: { value: 50 }, color: { value: ["#ff0","#f00"] }, shape: { type: "circle" }, move: { speed: 10, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 16. 레인보우 폭죽
function effectRainbowFireworks(returnConfig = false) {
    const config = {
        particles: { number: { value: 120 }, color: { value: ["#f00","#ff0","#0f0","#0ff","#00f","#f0f"] }, shape: { type: "circle" }, move: { speed: 10, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 17. 네온 폭죽
function effectNeonFireworks(returnConfig = false) {
    const config = {
        particles: { number: { value: 100 }, color: { value: ["#0ff","#f0f","#ff0"] }, shape: { type: "circle" }, move: { speed: 12, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 18. 갤럭시
function effectGalaxy(returnConfig = false) {
    const config = {
        particles: { number: { value: 80 }, color: { value: ["#000","#555","#fff"] }, shape: { type: "circle" }, move: { speed: 4, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 19. 스파크
function effectSparks(returnConfig = false) {
    const config = {
        particles: { number: { value: 100 }, color: { value: ["#ff0","#fff","#f00"] }, shape: { type: "circle" }, move: { speed: 15, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

// 20. 눈
function effectSnow(returnConfig = false) {
    const config = {
        particles: { number: { value: 100 }, color: { value: "#fff" }, shape: { type: "circle" }, move: { speed: 3, outModes: "destroy" } }
    };
    if (returnConfig) return config;
    tsParticles.load("tsparticles", config);
}

const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.4.0/dist/confetti.browser.min.js';
document.head.appendChild(script);

// 페이지 로드 후 실행
script.onload = () => {
    // 폭죽 효과 함수
    function shootConfetti() {
        confetti({
            particleCount: 150,
            spread: 120,
            origin: { y: 0.6 }
        });
    }

    // 페이지 접속 시 폭죽 발사
    setTimeout(shootConfetti, 500); // 0.5초 후
    setTimeout(shootConfetti, 1000); // 1.0초 후
    setTimeout(shootConfetti, 1500); // 1.5초 후
    setTimeout(shootConfetti, 2000); // 2.0초 후
    setTimeout(shootConfetti, 2500); // 2.5초 후
    setTimeout(shootConfetti, 3000); // 3.0초 후
};


const messageContainer = document.querySelector('.message');
const messageLines = messageContainer.querySelectorAll('p');
const messageLines_small = messageContainer.querySelectorAll('small');
const messageLines_a = messageContainer.querySelectorAll('a');
const allMessageLines = [...messageLines, ...messageLines_small, ...messageLines_a];
function checkVisibility() {
    const containerTop = messageContainer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (containerTop < windowHeight * 0.75) {
        allMessageLines.forEach((line, index) => {
            setTimeout(() => {
                line.classList.add('visible');
            }, index * 200); // 각 줄마다 0.2초씩 딜레이를 줍니다.
        });
        window.removeEventListener('scroll', checkVisibility);
    }
}

window.addEventListener('scroll', checkVisibility);
checkVisibility(); // 페이지 로드 시에도 한 번 확인
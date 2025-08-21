// 스크롤 시 요소를 나타나게 하는 JavaScript
const hobbyItems = document.querySelectorAll('.hobby-item');

const showOnScroll = () => {
    hobbyItems.forEach(item => {
        const itemTop = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // 요소가 화면의 특정 부분에 진입하면 'visible' 클래스 추가
        if (itemTop < windowHeight - 150) {
            item.classList.add('visible');
        }
    });
};

// 페이지 로드 시 한 번 실행
showOnScroll();

// 스크롤 이벤트에 함수 연결
window.addEventListener('scroll', showOnScroll);
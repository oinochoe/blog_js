async function main() {
    // 버튼에 이벤트 연결
    bindButton('#form-add-book', 'submit', save);

    // 토큰  체크
    checkToken(token);

    // 토큰으로 서버에서 나의 정보 받아오기
    checkUser(user);
}

document.addEventListener('DOMContentLoaded', main);

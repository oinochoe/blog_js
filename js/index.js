async function main() {
    const books = await getBooks(token);

    // 버튼에 이벤트 연결
    bindButton('.js-logout', 'click', logout);

    // 토큰 체크
    checkToken(token);

    // 토큰으로 서버에서 나의 정보 받아오기
    checkUser(user);

    // 나의 책을 서버에서 받아오기
    checkBook(books);

    // 받아온 책을 그리기
    renderList(books);
}

// dom 로드 되면 main 실행
document.addEventListener('DOMContentLoaded', main);

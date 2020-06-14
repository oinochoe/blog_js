async function main() {
    // 브라우저에서 id 가져오기
    // 책을 서버에서 받아오기
    const bookId = new URL(location.href).searchParams.get('id');
    const book = await getBook(bookId);
    // 버튼에 이벤트 연결
    bindButton('.js-logout', 'click', logout);
    // 토큰 체크
    checkToken(token);
    // 토큰으로 서버에서 나의 정보 받아오기
    checkUser(user);
    // 책을 서버에서 받아온 게 있는지 체크
    if (book === null) {
        alert('서버에서 책 가져오기 실패');
        return;
    }
    // 받아온 책 그리기
    renderView(book);
}

document.addEventListener('DOMContentLoaded', main);

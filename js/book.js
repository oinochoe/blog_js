function getToken() {
    return localStorage.getItem('token');
}
async function getUserByToken(token) {
    try {
        const res = await axios.get('https://api.marktube.tv/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getUserBytoken error', error);
        return null;
    }
}

async function getBook(bookId) {
    const token = getToken();
    if (token === null) {
        location.assign('/login.html');
        return null;
    }
    try {
        const res = await axios.get(`https://api.marktube.tv/v1/book/${bookId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getbook error', error);
        return null;
    }
}

async function logout() {
    const token = getToken();
    if (token === null) {
        location.assign('/login.html');
        return;
    }
    try {
        await axios.delete('https://api.marktube.tv/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.log('logout error', error);
    } finally {
        localStorage.clear();
        location.assign('/login.html');
    }
}

function bindLogoutButton() {
    const btnLogout = document.querySelector('#btn_logout');
    btnLogout.addEventListener('click', logout);
}

async function main() {
    // 버튼에 이벤트 연결
    bindLogoutButton();
    // 브라우저에서 id 가져오기
    const bookId = new URL(location.href).searchParams.get('id');
    // 토큰 체크
    const token = getToken();
    if (token === null) {
        location.href = '/login.html';
        return;
    }
    // 토큰으로 서버에서 나의 정보 받아오기
    const user = await getUserByToken(token);
    if (user === null) {
        localStorage.clear();
        location.href = '/login.html';
        return;
    }
    // 책을 서버에서 받아오기
    const book = await getBook(bookId);
    if (book === null) {
        alert('서버에서 책 가져오기 실패');
        return;
    }
    // 받아온 책 그리기
    console.log(book);
}

document.addEventListener('DOMContentLoaded', main);

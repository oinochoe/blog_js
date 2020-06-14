function getToken() {
    return localStorage.getItem('token');
}

async function getUserByToken(token) {
    try {
        const res = await axios.get(`https://api.marktube.tv/v1/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('GetUserByToekn function error', error);
    }
}

async function getBook(bookId) {
    const token = getToken();
    if (token === null) {
        location.href = './login.html';
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
        console.log('getbook error', erorr);
        return null;
    }
}

async function updateBook(bookId) {
    const titleElement = document.querySelector('#title');
    const messageElement = document.querySelector('#message');
    const authorElement = document.querySelector('#author');
    const urlElement = document.querySelector('#url');

    const title = titleElement.value;
    const message = messageElement.value;
    const author = authorElement.value;
    const url = urlElement.value;

    if (title === '' || message === '' || author === '' || url === '') {
        return;
    }

    const token = getToken();
    if (token === null) {
        location = '/login.html';
        return;
    }

    await axios.patch(
        `https://api.marktube.tv/v1/book/${bookId}`,
        {
            title,
            message,
            author,
            url,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );
}

function render(book) {
    const titleElement = document.querySelector('#title');
    titleElement.value = book.title;

    const messageElement = document.querySelector('#message');
    messageElement.value = book.message;

    const authorElement = document.querySelector('#author');
    authorElement.value = book.author;

    const urlElement = document.querySelector('#url');
    urlElement.value = book.url;

    const form = document.querySelector('#form-edit-book');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.target.classList.add('was-validated');

        try {
            await updateBook(book.bookId);
            location.href = `book.html?id=${book.bookId}`;
        } catch (error) {
            console.log(error);
        }
    });

    const cancelButtonElement = document.querySelector('#btn-cancel');
    cancelButtonElement.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        location.href = `book.html?id=${book.bookId}`;
    });
}

async function main() {
    // 브라우저에서 id 가져오기
    const bookId = new URL(location.href).searchParams.get('id');
    // 토큰 체크
    const token = getToken();
    if (token === null) {
        location.href = './login.html';
        return;
    }
    // 토큰으로 서버에서 나의 정보 받아오기
    const user = await getUserByToken(token);
    if (user === null) {
        localStorage.clear();
        location.href = './login.html';
        return;
    }
    // 책을 서버에서 받아오기
    const book = await getBook(bookId);
    if (book === null) {
        alert('서버에서 책 가져오기 실패');
        return;
    }
    // 받아온 책을 그리기
    render(book);
}

document.addEventListener('DOMContentLoaded', main);

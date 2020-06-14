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

    checkToken(token);

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

function renderEdit(book) {
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
            location.href = `book?id=${book.bookId}`;
        } catch (error) {
            console.log(error);
        }
    });

    const cancelButtonElement = document.querySelector('#btn-cancel');
    cancelButtonElement.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        location.href = `book?id=${book.bookId}`;
    });
}

async function main() {
    // 브라우저에서 id 가져오기
    // 책을 서버에서 받아오기
    const bookId = new URL(location.href).searchParams.get('id');
    const book = await getBook(bookId);
    // 토큰 체크
    checkToken(token);
    // 토큰으로 서버에서 나의 정보 받아오기
    checkUser(user);
    // 책을 서버에서 받아온 게 있는지 체크
    if (book === null) {
        alert('서버에서 책 가져오기 실패');
        return;
    }
    // 받아온 책을 그리기
    renderEdit(book);
}

document.addEventListener('DOMContentLoaded', main);

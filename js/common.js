const token = getToken();
const user = getUserByToken(token);

// 토큰 가져오기
function getToken() {
    return localStorage.getItem('token');
}

// 토큰 체크하기
function checkToken(token) {
    if (token === null) {
        location.assign('/login');
        return;
    }
}

// user 정보 토큰으로 가져오기
async function getUserByToken(token) {
    try {
        const res = await axios.get('https://api.marktube.tv/v1/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getUserByToken error', error);
        return null;
    }
}

// user 정보 체크하기
function checkUser(user) {
    if (user === null) {
        localStorage.clear();
        location.assign('/login');
        return;
    }
}

// 로그아웃
async function logout() {
    checkToken(token);
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
        location.assign('/login');
    }
}

// 책 가져오기
async function getBooks(token) {
    try {
        const res = await axios.get('https://api.marktube.tv/v1/book', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log('getBooks error', error);
        return null;
    }
}

// 책 한개 가져오기
async function getBook(bookId) {
    checkToken(token);
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

// 북정보 체크하기
function checkBook(books) {
    if (books === null) {
        return;
    }
}

// 책 지우기
async function deleteBook(bookId) {
    checkToken(token);
    await axios.delete(`https://api.marktube.tv/v1/book/${bookId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return;
}

// 책 그리기
function renderList(books) {
    const listElement = document.querySelector('#list');
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const bookElement = document.createElement('div');
        bookElement.classList.value = 'col-md-4';
        bookElement.innerHTML = `
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <p class="card-text">${book.title === '' ? '제목 없음' : book.title}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <a href="/book?id=${book.bookId}"
                class="btn btn-sm btn-outline-secondary"
              >
                View
            </a>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary js-delete"
              data-book-id="${book.bookId}"
            >
              Delete
            </button>
          </div>
          <small class="text-muted">${new Date(book.createdAt).toLocaleString()}</small>
        </div>
      </div>
    </div>
    `;
        listElement.append(bookElement);
    }

    document.querySelectorAll('.js-delete').forEach(($elm) => {
        $elm.addEventListener('click', async (event) => {
            const bookId = event.target.dataset.bookId;
            try {
                await deleteBook(bookId);
                location.reload();
            } catch (error) {
                console.log(error);
            }
        });
    });
}

// 책 보기 페이지 그리기
function renderView(book) {
    const detailElement = document.querySelector('#detail');

    detailElement.innerHTML = `<div class="card bg-light w-100">
        <div class="card-header"><h4>${book.title}</h4></div>
        <div class="card-body">
        <h5 class="card-title">"${book.message}"</h5>
        <p class="card-text">글쓴이 : ${book.author}</p>
        <p class="card-text">링크 : <a href="${book.url}" target="_BLANK">바로 가기</a></p>
        <a href="/edit?id=${book.bookId}" class="btn btn-primary btn-sm">Edit</a>
        <button type="button" class="btn btn-danger btn-sm" id="btn-delete">Delete</button>
        </div>
        <div class="card-footer">
            <small class="text-muted">작성일 : ${new Date(book.createdAt).toLocaleString()}</small>
        </div>
    </div>`;

    document.querySelector('#btn-delete').addEventListener('click', async () => {
        try {
            await deleteBook(book.bookId);
            location.href = '/';
        } catch (error) {
            console.log(error);
        }
    });
}

// 책 저장하기
async function save(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('save');
    event.target.classList.add('was-validated');

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

    try {
        const res = await axios.post(
            'https://api.marktube.tv/v1/book',
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
        location.assign('/');
    } catch (error) {
        console.log('save error', error);
        alert('책 추가 실패');
    }
}

// 버튼 공통 바인딩
function bindButton($elm, eventType, func) {
    const element = document.querySelector($elm);
    element.addEventListener(eventType, func);
}

const btnHam = document.querySelector('.ham');
const nav = document.querySelector('header > nav');
const newsBoard = document.querySelector('.listCon');
let newsList = [];

btnHam.addEventListener('click', () => {
  nav.classList.toggle('on');
});

// const API_KEY = 'a8097d8ff3aa45249ab0a6a418b3b5c8';
const API_KEY = '5e45fd8aa39a4017a0ab6d77dd1c2e5e';
// const API_KEY = '오류키';

// pagination
let totalResults = 0;
let pageSize = 6;
let page = 1;
let groupSize = 5;

const moveToPage = (pageNum, category) => {
  // console.log('moveToPage check', pageNum);
  page = pageNum;
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?s&apiKey=${API_KEY}&category=${category}`
  );
  // console.log(url);
  fetchNews(url, category);
};

const pagination = (category) => {
  let pageGroup = Math.ceil(page / groupSize);
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  );
  let firstPage = (pageGroup - 1) * groupSize + 1;

  let paginationHtml = `<button class="prev"><i class="fa-solid fa-caret-left"></i></button>`;
  // for(let i = 처음 페이지 숫자; i<=마지막 페이지 숫자; i++){
  // pagination += `<button>${i}</button>`
  // }
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += `<button class="${
      i == page ? 'on' : ''
    }" onclick="moveToPage(${i}, '${category}')">${i}</button>`;
  }
  paginationHtml += `<button class="next"><i class="fa-solid fa-caret-right"></i></button>`;

  document.querySelector('.pgCon').innerHTML = paginationHtml;
};

const errorRender = (message) => {
  const errorHtml = `<li class="noList">ERROR (((╹д╹;)))!!! ${message}</li>`;
  newsBoard.innerHTML = errorHtml;
};

const fetchNews = async (url, category = 'general') => {
  try {
    url.searchParams.append('pageSize', pageSize);
    url.searchParams.append('page', page);
    url.searchParams.append('category', category);
    url.searchParams.append('country', 'kr');

    const response = await fetch(url);
    const data = await response.json();
    // console.log(url);
    totalResults = data.totalResults;
    // console.log(totalResults);

    if (response.status !== 200) {
      throw new Error(data.message);
    }

    newsList = data.articles;
    renderNews(newsList);
    pagination(category);
  } catch (error) {
    errorRender(error.message);
  }
};

const btnSearch = document.querySelector('.btnSearch');
const searchInput = document.querySelector('.inputArea input');

const fnSearch = () => {
  const searchWord = searchInput.value;
  searchInput.value = '';
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?q=${searchWord}&pageSize=${pageSize}&apiKey=${API_KEY}`
  );
  fetchNews(url);
};

btnSearch.addEventListener('click', async () => {
  fnSearch();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key !== 'Enter') return;
  fnSearch();
});

const getNewsByCate = async (category) => {
  page = 1;
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}`
  );
  fetchNews(url, category);
};

nav.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  let category = e.target.dataset.cate;

  getNewsByCate(category);
});

const createHtml = (news) => {
  let urlToImage = news.urlToImage ? news.urlToImage : '../img/noImg.png';
  let title = news.title || '제목없음';
  let description = news.description
    ? news.description.length > 100
      ? news.description.substring(0, 100) + '...'
      : news.description
    : '내용 없음';
  let source = news.source ? news.source.name || '출처없음' : '출처없음';
  let author = news.author || '작성자없음';
  let publishedAt = news.publishedAt
    ? new Date(news.publishedAt).toISOString().slice(0, 10)
    : '';

  return `
    <li>
      <div class="newsImg">
        <img
          src="${urlToImage}"
          alt="${title}"
          onerror="this.onerror=null; this.src= '../img/noImg.png'"
        />
      </div>
      <p class="newsTitle">${title}</p>
      <p class="desc">${description}</p>
      <span class="source">${source} / ${author}</span>
      <span class="date">${publishedAt}</span>
      <a
        href="${news.url}"
        class="more"
        >자세히보기</a
      >
    </li>
  `;
};

const renderNews = (newsList) => {
  if (newsList.length == 0) {
    newsBoard.innerHTML = `<li class="noList">검색 결과가 없습니다.</li>`;
    return;
  }
  const newsHtml = newsList.map((news) => createHtml(news)).join('');
  document.querySelector('.listCon').innerHTML = newsHtml;
};

const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?&apiKey=${API_KEY}`
  );
  fetchNews(url);
};

getLatestNews();

const btnHam = document.querySelector('.ham');
const nav = document.querySelector('header > nav');

btnHam.addEventListener('click', () => {
  nav.classList.toggle('on');
});

const API_KEY = 'a8097d8ff3aa45249ab0a6a418b3b5c8';

const fetchNews = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  let newsList = data.articles;
  renderNews(newsList);
};

const btnSearch = document.querySelector('.btnSearch');
const searchInput = document.querySelector('.inputArea input');

const fnSearch = () => {
  const searchWord = searchInput.value;
  searchInput.value = '';
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${searchWord}&pageSize=6&apiKey=${API_KEY}`
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
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&pageSize=6&apiKey=${API_KEY}`
  );
  fetchNews(url);
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
  const newsHtml = newsList.map((news) => createHtml(news)).join('');
  document.querySelector('.listCon').innerHTML = newsHtml;
};

const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&pageSize=6&apiKey=${API_KEY}`
  );
  fetchNews(url);
};

getLatestNews();

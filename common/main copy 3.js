const btnHam = document.querySelector('.ham');
const nav = document.querySelector('header > nav');

btnHam.addEventListener('click', () => {
  nav.classList.toggle('on');
});

// api
const API_KEY = 'a8097d8ff3aa45249ab0a6a418b3b5c8';
const getLatestNews = async () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&pageSize=100&apiKey=${API_KEY}`
  );
  const response = await fetch(url);
  const data = await response.json();
  let newsList = data.articles;

  // html 만들어서 화면에 뿌리기
  // 뉴스 렌더링
  renderNews(newsList);
};

// 이미지가 null 이면 ../img/noImg.png
// news.publishedAt 정보를 2024-04-17 형식으로 변경
// news.description 정보의 글자수가 100자 이상이면 100자까지만 보여주고 뒤에 ... 표시
// news.source 와 news.source.name 이 없으면 '출처 없음'
// news.title이 없으면 '제목 없음'
// news.author 정보가 없으면 '작성자 없음'

const createHtml = (news) => {
  let urlToImage = news.urlToImage || '../img/noImg.png';

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
getLatestNews();

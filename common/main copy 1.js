const btnHam = document.querySelector('.ham');
const nav = document.querySelector('header > nav');

btnHam.addEventListener('click', () => {
  nav.classList.toggle('on');
});

// api
const API_KEY = 'a8097d8ff3aa45249ab0a6a418b3b5c8';
const getLatestNews = () => {
  const url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&pageSize=6&apiKey=${API_KEY}`
  );
  // console.log(url);
};
getLatestNews();

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import Article from './Article';
import TopArticle from './TopArticle';
import styles from '../styles/Home.module.css';

function Home() {
  const bookmarks = useSelector((state) => state.bookmarks.value);
  const hiddenArticles = useSelector((state) => state.hiddenArticles.value);

  const [articlesData, setArticlesData] = useState([]);
  const [topArticle, setTopArticle] = useState({});

  useEffect(() => {
    fetch('https://morning-news-backend-chi.vercel.app/articles')
      .then(response => {
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }
      return response.json();
    })
      .then(data => {
        console.log('articles reçu:', data);
        if (data.articles && data.articles.length > 0) {
        setTopArticle(data.articles[0]);
        setArticlesData(data.articles.filter((data, i) => i > 0));
      }
      })
      .catch(error => {
        console.log('erreur lors du chargement des articles', error);
      });
  }, []);

  const filteredArticles = articlesData.filter((data) => !hiddenArticles.includes(data.title));
  const articles = filteredArticles.map((data, i) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.title === data.title);
    return <Article key={i} {...data} isBookmarked={isBookmarked} />;
  });

  let topArticles;
  if (Object.keys(topArticle).length > 0) {
    if (bookmarks.some(bookmark => bookmark.title === topArticle.title)) {
    topArticles = <TopArticle {...topArticle} isBookmarked={true} />
    } else {
    topArticles = <TopArticle {...topArticle} isBookmarked={false} />
    }
  } else {
  topArticles = <div>Chargement de l'article principal...</div>
    }

  return (
    <div>
      <Head>
        <title>Morning News - Home</title>
      </Head>
      {topArticles}
      <div className={styles.articlesContainer}>
        {articles}
      </div>
    </div>
  );
}

export default Home;

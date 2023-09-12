import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Trans, useTranslation } from 'react-i18next';

function App() {
  const [count, setCount] = useState(0);
  const { t, i18n } = useTranslation();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>{t('title')}</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          {t('button_text', { count })}
        </button>
        <p>
          <Trans t={t} i18nKey="description.part1" components={[<code key={0} />]} />
        </p>
      </div>
      <p className="read-the-docs">{t('description.part2')}</p>
      <div>
        <button type="button" onClick={() => i18n.changeLanguage('en')}>
          en
        </button>
        <button type="button" onClick={() => i18n.changeLanguage('de')}>
          de
        </button>
      </div>
    </>
  );
}

export default App;

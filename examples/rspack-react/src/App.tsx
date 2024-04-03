import { WithT } from 'i18next';
import { Component, useState } from 'react';
import { Trans, useTranslation, withTranslation } from 'react-i18next';
import reactLogo from './assets/react.svg';
import './App.css';

// use hoc for class based components
class LegacyWelcomeClass extends Component<WithT> {
  render() {
    const { t } = this.props;
    return <h1 className="App-header">{t('title')}</h1>;
  }
}
const Welcome = withTranslation()(LegacyWelcomeClass);

// Component using the Trans component
function MyComponent() {
  return (
    <Trans i18nKey="description.part1">
      To get started, edit <code>src/App.js</code> and save to reload.
    </Trans>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="App">
      <div>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="App-logo" alt="React logo" />
        </a>
      </div>
      <Welcome />
      <div className="App-intro">
        <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
        <p>
          <MyComponent />
        </p>
      </div>
      <button type="button" onClick={() => changeLanguage('de')}>
        de
      </button>
      <button type="button" onClick={() => changeLanguage('en')}>
        en
      </button>
      <p className="read-the-docs">{t('description.part2')}</p>
    </div>
  );
}

export default App;

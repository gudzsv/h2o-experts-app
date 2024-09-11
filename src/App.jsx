import IconSvg from 'components/IconSvg/IconSvg.jsx';
import { ToastContainer } from 'react-toastify';
import imgSrc from './assets/img/woman_aqua_track/woman_aqua_track_desktop_1x.webp';

function App() {
  return (
    <>
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        <button>count is</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <IconSvg width="22" height="22" iconName="icon-eye-off" />

        <img src={imgSrc} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ToastContainer />
    </>
  );
}

export default App;

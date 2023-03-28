import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import './App.css';
import Canvas from './components/Canvas';
import LeftMenu from './components/LeftMenu';
import { RootState } from './feature/store';
import { connectToAm } from './rtc/autoMerge/AMconnect';
import { listenToAmNodes } from './rtc/autoMerge/nodeWatcher';
import { connectToGun } from './rtc/gunDB/connect';
import listenToNodesInGun from './rtc/gunDB/nodeWatcherGun';
import { connectToWSAndYDoc } from './rtc/yjs/connectYJS';
import { listenToYJSNodes } from './rtc/yjs/nodeWatcher';

function App() {
  const rtcType = useSelector((state: RootState) => state.rtcType.rtc);
  useEffect(() => {
    switch (rtcType) {
      case 'YJS':
        connectToWSAndYDoc('project-1');
        listenToYJSNodes();
        break;
      case 'GUN':
        connectToGun();
        listenToNodesInGun();
        break;
      case 'AUTOMERGE':
        connectToAm();
        listenToAmNodes();
        break;
    }
  },[rtcType])
  return (
    <div className='app'>
      <LeftMenu />
      <Canvas />
    </div>
  );
}

export default App;
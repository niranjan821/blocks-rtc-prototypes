import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { addNodeInRedux, INode } from '../feature/nodes/nodesSlice';
import { addOrUpdateNodeInRTC } from '../rtc/yjs/nodeAction';
import './LeftMenu.css'
import { v4 as uuid } from 'uuid';
import { addOrUpdateNodeInGun } from '../rtc/gunDB/nodeActionGun';
import { setRtcType } from '../feature/rtcTypeSlice';
import { RootState } from '../feature/store';
import { addOrUpdateNode, deleteAllNodes } from '../utils/nodeAction';
import { addOrUpdateNodesInAm } from '../rtc/autoMerge/nodeAction';
export default function LeftMenu() {
  const dispatch = useDispatch();
  const seletedRtc = useSelector((state: RootState) => state.rtcType);
  const init = useRef(0);
  const handleClick = () => {
    const rectObj = {
            _id: uuid(),
            x: 10 + init.current,
            y: 10 + init.current,
            height: 100,
            width: 100,
            stroke: 'black',
            strokeWidth: 1,
            isVisible: true,
    };
    // dispatch(addNodeInRedux(rectObj));
    // addOrUpdateNodeInRTC(rectObj);
    // addOrUpdateNodeInGun(rectObj as INode);
    addOrUpdateNode(rectObj as INode, 'add');
    init.current += 10;
  }
  return (
    <div className="left-menu">
      <div className="rtc-types">
        <label>
          YSJ: <input type="radio" value="YJS" name="rtc-type" checked={seletedRtc.rtc === 'YJS'} onChange={(e: any)=> dispatch(setRtcType(e.target.value))}/>
        </label>
        <label>
          GUN: <input type="radio" value="GUN" name="rtc-type" checked={seletedRtc.rtc === 'GUN'} onChange={(e: any)=> dispatch(setRtcType(e.target.value))}/>
        </label>
        <label>
          AUTOMERGE: <input type="radio" value="AUTOMERGE" name="rtc-type" checked={seletedRtc.rtc === 'AUTOMERGE'} onChange={(e: any)=> dispatch(setRtcType(e.target.value))}/>
        </label>
      </div>
      <div className="square" onClick={handleClick} draggable="true"></div>
      <button className='delete-btn' onClick={()=> deleteAllNodes()}>Delete All</button>
    </div>
  )
}

import { DragEvent, useRef, useEffect, useState } from 'react';
import './canvas.css';
import { Stage, Layer } from 'react-konva'; 
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../feature/store';
import { addNodeInRedux, editNodeInRedux, INode } from '../feature/nodes/nodesSlice';
import { addOrUpdateNodeInGun, updateNodeInGun } from '../rtc/gunDB/nodeActionGun';
import { addOrUpdateNodesInAm } from '../rtc/autoMerge/nodeAction';
import { addOrUpdateNodeInRTC } from '../rtc/yjs/nodeAction';
import Rectangle from './Rectangle';
import Konva from 'konva';
import { v4 as uuid } from 'uuid';
import { addOrUpdateNode } from '../utils/nodeAction';

export type RectType = Konva.Rect | null;

export default function Canvas() {
    const containerRef = useRef<HTMLDivElement>(null);
    const layerRef = useRef<Konva.Layer>(null);

    const nodes = useSelector((state: RootState) => state.nodes.nodes);
    const dispatch = useDispatch();
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0
    })

    const [selectedId, selectShape] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<RectType>(null);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rectObj = {
            _id: uuid(),
            x: e.clientX - containerRef.current?.offsetLeft! - 50,
            y: e.clientY - 50,
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
        // addOrUpdateNodesInAm(rectObj as INode);
    }

    const checkDeselect = (e: any) => {
        // deselect when clicked on empty area
        window.removeEventListener('keydown', handleKeyDown, true);
        const clickedOnEmpty = e.target === e.target.getStage();
        if (clickedOnEmpty) {
            selectShape(null);
        }
    };

    const handleKeyDown = function (e: any) {
        window.removeEventListener('keydown', handleKeyDown, true);
        if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
            console.log(selectedId)
            const nodeToBeDel = nodes.find((node) => (node)._id === selectedId);
            if (nodeToBeDel && selectedNode && layerRef.current) {
                const node = { ...nodeToBeDel };
                node.isVisible = false;
                // dispatch(editNodeInRedux(node));
                // addOrUpdateNodeInRTC(node);
                // addOrUpdateNodeInGun(node);
                // const layer = layerRef.current;
                // selectedNode.destroy()
                // layer.draw();
                addOrUpdateNode(node as INode, 'delete')
                // addOrUpdateNodesInAm(node as INode);

                selectShape(null);
            }
        }
    }
    useEffect(() => {
        console.log('nodes', nodes);
        if (selectedId) {
            window.addEventListener('keydown', handleKeyDown, true);
        }
        return (window.removeEventListener('resize', () => { }), window.removeEventListener('keypress',()=>{}) );
    }, [selectedId, nodes]);

    useEffect(() => {
        const handleResize = function() {
            if (containerRef.current?.offsetHeight && containerRef.current?.offsetWidth) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                })
            }
        }
        window.addEventListener('resize', handleResize);
        handleResize();
    },[])

    return (
        <div ref={containerRef} className="canvas-container" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <Stage
                width={dimensions.width}
                height={dimensions.height}
                style={{ border: '1px solid black' }}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
            >
                <Layer ref={layerRef}>
                    {nodes.map((rect, i) => {
                        return <Rectangle
                                selectNode={setSelectedNode}
                                key={i}
                                shapeProps={rect}
                                isSelected={rect._id === selectedId}
                                onSelect={() => {
                                    selectShape(rect._id);
                                }}
                            onChange={(newAttrs: INode) => {
                                // dispatch(editNodeInRedux(newAttrs));
                                // addOrUpdateNodeInRTC(newAttrs);
                                // updateNodeInGun(newAttrs);
                                // addNodeInGun(newAttrs)
                                addOrUpdateNode(newAttrs as INode, 'update');
                                // addOrUpdateNodesInAm(newAttrs as INode)
                                }}
                            />
                        }
                    )}
                </Layer>
            </Stage>
        </div>
    )
}
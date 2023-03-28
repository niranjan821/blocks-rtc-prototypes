import { useEffect, useRef } from 'react';
import { INode } from '../feature/nodes/nodesSlice';
import { Rect, Transformer } from 'react-konva'; 
import Konva from 'konva';

type RectangleProp = {
    shapeProps: INode,
    isSelected: boolean,
    onSelect: any,
    onChange: Function,
    selectNode: any,
};

function Rectangle({ shapeProps, isSelected, onSelect, onChange, selectNode}: RectangleProp) {
    const tranRef = useRef<Konva.Transformer>(null);
    const shapeRef = useRef<Konva.Rect>(null);

    const handleClick = () => {
        onSelect();
        selectNode(shapeRef.current);
    }

    useEffect(() => {
    if (isSelected && tranRef.current && shapeRef.current) {
      // we need to attach transformer manually
      tranRef.current.nodes([shapeRef.current]);
        tranRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);
    return <>
        <Rect
            onClick={handleClick}
            onTap={handleClick}
            ref={shapeRef}
            {...shapeProps}
            id={shapeProps._id}
            draggable
            onDragEnd={(e) => {
                onChange({
                    ...shapeProps,
                    x: e.target.x(),
                    y: e.target.y(),
                });
            }}
            onTransformEnd={(e) => {
                // transformer is changing scale of the node
                // and NOT its width or height
                // but in the store we have only width and height
                // to match the data better we will reset scale on transform end
                if (shapeRef.current) {
                    const node = shapeRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
    
                    // we will reset it back
                    node.scaleX(1);
                    node.scaleY(1);
                    onChange({
                        ...shapeProps,
                        x: node.x(),
                        y: node.y(),
                        // set minimal value
                        width: Math.max(5, node.width() * scaleX),
                        height: Math.max(node.height() * scaleY),
                    });
                }
            }}
        />
        {
            isSelected && <Transformer
                ref={tranRef}
                boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width > 200) {
                        return oldBox;
                    }
                    return newBox;
                }}
            />
        }
    </>
}

export default Rectangle
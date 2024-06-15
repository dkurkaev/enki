import ReactFlow, {Controls, Background, MiniMap} from 'reactflow';
import 'reactflow/dist/style.css';

const nodes = [
    {
        id: '1', // required
        position: { x: 0, y: 0 }, // required
    },
];

function Flow() {
    return (
        <div style={{ height: '100%' }}>
            <ReactFlow
                nodes={nodes}
            >
                <Background />
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default Flow;
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default () => (
    <Popup
        trigger={<div className="menu-item"> Sub menu </div>}
        position="right top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{ padding: '0px', border: 'none' }}
        arrow={false}
    >
        <div className="menu">
            <h1 className="bg-blue-200 text-lg"> item 1</h1>
            <div className="menu-item"> item 2</div>
            <div className="menu-item"> item 3</div>
        </div>
    </Popup>
);
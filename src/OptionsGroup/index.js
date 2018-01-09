import React from 'react';
import Button from 'material-ui/Button';


import './style.css';


const OptionsGroup = ({ title, onReset, children, ...props}) => (
    <div {...props} className="options-group">
        <div className='options-header'>
            <h3>{title}</h3>
            <Button className='reset-button' raised onClick={onReset}>Reset</Button>
        </div>
        <div className="options-content">
            {children}
        </div>
    </div>
);

export default OptionsGroup;

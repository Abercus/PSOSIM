import React from 'react';
import Slider, { Handle, createSliderWithTooltip } from 'rc-slider';

import './style.css';

const TooltipSlider = createSliderWithTooltip(Slider);

const CustomSlider = ({ value, onChange, ...props}) => (
  <TooltipSlider className="range" value={value} onChange={onChange} {...props} />
);

export default CustomSlider;

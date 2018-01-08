import React from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Switch from 'material-ui/Switch';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';

import OptionsGroup from '../OptionsGroup';

import './style.css';


const unwrap = (handler, type=String) => (event) => handler(type(event.target.value));


const Options = ({
    particlesNumber,
    topology,
    omega,
    phiP,
    phiG,
    dimensions,
    optimasNumber,
    optimizationFunction,
    onParticlesNumberChange,
    onTopologyChange,
    onOmegaChange,
    onPhiPChange,
    onPhiGChange,
    onDimensionsChange,
    onOptimasNumberChange,
    onOptimizationFunctionChange,
    onResetSwarm,
    onResetFunction,
}) => (
    <Paper className='options'>
        <OptionsGroup title="Swarm" onReset={onResetSwarm}>
            <FormControl className='form-control'>
                <InputLabel htmlFor='particles-number'>Number of particles</InputLabel>
                <Input type='number' value={particlesNumber} onChange={unwrap(onParticlesNumberChange, Number)} />
            </FormControl>
            <FormControl className='form-control'>
                <InputLabel>Topology</InputLabel>
                <Select
                    value={topology}
                    onChange={unwrap(onTopologyChange)}
                >
                    <MenuItem value='global'>Global</MenuItem>
                    <MenuItem value='random'>Random adaptive</MenuItem>
                </Select>
            </FormControl>
            <div className='options-formula form-control'>
                <FormControl className='omega'>
                    <InputLabel htmlFor='omega'>ω</InputLabel>
                    <Input type='number' value={omega} onChange={unwrap(onOmegaChange, Number)}/>
                </FormControl>
                <FormControl className='phi_p'>
                    <InputLabel htmlFor='phi_p'>φ<sub>p</sub></InputLabel>
                    <Input type='number' value={phiP} onChange={unwrap(onPhiPChange, Number)}/>
                </FormControl>
                <FormControl className='phi_g'>
                    <InputLabel htmlFor='phi_g'>φ<sub>g</sub></InputLabel>
                    <Input type='number' value={phiG} onChange={unwrap(onPhiGChange, Number)} />
                </FormControl>
            </div>
        </OptionsGroup>
        <OptionsGroup title="Function" onReset={onResetFunction}>
            <span className="dimension-switch">
                <span>2D</span>
                <Switch
                    checked={dimensions === '3D'}
                    onChange={(_, value) => onDimensionsChange(value ? '3D' : '2D')}
                />
                <span>3D</span>
            </span>
            <FormControl className='form-control'>
                <InputLabel htmlFor='optimas-number'>Number of optimas</InputLabel>
                <Input type='number' value={optimasNumber} onChange={unwrap(onOptimasNumberChange, Number)} />
            </FormControl>
            <FormControl className='form-control' style={{ minWidth: 210 }}>
                <InputLabel>Optimization function</InputLabel>
                <Select
                    value={optimizationFunction}
                    onChange={unwrap(onOptimizationFunctionChange)}
                    autoWidth
                >
                    <MenuItem value='sphere'>Sphere</MenuItem>
                </Select>
            </FormControl>
        </OptionsGroup>
    </Paper>
);

export default Options;
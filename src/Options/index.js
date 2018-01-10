import React from 'react';
import { FormControl, FormLabel } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Switch from 'material-ui/Switch';
import { MenuItem } from 'material-ui/Menu';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import OptionsGroup from '../OptionsGroup';
import Slider from '../Slider';

import './style.css';

const unwrap = (handler, type=String) => (event) => handler(type(event.target.value));


const Options = ({
    particlesNumber,
    topology,
    omega,
    phiP,
    phiG,
    speed,
    optimizationFunction,
    playbackSpeed,
    landscapeOpacity,
    landscapeFlatness,
    onParticlesNumberChange,
    onTopologyChange,
    onOmegaChange,
    onPhiPChange,
    onPhiGChange,
    onSpeedChange,
    onOptimizationFunctionChange,
    onPlaybackSpeedChange,
    onLandscapeOpacityChange,
    onLandscapeFlatnessChange,
    onResetSwarm,
    onResetFunction,
    onResetVisualization,
    onSimulate,
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
                    <MenuItem value='ring'>Ring</MenuItem>
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
                <FormControl className='speed'>
                    <InputLabel htmlFor='speed'>max v</InputLabel>
                    <Input type='number' value={speed} onChange={unwrap(onSpeedChange, Number)} />
                </FormControl>
            </div>


            <Button className="simulate-btn" raised color="primary" onClick={onSimulate}>Simulate</Button>
        </OptionsGroup>
        <OptionsGroup title="Function" onReset={onResetFunction}>
            <FormControl className='form-control' style={{ minWidth: 210 }}>
                <InputLabel>Optimization function</InputLabel>
                <Select
                    value={optimizationFunction}
                    onChange={unwrap(onOptimizationFunctionChange)}
                    autoWidth
                >
                    <MenuItem value='ackley'>Ackley</MenuItem>
                    <MenuItem value='booth'>Booth</MenuItem>
                    <MenuItem value='matyas'>Matyas</MenuItem>
                    <MenuItem value='eggholder'>Eggholder</MenuItem>
                    <MenuItem value='himmelblau'>Himmelblau</MenuItem>
                    <MenuItem value='holder'>Hölders Table</MenuItem>
                    <MenuItem value='rastrigin'>Rastrigin</MenuItem>
                    <MenuItem value='sphere'>Sphere</MenuItem>
                    <MenuItem value='demo'>Demo</MenuItem>
                </Select>
            </FormControl>
        </OptionsGroup>
        <OptionsGroup title="Visualization" onReset={onResetVisualization}>
            <FormControl className='form-control'>
                <FormLabel>Playback Speed</FormLabel>
                <Slider min={1} max={60} value={playbackSpeed} onChange={onPlaybackSpeedChange}/>
            </FormControl>
            <FormControl className='form-control'>
                <FormLabel>Landscape Opacity</FormLabel>
                <Slider value={landscapeOpacity} onChange={onLandscapeOpacityChange}/>
            </FormControl>
            <FormControl className='form-control'>
                <FormLabel>Landscape Flatness</FormLabel>
                <Slider step={5} value={landscapeFlatness} onChange={onLandscapeFlatnessChange}/>
            </FormControl>
        </OptionsGroup>
    </Paper>
);

export default Options;

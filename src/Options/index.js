import React from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Switch from 'material-ui/Switch';
import Paper from 'material-ui/Paper';

import OptionsGroup from '../OptionsGroup';

import './style.css';


const Options = (props) => (
    <Paper className='options'>
        <OptionsGroup title="Swarm">
            <FormControl className='form-control'>
                <InputLabel htmlFor='particles-number'>Number of particles</InputLabel>
                <Input type='number' />
            </FormControl>
            <FormControl className='form-control'>
                <InputLabel htmlFor="topology-native">Topology</InputLabel>
                <Select
                    native
                    input={<Input id="topology-native" />}
                >
                    <option>Global</option>
                    <option>Random adaptive</option>
                </Select>
            </FormControl>
            <div className='options-formula form-control'>
                <FormControl className='omega'>
                    <InputLabel htmlFor='omega'>ω</InputLabel>
                    <Input type='number' />
                </FormControl>
                <FormControl className='phi_p'>
                    <InputLabel htmlFor='phi_p'>φ<sub>p</sub></InputLabel>
                    <Input type='number' />
                </FormControl>
                <FormControl className='phi_g'>
                    <InputLabel htmlFor='phi_g'>φ<sub>g</sub></InputLabel>
                    <Input type='number' />
                </FormControl>
            </div>
        </OptionsGroup>
        <OptionsGroup title="Function">
            <span class="dimension-switch">
                <span>2D</span>
                <Switch />
                <span>3D</span>
            </span>
            <FormControl className='form-control'>
                <InputLabel htmlFor='optimas-number'>Number of optimas</InputLabel>
                <Input type='number' />
            </FormControl>
            <FormControl className='form-control'>
                <InputLabel htmlFor="function-native">Optimization function</InputLabel>
                <Select
                    native
                    input={<Input id="function-native" />}
                >
                    <option>Rastrigin’s function</option>
                    <option>De Jong's function</option>
                    <option>Rosenbrock's valley</option>
                </Select>
            </FormControl>
        </OptionsGroup>
    </Paper>
);

export default Options;
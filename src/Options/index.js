import React from 'react';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';

import './style.css';


const Options = (props) => (
    <div {...props}>
        <Paper className='options'>
            <div className='options-header'>
                <h2>Swarm</h2>
                <Button className='reset-button' raised>Reset</Button>
            </div>
            <div>
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
            </div>
        </Paper>
    </div>
)

export default Options;
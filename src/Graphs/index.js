import React from 'react';
import Paper from 'material-ui/Paper';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Label, Text } from 'recharts';
import palette from 'google-palette';
import Button from 'material-ui/Button';

import './style.css';

const colors = palette('tol', 10)

console.log(colors);

const Graphs = ({ histories, onClear }) => {
  return (
    <Paper className="Graphs">
      <div className="graphs-header">
        <h4 className="graphs-title">Graphs</h4>
        <Button className="graphs-clear-btn" raised onClick={onClear}>Clear old</Button>
      </div>
      <ScatterChart width={400} height={200}>
        {histories.map(({ values, index }) => (
          <Scatter key={index} data={values.map(({ epoch, value }) => ({ x: epoch, y: value }))} line fill={`#${colors[index % 10]}`} />
        ))}
        <YAxis dataKey="y" name="Value" type="number" tickFormatter={Math.round}>
          <Label className="axis-label" angle={-90} value='Found optimum' position='insideLeft' style={{textAnchor: 'middle'}} />
        </YAxis>
        <XAxis dataKey="x" name="Epoch" type="number">
          <Label position="insideBottom" value="Epoch" className="axis-label" offset={-3}></Label>
        </XAxis>
        <ZAxis range={[100]}/>
        <Tooltip />
      </ScatterChart>
    </Paper>
  );
}

export default Graphs;

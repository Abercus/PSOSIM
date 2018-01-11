import React from 'react';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from 'material-ui/Dialog';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Button from 'material-ui/Button';

const ParametersDialog = ({ open, onClose, onOpenAlgorithm }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Parameters description</DialogTitle>
    <DialogContent>
      <DialogContentText>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Number of particles</TableCell>
              <TableCell>Size of the swarm</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Topology</TableCell>
              <TableCell>Defines the subset of particles with which each particle shares their local best with.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ω</TableCell>
              <TableCell>Previous velocity coefficient (inertia).</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>φ<sub>p</sub></TableCell>
              <TableCell>Coefficient (influence) of particle's personal best.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>φ<sub>g</sub></TableCell>
              <TableCell>Coefficient (influence) of particle's neighbourhood's (according to topology) best.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>max v</TableCell>
              <TableCell>Maximum velocity of a particle, after which the value is cut.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Optimization function</TableCell>
              <TableCell>One of the possible fitness landscapes for optimal value search. (See descriptions of functions <a href="https://l.messenger.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FTest_functions_for_optimization%23Test_functions_for_single-objective_optimization&h=ATMi8JaewAm9tRY_N0KPOKiCxqFV_yr_GfoFDMiYPIbdhGkd3MmCUW0Zb5q95JAbFQ1dNGfDD4MWJ3cZMC4bYrEheAf9OhsF5os0Q_66hENgU9LJhLkntHds3oLFx-qWme3RHg">here</a>).</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onOpenAlgorithm} color="primary">
        Read more about the algorithm
      </Button>
    </DialogActions>
  </Dialog>
);

export default ParametersDialog;

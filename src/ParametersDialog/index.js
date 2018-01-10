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
              <TableCell>The topology of the swarm defines the subset of particles with which each particle can exchange information.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ω</TableCell>
              <TableCell>Previous velocity coefficient</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>φ<sub>p</sub></TableCell>
              <TableCell>Particle best coefficient</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>φ<sub>g</sub></TableCell>
              <TableCell>Global (or group's) best coefficient</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>max v.</TableCell>
              <TableCell>Maximum velocity of a particle, after which the value is cut.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Optimization function</TableCell>
              <TableCell>One of the possible fitness landscapes for optimal value search</TableCell>
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

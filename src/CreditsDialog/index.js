import React from 'react';
import Dialog, {
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import './style.css';


const CreditsDialog = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">Credits</DialogTitle>
    <DialogContent>
      <DialogContentText>
        <div className="credits-authors">
            Made by
            <p><strong>Joonas Puura</strong>, <strong>Maksyim Semikin</strong> and <strong>Reelika Tõnisson</strong></p> for course <b>MTAT.03.238 Advanced Algorithmics</b>.
        </div>
        <div className="credits-imgs">
          <img src="images/ut_logo.png" alt="University of Tartu logo"></img>
          <img src="images/study_it.jpg" alt="StudyITinEE logo"></img>
        </div>
        <div className="credits-icons">
          Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>, licensed by&nbsp;
          <a href="http://creativecommons.org/licenses/by/3.0/" rel="noopener noreferrer" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
        </div>
      </DialogContentText>
    </DialogContent>
  </Dialog>
);

export default CreditsDialog;

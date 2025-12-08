import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

export interface AgreementActionMenuProps {
  agreementId: string;
  onApprove: (agreementId: string) => void;
  onDecline: (agreementId: string) => void;
}

const AgreementActionMenu: React.FC<AgreementActionMenuProps> = ({
  agreementId,
  onApprove,
  onDecline,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent row click when clicking menu
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent row click
    }
    setAnchorEl(null);
  };

  const handleApprove = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    onApprove(agreementId);
  };

  const handleDecline = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    onDecline(agreementId);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label="agreement actions"
        aria-controls={open ? 'agreement-actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="agreement-actions-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        MenuListProps={{
          'aria-labelledby': 'agreement-actions-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleApprove}>
          <ListItemIcon>
            <CheckCircleOutlineIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Approve</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDecline}>
          <ListItemIcon>
            <CancelOutlinedIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Decline</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default AgreementActionMenu;
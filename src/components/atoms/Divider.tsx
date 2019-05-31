import React from 'react';
import clsx from 'clsx';
import MuiDivider, {DividerProps} from '@material-ui/core/Divider';
import { DIVIDER } from '../../theme/core';

interface IDividerProps extends DividerProps{
  vertical?: boolean;
}

const Divider = ({ className, vertical, ...props }: IDividerProps) => (
  <MuiDivider className={clsx(DIVIDER.root, className, vertical && DIVIDER.vertical)} {...props} />
);

export default Divider;

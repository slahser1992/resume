import React from 'react';
import clsx from 'clsx';
import MuiIconButton, {IconButtonProps} from '@material-ui/core/IconButton';
import { ICON_BUTTON } from '../../theme/core';

interface IIconButtonProps extends IconButtonProps{
  shaded?: boolean;
  noPad?: boolean;
  narrowPad?: boolean;
  separated?: boolean;
  linkInverted?: boolean;
}

const IconButton = (
  {className, shaded, noPad, narrowPad, separated, linkInverted, ...props}: IIconButtonProps) => (
  <MuiIconButton
    className={clsx(
      ICON_BUTTON.root,
      className,
      shaded && ICON_BUTTON.shaded,
      noPad && ICON_BUTTON.noPad,
      narrowPad && ICON_BUTTON.narrowPad,
      separated && ICON_BUTTON.separated,
      linkInverted && ICON_BUTTON.linkInverted,
    )}
    {...props}
  />
);

export default IconButton;
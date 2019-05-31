import React from 'react';
import clsx from 'clsx';
import MuiIcon, {IconProps} from '@material-ui/core/Icon';
import {ICON} from '../../theme/core';

interface IIconProps extends IconProps{
  left?: boolean;
  right?: boolean;
  front?: boolean;
  frontFlipped?: boolean;
  caret?: boolean;
  link?: boolean;
  linkInverted?: boolean;
  contained?: boolean;
  white?: boolean;
  purple?: boolean;
}

const Icon = ({
                className,
                left,
                right,
                front,
                frontFlipped,
                caret,
                link,
                linkInverted,
                contained,
                white,
                purple,
                ...props
              }: IIconProps) => (
  <MuiIcon
    className={clsx(
      ICON.root,
      className,
      left && ICON.left,
      right && ICON.right,
      front && ICON.front,
      link && ICON.link,
      frontFlipped && ICON.frontFlipped,
      linkInverted && ICON.linkInverted,
      caret && ICON.caret,
      contained && ICON.contained,
      white && ICON.white,
      purple && ICON.purple,
    )}
    {...props}
  />
);

export default Icon;
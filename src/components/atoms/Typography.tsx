import React from 'react';
import clsx from 'clsx';
import MuiTypography, {TypographyProps} from '@material-ui/core/Typography';
import { TEXT } from '../../theme/core';

interface ITypographyProps extends TypographyProps{
  bold?: boolean;
  link?: boolean;
  linkInverted?: boolean;
  icon?: boolean;
  inverted?: boolean;
  indented?: boolean;
  light?: boolean;
  lightWeight?: boolean;
  flex?: boolean;
}

const Typography = ({
                      className,
                      bold,
                      link,
                      linkInverted,
                      icon,
                      inverted,
                      indented,
                      light,
                      lightWeight,
                      flex,
                      ...props
                    }: ITypographyProps) => (
  <MuiTypography
    className={clsx(
      TEXT.root,
      className,
      bold && TEXT.bold,
      icon && TEXT.icon,
      link && TEXT.link,
      linkInverted && TEXT.linkInverted,
      inverted && TEXT.inverted,
      indented && TEXT.indented,
      light && TEXT.light,
      lightWeight && TEXT.lightWeight,
      flex && TEXT.flex
    )}
    {...props}
  />
);

export default Typography;
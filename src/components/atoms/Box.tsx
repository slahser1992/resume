import React from "react";
import clsx from "clsx";
import MuiBox, {BoxProps} from "@material-ui/core/Box"

interface IBoxProps extends BoxProps{
  padding?: string | number;
  margin?: string | number;
}

const Box = ({className, padding, margin, ...props}: IBoxProps) => (
  <MuiBox className={clsx(

  )} {...props}/>
);
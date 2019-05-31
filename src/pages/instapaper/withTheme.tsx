import React from "react";
import {ThemeProvider} from "@material-ui/styles";
import {ThemeOptions} from "@material-ui/core/styles/createMuiTheme";
import {ReactComponentLike} from "prop-types";

const withTheme = (theme: ThemeOptions) =>
  (Component: ReactComponentLike) => (props: object) => (
  <ThemeProvider theme={theme}>
    <Component {...props} />
  </ThemeProvider>
);

export default withTheme;
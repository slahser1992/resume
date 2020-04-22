import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import atoms from '../../components/atoms';
import Header from '../../components/Header';
import theme from '../../theme/instapaper/theme';
import withTheme from './withTheme';
import Box from '@material-ui/core/Box';

const { Typography, Icon, Divider } = atoms;

const useStyles = makeStyles({
  main: {
    position: "absolute",
    width: '100vw',
    zIndex: 99,
    opacity: 0.8,
  },
  boxContainer: {
    margin: "auto",
    padding: "60px 20px 0",
  },
  title: {
    marginBottom: 40
  }
});

const PHONE_NUMBER = "17308063253";
const EMAIL_ADDRESS = "slahserzou@gmail.com";
const LOCATION = "HangZhou";
const NAME = "RenLi Zou";

function ProfilePage() {
  const classes = useStyles();
  return (
    <div className={classes.main}>
      <CssBaseline />
      <Header/>
      <Box component={"main"} maxWidth={935} className={classes.boxContainer}>
        <Box mb="44px">
          <Grid container className={classes.title}>
            {/** name **/}
            <Grid item xs={4} >
              <Box clone mb="20px">
                <Grid container alignItems="center">
                  <Typography component="h1" variant="h4" lightWeight>
                    {NAME}
                  </Typography>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={false} sm={2} md={4}/>
            {/** phone email location **/}
            <Grid item xs={8} sm={6} md={4}>
              <Grid container direction={"column"}>
                <Grid item>
                  <Typography variant={"subtitle1"} icon>
                    <Icon>phone_in_talk</Icon>
                    {PHONE_NUMBER}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant={"subtitle1"} icon>
                    <Icon>email</Icon>
                    {EMAIL_ADDRESS}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant={"subtitle1"} icon>
                    <Icon>location_on</Icon>
                    {LOCATION}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Typography component={"h6"} variant={"h6"} lightWeight>
                Abount Me
              </Typography>
              <Divider vertical/>
							<Typography>
								<ul>
									<li>
										Four year experiecne, 2C, 2B & DevOps business.
									</li>
									<li>
										Full stack developer, skilled use of HTML, Css, Less, Javascript, React.js, Mobx.js, Redux.js, Typescript, Koa, Express, TypeORM, MySQL, 
										graphQL server side and graphQL client side for daily development. pm2 for deploy and webpack for building my source.
									</li>
									<li>
										Keeping my skill enough to solve every problem which I encountered. 
									</li>
								</ul>
							</Typography>
							<Typography component={"h6"} variant={"h6"} lightWeight>
                Experience
              </Typography>
							<Divider vertical />
							<Typography>
								<ul>
									<li>
										deloitte
									</li>
									<li>
										timeline: 2016.01 - 2017.12
									</li>
									<li>
										
									</li>
								</ul>
							</Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

export default withTheme(theme)(ProfilePage);
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
  }));

export default () => {
    const classes = useStyles();

    return (
    <div id="loading-page" className={classes.root}>
        <CircularProgress size="8rem"/>
    </div>
    );
}
import React, { useState, ChangeEvent, ReactNodeArray } from 'react';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from "@material-ui/core/Grid"

import "./index.css"

const style = {
    pannel: {
        flexGrow: 1,
    },
    container: {
        height: "100%",
        padding: "1rem",
        display: "flex"
    }
}

const DataPanel: React.FC = ({ children }) => {
    const [tab, setTab] = useState(0);

    function mapTabsToChildren(children: React.ReactNodeArray) {
        return children.map((child, i) => {
            return (
                <TabPanel key={i} value={tab} index={i}>
                    {child}
                </TabPanel>
            )
        })
    }

    return (
        <div id="data-panel">
            <AppBar position="sticky" color="secondary">
                <Tabs
                    value={tab}
                    onChange={(e: ChangeEvent<{}>, i:number) => setTab(i)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Overview"/>
                    <Tab label="Forecast"/>
                </Tabs>
            </AppBar>

            <SwipeableViews
                style={style.pannel} containerStyle={style.container}
                axis="x-reverse" index={tab} 
                onChangeIndex={(i: number) => setTab(i)}
            >
                {(children)? mapTabsToChildren(children as ReactNodeArray) : null}
            </SwipeableViews>
        </div>
    );
}

type TabProps = { value: number, index: number }
const TabPanel: React.FC<TabProps> = props => {
    const { children, value, index  } = props;
    return (
      <Grid container direction="column" spacing={2} justify="space-between"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        className="data-container"
      >
        {children}
      </Grid>
    );
  }


export default DataPanel;
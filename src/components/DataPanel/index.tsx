import React, { useState, ChangeEvent, ReactNodeArray } from 'react';
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import "./index.css"

const theme = createMuiTheme({
        palette: {
            type: "dark",
            primary: {
                main: "#9d53fc",
                contrastText: '#ffcc00'
              },
              secondary: {
                main: '#242424',
              }
            }
          });

const style = {
    pannel: {
        height: "100%",
        maxHeight: "100%"
    },
    container: {
        height: "100%",
        maxHeight: "100%"
    }
}

const DataPanel: React.FC = ({ children }) => {
    const [tab, setTab] = useState(0);

    function mapTabsToChildren(children: React.ReactNodeArray) {
        return children.map((child, i) => {
            return (
                <TabPanel value={tab} index={i}>
                    {child}
                </TabPanel>
            )
        })
    }

    return (
        <div id="data-panel">
            <ThemeProvider theme={theme}>
                <AppBar position="static" color="secondary">
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
            </ThemeProvider>
        </div>
    );
}

type TabProps = { value: number, index: number }
const TabPanel: React.FC<TabProps> = props => {
    const { children, value, index  } = props;
    return (
      <div
        hidden={value !== index}
        id={`tabpanel-${index}`}
        className="data-container"
      >
        {children}
      </div>
    );
  }


export default DataPanel;
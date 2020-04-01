# Novel Coronavirus (COVID-19) Project

This project looks to explore the WHO Situation Reports covering the COVID-19 pandemic. It provides a geospatial dashboard to visualise the global/local outbreak(s) overtime and views of the cases per capita, proportion of case outcomes and mortality rate. 

The WHO Situation Reports have been collated by John Hopkins University. This data has been made public at the following Github: https://github.com/CSSEGISandData/COVID-19. 

## Instructions

This dashboard is hosted at the following public url: 

If you wish to host this dashboard locally:

1. git clone https://github.com/jordanparker6/COVID-19
2. cd COVID-19
3. yarn install
4. yarn start

Then view https://localhost:3000 in the browser.

## Technical Specifications

- This dashboard was built using Typescript and React.
- The base of the project was the Create-React-App Typescript template. 
- Visualisation have been built using both d3.js and React.
- The React Hooks API has been used exclusively.

## Procfile

The create-react-app buildfile for Heroku is used for deployment: https://github.com/mars/create-react-app-buildpack. This servers a static html page and reverse proxies based on the static.json file within this repo.





import React, { Component, PropTypes } from 'react';
import styles from "./App.css";

export default class MiniMap extends Component {

  render() {
    return <div>
      <h2>The NYCCSC Data Grapher combines a number of different data sources</h2>
      <h3>Observed Data</h3>
      <p>
        State, county and river basin graphs use the gridded
        <a href="http://www.prism.oregonstate.edu"> Parameter-elevation Relationships on Independent Slopes Model (PRISM) </a>
        dataset. A 4 km x 4 km grid is used. Monthly, seasonal and annual maximum, minimum and average temperature 
        as well as total precipitation cover the period from 1895-present. For elements such as heating degree-days, 
        temperature and precipitation threshold counts, and growing season length that require daily data to compute, 
        PRISM data are available from 1981-present. A single value is obtained for each spatial feature 
        (i.e. state, county or basin) by averaging the values of all grid encompassed by the feature.
        Grids that are only partially within the feature are included in the average, but with proportionally less weight.
        For example, if only half of a grid is within a county, its value is given half of the weight of a grid that is 
        totally within the county.
      </p>
      <p>
        For station data graphs, observations from stations within the 
        <a href="http://cdiac.ornl.gov/epubs/ndp/ushcn/ushcn.html"> U.S. Historical Climatology Network (HCN) </a>
        are used. USHCN data include daily observations of maximum and minimum temperature, precipitation amount, 
        snowfall amount, and snow depth, monthly-averaged maximum, minimum, and mean temperature and total monthly 
        precipitation. Over 1000 high-quality stations comprise the USHCN with 57 located in New York.
        Adjustments to the monthly data exist that account for non-climatic discontinuities (e.g. instrument 
        changes, station relocations and urbanization). Since similar adjustments are not available 
        for the daily data, all graphs are based on unadjusted observations for consistency.
      </p>
      <p>
        On the county, state, basin and station graphs, observed data values for each year are shown by gray dots.
        The solid black line shows the 5-year running mean of the annual values.
        For instance, the value corresponding to the line in the year 2000 is the average of the five annual 
        values for 1996-2000. The 5-year running mean highlights multi-year variations including trends.
      </p>
      <p className={styles.infoGraph} >
        <img alt="" src="data/images/info_fig_1.png" style={{height:"400px"}} title="" />
      </p>
      <h3>Projected Data</h3>
      <p>
        Global climate model projections from the North American Regional Climate Change Assessment Program
        (NARCCAP) are shown on graphs for state, county and basin areas. The NARCCAP dataset provides
        daily values of maximum and minimum temperature and precipitation on a 50 km grid. Eleven NARCCAP
        grids are used each is created using a regional climate model (RCM) driven by one of three
        atmosphere-ocean general circulation models (AOGCM) or a historical Reanalysis dataset. 
        The spatial resolution of the NARCCAP simulations preclude the inclusion of projections on
        station-specific graphs.
      </p>
      <p>
        All future projections cover the period 2041-2070 and are based on the relatively high SRES A2 
        emissions scenario. Simulations are also generated for the 1971-2000 historical period. 
        Future (and historical) simulations are based four RCMs:
      </p>
        <ul>
        <li>Canadian Regional Climate Model (CRCM)</li>
        <li>MM5 - Penn State NCAR Mesoscale Model (MM5I)</li>
        <li>Regional Climate Model Ver. 3 (RCM3)</li>
        <li>Weather Research and Forecasting Model (WRF)</li>
        </ul>
      <p>nested within at least one of three AOGCMS:</p>
        <ul>
        <li>Community Climate System Model (CCSM)</li>
        <li>Third Generation Coupled Global Climate Model (CGCM3)</li>
        <li>Geophysical Fluid Dynamics Laboratory GCM (GFDL)</li>
        </ul>
      <p>This yields a set of seven RCM-AOGCM combinations:</p>
      <div className={styles.infoModels}>
        <div>CRCM-CCSM</div>
        <div>CRCM-CGCM3</div>
        <div>MM5I-CCSM</div>
        <div>RCM3-GFDL</div>
        <div>RCM3-CGCM3</div>
        <div>WRF-CCSM</div>
        <div>WRF-CGM3</div>
      </div>
      <p>
        Simulations from these model combinations form the red-blue shaded areas on each graph for the
        historical and future period. The top of the red area corresponds to the highest of the
        seven combinations. The bottom of the blue area corresponds to the lowest of the seven
        combinations. The mean of the seven combinations is reflected by the boundary between the blue and
        red areas. As with the observed data, a 5-year running mean is used.
      </p>
      <p className={styles.infoGraph} >
        <img alt="" src="data/images/info_fig_2.png" style={{height:"400px"}} title="" />
      </p>
      <p>
        The remaining four NARCCAP grids (each RCM driven by NCEP/DOE AMIP-II Reanalysis) are used to bias
        adjust the historical and future AOGCM simulations. The Reanalysis is not a climate model, but
        a representation of historical atmospheric conditions based on observed data. Differences 
        between RCM simulations and the &ldquo;true&rdquo; climate occur for a variety of reasons, 
        particularly boundary conditions that result from the limited spatial domain of the RCMs and 
        between-model differences in the physical handling of complex atmospheric processes. To account 
        for this, a bias grid was computed for each RCM by subtracting the average monthly RCM-NCEP 
        simulations from the corresponding historical RCM-AOGCM combination. This bias grid was 
        then used to adjust both the historical and future RCM-AOGCM simulations. For instance, suppose 
        the historical June average temperature at a grid point is 54 °F in the WRF-NCEP simulation 
        and the corresponding temperature in the historical WRF-CGCM3 simulation is 54.6 °F. This 0.6 °F 
        bias would be subtracted from both the historical WRF-CGCM3 and future WRF-CGCM3 simulations 
        prior to plotting on the graphs.
      </p>
      <p>
        You may notice that in many cases, the shaded region corresponding to the bias corrected 
        historical RCM-AOGCM simulations does not encompass the observed data values. This is to be 
        expected, as the Reanalysis data used to drive the historical RCM simulations is different from 
        the PRISM data that represent the observations. The RCM-simulations represent conditions 
        over a much larger spatial area (50km) than the PRISM values (4 km). Also the coarser resolution 
        of the RCM affects the influence of variables such as topography and proximity to water bodies. 
        The nuances of these features in regions like the Finger Lakes and Catskills can not be 
        represented at the RCM resolution, but influence the higher resolution PRISM data.
      </p>
      <p>
        A final element of each graph depicts the change between the historical and future RCM-AOGM mean. 
        In the example below, the mean of the seven RCM-AOGCM simulations increases by 3.9 °F between 
        1970-2000 and 2041-2070.
      </p>
      <p className={styles.infoGraph} >
        <img alt="" src="data/images/info_fig_3.png" style={{height:"400px"}} title="" />
      </p>
      </div>
  }
};


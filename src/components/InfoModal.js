import React, { Component, PropTypes } from 'react';
import styles from "./App.css";

export default class MiniMap extends Component {

  render() {
    return <div>

      <h2>Massachusetts Climate Change Projections</h2>
      <p>
        Climate change projections for the commonwealth of Massachusetts are based on simulations
        from the latest generation of climate models included in the Coupled Model Intercomparison
        Project Phase 5 (CMIP5). These same CMIP5 models formed the basis of projections
        summarized in the IPCC Fifth Assessment Report (2013). The statewide projections comprising
        county- and watershed-level information are derived by statistically downscaling CMIP5 model
        results using the Local Constructed Analogs (LOCA) method (Pierce et al., 2014). The LOCA
        dataset provides values for daily precipitation, and maximum and minimum temperature on a ~6
        km grid (available here: <a href='http://loca.ucsd.edu'>http://loca.ucsd.edu/</a>). The LOCA method corrects for systematic biases
        present in climate models simulations, and has been shown to produce better depiction of climate
        extremes compared to previous statistical downscaling methods.
      </p>
      <p>
        The climate change projections are based on fourteen CMIP5 models and two pathways of future
        greenhouse gas emissions: RCP4.5 and RCP8.5, the medium and high emissions scenarios
        respectively. The fourteen models were carefully selected from a large ensemble of CMIP5
        models based on their ability to provide reliable climate information for the Northeast US, while
        maintaining diversity in future projections consistent with known uncertainties.
      </p>
      <p>
        Two scenarios for fourteen models each lead to 28 projections. The values cited below are based
        on the 10-90 th percentiles across 28 projections, so they bracket the most likely scenarios. For
        simplicity, we use the terms “…expected to…”, “…will be…”, but recognize that these are
        estimates based on model scenarios and are <em>not forecasts</em>. They represent the best estimates that
        we can provide for a range of anticipated changes in greenhouse gases. Note also that
        precipitation projections are generally more uncertain than temperature.
      </p>

      <h4>The following projections are for the mid-21 st century (2050s) relative to the 1971-2000
average</h4>
      <ul>
        <li>Mean annual temperatures in MA are expected to be 2.8-6.2°F warmer than over recent decades.</li>
        <li>There will be 7-26 more days per year when daily maximum temperatures exceed 90°F.</li>
        <li>There will be 19-40 fewer days when minimum temperatures fall below 32°F (a decline of 13-27%).</li>
        <li>Total heating degree days will be 11-24% lower, but cooling degree days will be 57-150% higher.</li>
        <li>Growing degree days will be 23-52% higher, and the growing season will be longer.</li>
        <li>Total annual precipitation will increase by 2-13%, and winter precipitation will increase by up to 21%.</li>
        <li>While winters are projected to get wetter, more precipitation will fall as rain or freezing rain, rather than snow because of the increase in temperatures.</li>
      </ul>
      <table className='table'>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Observed value <br/> 1971 - 2000 average</th>
            <th>Change by 2050s</th>
            <th>Change by 2090s</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> Annual average temperature </td>
            <td> 47.5 °F </td>
            <td> Increase by 2.8-6.2 °F </td>
            <td> Increase by 3.8-10.8 °F</td>
          </tr>
          <tr>
            <td>Number of days per year with daily Tmax &gt; 90°F</td>
            <td> 5 days</td>
            <td>Increase by 7-26 days</td>
            <td>Increase by 10-63 days</td>
          </tr>
          <tr>
            <td> Number of days per year with daily Tmin &lt; 32°F</td>
            <td> 146 days </td>
            <td> Decrease by 19-40 days</td>
            <td> Decrease by 24-64 days</td>
          </tr>
          <tr>
            <td> Heating degree- days per year </td>
            <td> 6839 Degree-Day °F</td>
            <td> Decrease by 773-1627 </td>
            <td> Decrease by 1033-2533</td>
          </tr>
          <tr>
            <td> Cooling degree- days per year </td>
            <td> 457 Degree-Day °F </td>
            <td> Increase by 261-689 </td>
            <td> Increase by 356-1417 </td>
          </tr>
          <tr>
            <td> Growing degree- days per year </td>
            <td> 2344 Degree-Day °F </td>
            <td> Increase by 531-1210 </td>
            <td> Increase by 702-2347 </td>
          </tr>
          <tr>
            <td> Total Precipitation per year </td>
            <td> 47 inches </td>
            <td> Increase by 0.9-6 inches </td>
            <td> Increase by 1.2-7.3 inches</td>
          </tr>
          <tr>
            <td> Number of days with precip &gt; 1 in </td>
            <td> 7 days </td>
            <td> Increase by 0-3 days </td>
            <td> Increase by 1-4 days </td>
          </tr>
        </tbody>
      </table>
    </div>
  }
};

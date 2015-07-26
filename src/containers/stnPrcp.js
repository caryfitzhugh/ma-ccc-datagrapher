import React from 'react';
import { createRedux, Provider, bindActionCreators, Connector } from 'redux';
import StnParameters from '../components/StnParameters';
import StnChart from '../components/StnChart';
import * as stores from '../stores/stnStore';
import * as stnActions from '../actions/stnActions';

const redux = createRedux(stores);

export default class StnPrcp {
  render() {
    const select = (state) => {
      const s = state.stnStore;
      return {
        stations: s.stations,
        shownStns: s.shownStns,
        params: s.params,
        results: s.results,
      };
    }
    return (
      <Provider redux={redux}>
        {() => 
          <Connector select={select} >
            {this.renderChild}
          </Connector>
        }
      </Provider>
    );
  }

  renderChild({ stations, shownStns, params, results, dispatch }) {
    const actions = bindActionCreators(stnActions, dispatch);
    console.log("StnPrcp renderChild "+JSON.stringify(params))
    return (
      <div>
        <StnParameters 
          shownElems={['pcpn', 'snow', 'snwd']}
          stations={stations}
          shownStns={shownStns}
          params={params}
          {...actions}/>
        <StnChart
          stations={stations}
          params={params}
          results={results} />
      </div>
    );
  }
}


import React from 'react';
import Immutable from 'immutable';

let dataExtns = {
  stnTemp: require("bundle?lazy&name=stnTemp!./docJS/n12089"),
  stnPrcp: require("bundle?lazy&name=stnPrcp!./docJS/n1577"),
};

React.render(
  <div>
    <select onChange={ loadExtn } >
    <option key="none" value="none">Choose one</option>
    { Object.keys(dataExtns).map( k => {return <option key={k} value={k} >{k}</option>;}) }
    </select>
  </div>,
  document.getElementById('product')
);

function loadExtn(e) {
  let Extn = dataExtns[e.target.value];
  if (Extn) {
    Extn(function(E){React.render(
      <div>
        <E info={{}} />
      </div>,
      document.getElementById('root')
      )}
    );
  }
};


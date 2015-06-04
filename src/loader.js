import React from 'react';

let extensionDefs = {
  n12089: require("bundle?lazy&name=stnTemp!./docJS/stnTemp"),
  n1577: require("bundle?lazy&name=stnPrcp!./docJS/stnPrcp"),
};

let uri = document.baseURI.split('/');
let docId = uri[uri.length-1];

if (extensionDefs[docId]) {
  extensionDefs[docId](function(Extn) {
    React.render(
      <div>
        <Extn info={{}} />
      </div>,
      document.getElementById('document-extension')
    )
  })
};

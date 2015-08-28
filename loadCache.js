require("babel/register");
var fs = require('fs'),
    path = require('path'),
    api = require("./src/api.js");

require('isomorphic-fetch');


var lst = [];

function pages() {
  ['state','county','basin'].forEach(function (geom) {
    api.seasons.forEach(function (_,season) {
      api.elems.forEach(function (def,element) {
        if (def.gYr && season == 'DJF') lst.push({geom:geom,season:season,element:element});
      })
    })
  })
  return lst.values();
}

var iter = pages();

function getter() {
  var n = iter.next();
  if (n.done) return;
  const p = n.value;
  const reqParams = api.buildQuery(p, {});

  console.log('start',p.geom, p.element, p.season);
  fetch('http://data.nrcc.rcc-acis.org/GridData',{
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reqParams)
  })
  .then(function(res) {
    if (res.status >= 400) {
      throw new Error("Bad response from server");
    }
    return res.text();
  })
  .then(function(res) {
    var fName = path.join('cache',p.geom,[p.element,p.season].join('_'));
    fs.writeFile(fName,res+'\n',getter);
    console.log('finish',p.geom, p.element, p.season);
    // getter();
  });
};

getter();
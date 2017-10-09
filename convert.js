const fs = require('fs');
const _ = require('lodash');
const basins_file = process.argv[2];
const datagrapher_file = process.argv[3];

let basins = JSON.parse(fs.readFileSync(basins_file));
let datagrapher = JSON.parse(fs.readFileSync(datagrapher_file));

// We want to walk over all the features in the datagrapher file.
// And find and replace the geometries with the new ones
console.log(datagrapher);

datagrapher.meta.forEach((feature) => {
  let name = feature.name;
  // Find the associated one in basins file
  let new_basin = _.find(basins.features, (basin) => {
    return basin.properties.NAME.toUpperCase() === name.toUpperCase();
  });
  if (!new_basin) {
  console.error('ACK', name);
  }
  feature.geojson = new_basin;
});

fs.writeFileSync(process.argv[4], JSON.stringify(datagrapher), 'utf8');

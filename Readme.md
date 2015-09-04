#Fixture to build and run data-product extensions for the NYCCSC web site

##Demo
[Running example](https://nyccsc.github.io/data-fixture/)

##API

The interface is defined by the url used on the page. There is one query field `c` that is repeated for each chart on the page.  The `c` field contains a `/` delimited set of parameters that define the data used for the chart.

  * `prod` One of Temp, Prcp, TDays, PDays, or Frost.
  * `area` The Geographic Unit used to present the data.  One of stn, state, county or basin.
  * `elem` The Climate Variable presented on the chart.  See below.
  * `season` The Time Span over which the data is summarized:
    ANN, MAM, JJA, SON, DJF, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, or Dec.
  * `sid` The Selected Identifier.  This is either the station id, state abbreviation, county fips or the basin HUC8 code.
  * `bbox` The bounding box of the mini-map (not yet enabled).  Empty spans the full NY state.

Any field that is missing will be replaced by a default.

###Examples:

Station data for the Albany Airport (Prcp, Max Temp, Min Temp):

https://nyccsc.github.io/data-fixture/?c=Prcp/stn/pcpn/ANN/USH00300042/&c=Temp/stn/maxt/ANN/USH00300042/&c=Temp/stn/mint/ANN/USH00300042/

Precipitation data for two counties:

https://nyccsc.github.io/data-fixture/?c=Prcp/county/pcpn/ANN/36001/&c=Prcp/county/pcpn/ANN/36039/

Maximum summer temperature and Minimum winter temperature for NY State:

https://nyccsc.github.io/data-fixture/?c=Temp/state/maxt/JJA/NY/&c=Temp/state/mint/DJF/NY/

  
##Build Instructions

You will need node.js installed with a recent npm.  I am currently using node v0.12.7 and npm 2.14.2.

Clone this repo.
```
git clone https://github.com/NYCCSC/data-fixture.git
```

I am vendoring in the latest Leaflet as it moves to 1.0.  I also need to adjust the `.css` file until I figure out how to get webpack to load a couple of images.  I am currently at commit `08d655fe66`, but master is probably fine.

So do the following:

```
cd data-fixture
mkdir vendor
cd vendor
git clone https://github.com/Leaflet/Leaflet.git
cd Leaflet
npm install .
```

Make the following modification to the `dist/leaflet.css` file:

```
diff --git a/dist/leaflet.css b/dist/leaflet.css
index 346fab9..9fe9ea3 100644
--- a/dist/leaflet.css
+++ b/dist/leaflet.css
@@ -304,12 +304,12 @@
        border-radius: 5px;
        }
 .leaflet-control-layers-toggle {
-       background-image: url(images/layers.png);
+       /*background-image: url(images/layers.png);*/
        width: 36px;
        height: 36px;
        }
 .leaflet-retina .leaflet-control-layers-toggle {
-       background-image: url(images/layers-2x.png);
+       /*background-image: url(images/layers-2x.png);*/
        background-size: 26px 26px;
        }
 .leaflet-touch .leaflet-control-layers-toggle {
```

Now you can install the dependencies (in the `data-fixture` directory):
```
npm install .
```

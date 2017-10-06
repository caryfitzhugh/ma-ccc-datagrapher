## MA CCC Datagrapher

### Combining polygons into singles
The MA data was for 27 basins, but had 258 polygons.  Many islands and things created multiple polygons with the same name.
I loaded the geojson into mapshaper.org, and ran the CLI command "dissolve 'NAME'" -- that clumped things together. Then exported.

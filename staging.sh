rm -rf build/
npm run build-min

aws s3 sync --profile=nescaum dataproduct/ s3://ma-datagrapher-nescaum-ccsc-dataservices/dataproduct --acl public-read
aws s3 sync --profile=nescaum data/ s3://ma-datagrapher-nescaum-ccsc-dataservices/data --acl public-read
aws s3 cp --profile=nescaum index.html s3://ma-datagrapher-nescaum-ccsc-dataservices/index.html --acl public-read
#aws cloudfront create-invalidation --profile=nescaum --distribution-id E37QSI0FOIRQDP --paths "/*"
#rm -rf dataproduct/

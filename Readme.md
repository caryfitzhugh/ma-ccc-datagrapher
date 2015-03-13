#Fixture to build data-product extensions for the NYCCSC web site#

##Instructions##

You will need node.js installed with a recent npm.  I have tested this with node v0.10.36 and npm 2.4.1.

Clone this repo.
```
git clone https://github.com/NYCCSC/data-fixture.git
```

I have some changes to the `react-d3-components` module, so I put that in a `vendor` directory.

```
cd data-fixture
mkdir vendor
cd vendor
git clone https://github.com/bnoon/react-d3-components.git
cd react-d3-components
npm install
cd ../../
```

Now you can install the dependencies (in the `data-fixture` directory):
```
npm install
```

It is also useful in install `webpack` globally: `npm install webpack -g`

Build the javascript files:
```
webpack -p
```

Copy the `assets/*.js` files to the `rails/app/assets/javascripts` directory and restart rails.

You can run a development server
```
npm start
```

Hot reloading of the components isn't working now, but I am looking into it.

When creating a new extension, you will add a file to `src/docJS/` and modify the `src/loader.js` file with the new file name.

Currently the filenames map to the last component of the `docURI` in vivo.

##Example Extension##
There is an example extension called "hello" that demonstrates several points:

* Vanilla javascript that just puts some html elements on the page.
* Loads a css document
* Loads an image onto the page.  The full size logo is loaded directly, the small logo is embedded in the webpacked javascript.
* Structures the source into a subdirectory (`/helloworld`) with extra files.  The `index.js` file is loaded when the directory is `require`d.


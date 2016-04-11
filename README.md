# Kusema
A new social platform for university students.

## Installation
0. Install `npm` your preferred way, then type `npm install -g jspm` to install JSPM. You may need to do this as root or via `sudo`.
1. Point your terminal to `/Server` and type `npm install` to install server dependencies.
2. Point your terminal to `/Client` and type `jspm install` to install client dependencies.
3. **Optional but recommended:** Leave your terminal in `Client` and type 'npm run-script buildDeps' to bundle dependencies up for much faster development page-loads.
3. Point your terminal to `/Server` and type `bin/kusema test` to run the server in development mode.

## Bundling
1. Go to `/Client`, and type `npm run-script build`
2. Comment the development section in `index.html`, and uncomment the production section. (to be made More Better soon!)

## Principles
- Mobile first
- Minimalist
- Realtime

## Supported browsers

Mobile:
- Chrome
- Safari
 
Desktop:
- Chrome
- Safari
- IE 11+

## Dev Notes
- [AngularJS best practices](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)
- [API Reference](https://github.com/nathansherburn/kusema/wiki/API-Reference)

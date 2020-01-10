# mancala
Mancala problem set

Versions: Pixi.js 4.8.3 and types 4.8.8

To run tests: run npm run test mancala from the root directory

When testing, any onclicks made to student model should be made to ref model, since we can't directly modify scores we have to keep setting it equal.

If you have trouble getting the browser to load (and/or board-script is riddled with red squiggly lines) it may be a problem with your pixi library. run these:
npm install pixi.js
npm install @types/pixi.js --save-dev
code package.json
*find where pixi.js and @types/pixi.js are and change their version numbers to 4.8.3 and 4.8.8*
finally, type npm install and wait for the versions of pixi to install. Then you should be good to go.

_When you want to test your code_
In your terminal, check to see what your current directory is (its the yellow file path). If it's ~/comp110-19f/src, you're in the right place. If it's ~/comp110-19f/src/somethingelse..., type cd .. to go up a directory. Repeat this until you are where you need to be. 

Once you're in the right directory, you can simply type *npm run test mancala* to test your file. The tests should run automatically. If you get a really long error message DM us we've run into issues before.

Don't hesitate to DM us if you have questions!!!!
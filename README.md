# mancala
Mancala problem set

If you have any questions, dm either/both of us!

note: you have to comment out drawboard function in your code in order for the tests to run correctly

SETUP FOR TESTERS
*clone into the repository via terminal*
repository found here => it's not ready yet
in your terminal, make sure you're in the src directory of a 110 workspace (yellow text should be comp110-XYX/src)
run:
git clone _repo url_

you should get the files you need popping up into the workspace, in a new folder called "mancala"

*installing dependencies*

open your terminal
make sure you're in the src directory (yellow text should end with src)

run:
npm install pixi.js
npm install @types/pixi.js

the default versions that got installed are not actually what you want, so:
run:
vim package.json

it should open a little editor in your terminal that you can navigate in using the arrow keys

find a line that says pixi.js followed by a version number (0.0.0 or something). Change the version number (inside the quotation marks) to be "4.8.3"
VIM NOTE: to go to "insert" mode where you can make changes in VIM, hit the i key.

now, do the same thing, but for the line that says @types/pixi.js, change the version number to be "4.8.3"


exit insert mode by doing ctrl+[ (command+[ on mac), and type :wq to save/exit package.json

again in your terminal in the src folder, run:
npm install

the red lines should go away and it should display to the browser via npm run start

To run tests: run npm run test mancala from the src directory

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
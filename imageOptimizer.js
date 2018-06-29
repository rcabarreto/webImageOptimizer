#!/usr/bin/env node

'use strict';

const options = require('commander');
const im = require('./lib/imageManipulator');
const currPath = __dirname;

function number(number){
  return parseInt(number);
}

options
  .version('1.0.0')
  .option('-w, --width [width]', 'Maximum width of output image [width]', number, 1920)
  .option('-h, --height [height]', 'Maximum height of output image', number, 1080)
  .option('-q, --quality [quality]', 'Quality of output image', number, 80)
  .option('-f, --folder [folder]', 'Path of the source folder', 'images/src/')
  .parse(process.argv);


options.currPath = currPath;

im.findImages(options).then(imageList => {
  // imageList.map((image) => im.process(image, options).then(newImage => console.log(newImage)).catch(err => console.log(err)));
}).catch(err => {
  if (err.code === 'ENOENT')
    console.log('ERROR:', err.errno, 'no such file or directory (', err.path,')')
});

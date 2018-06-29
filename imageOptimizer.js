#!/usr/bin/env node

'use strict';

const options = require('commander');

const image = require('./lib/imageManipulator');

function number(number){
  return parseInt(number);
}

options
  .version('1.0.0')
  .option('-w, --width [width]', 'width of output image [width]', number, 1920)
  .option('-h, --height [height]', 'height of output image', number, 1280)
  .option('-q, --quality [quality]', 'quality of output image', number, 80)
  .option('-b, --blur [blur]', 'blur of bg bars [50]', number, 50)
  .option('-f, --folder [folder]', 'Path of the source folder', 'images/src/')
  .parse(process.argv);


image.processAll(options).then(result => {
  console.log(result);
}, err => {

  if (err.code === 'ENOENT')
    console.log('ERROR:', err.errno, 'no such file or directory (', err.path,')')

});
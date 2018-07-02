'use strict';

const jimp = require("jimp");
const path = require('path');
const fs = require('fs');

module.exports = {

  findImages(options) {

    // find all image files inside given folder
    return new Promise((resolve, reject) => {

      fs.readdir(path.join(options.currPath, options.folder), (err, files) => {

        if (err)
          reject(err);

        if (!files) {
          reject('folder not found');
        } else {
          resolve(files);
        }
      })
    });
  },

  process(image, options) {

    let self = this;
    return new Promise((resolve, reject) => {

      let fileName = image.split('.')[0];
      let fileExt = image.split('.')[1];
      
      jimp.read(path.join(__dirname, '../images/src/', image)).then(image => {
        console.log('Optimizing image:', fileName+'.'+fileExt, '('+image.getMIME()+')');
        return self.resizeImage(image, options);
      }).then(resizedImage => {
        return self.setQuality(resizedImage, options);
      }).then(finalImage => {
        return self.saveImage(finalImage, options, fileName, fileExt);
      }).then(imagePath => {
        resolve(imagePath);
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  resizeImage(image, options) {

    if ((image.bitmap.width > image.bitmap.height) && (image.bitmap.width > options.width))
      image.resize(options.width, jimp.AUTO); // landscape image.

    if ((image.bitmap.height > image.bitmap.width) && (image.bitmap.height > options.height))
      image.resize(jimp.AUTO, options.height); // portrait mode image.

    return image

  },

  setQuality(image, options) {
    image.quality(options.quality);
    return image;
  },

  saveImage(image, options, fileName, fileExt) {
    image.write(path.join(__dirname, '../images/out/', fileName+'-optimized.' + fileExt));
    return path.join(__dirname, '../images/out/', fileName+'-optimized.' + fileExt);
  }

};
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
        self.resizeImage(image, options).then(resizedImage => {
          return self.setQuality(resizedImage, options);
        }).then(finalImage => {
          finalImage.write(path.join(__dirname, '../images/out/', fileName+'-optimized.' + fileExt));
          return path.join(__dirname, '../images/out/', fileName+'-optimized.' + fileExt)
        }).then(imagePath => {
          resolve(imagePath);
        }).catch(err => {
          reject(err);
        });
      }).catch(function (err) {
        reject(err);
      });
    });
  },

  resizeImage(image, options) {

    return new Promise((resolve, reject) => {

      if ((image.bitmap.width > image.bitmap.height) && (image.bitmap.width > options.width)) {
        image.resize(options.width, jimp.AUTO); // landscape image.
      }

      if ((image.bitmap.height > image.bitmap.width) && (image.bitmap.height > options.height)) {
        image.resize(jimp.AUTO, options.height); // portrait mode image.
      }

      resolve(image);

    });

  },

  setQuality(image, options) {
    return new Promise((resolve, reject) => {
      image.quality(options.quality);
      resolve(image);
    });
  }

};
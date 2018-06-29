'use strict';

const jimp = require("jimp");
const path = require('path');
const fs = require('fs');

module.exports = {

  processAll(options) {

    return new Promise((resolve, reject) => {

      fs.readdir(path.join(__dirname, '../', options.folder), (err, files) => {

        if (err)
          reject(err);

        if (!files) {
          reject('folder not found');
        } else {

          // TODO: check if files are images!
          files.forEach(file => {
            this.process(file, options).then(() => {
              console.log('image successfully processed!');
            }, err => {
              console.log(err);
            });
          });

          resolve('all files processed successfully!');

        }

      })

    });

  },


  process(image, options) {

    let self = this;

    return new Promise((resolve, reject) => {

      let fileName = image.split('.')[0];
      let fileExt = image.split('.')[1];

      if (!fs.existsSync(path.join(__dirname, '../images/out/', fileName+'-banner.' + fileExt))) {

        jimp.read(path.join(__dirname, '../images/src/', image)).then(image => {

          self.createBanner(image, options).then(banner => {
            banner.write(path.join(__dirname, '../images/out/', fileName+'-banner.' + fileExt));
            resolve();
          });

        }).catch(function (err) {
          console.error(err);
          reject(err);
        });

      } else {
        reject('image already exists on output folder!')
      }

    });

  },


  createBanner(image, options) {

    let bgImage = image.clone();

    return new Promise((resolve, reject) => {

      if ( (image.bitmap.width/image.bitmap.height) > parseInt(options.width)/options.height) {

        image.resize(options.width, jimp.AUTO);

        bgImage
          .resize(jimp.AUTO, options.height)
          .crop(parseInt((bgImage.bitmap.width-options.width)/2), 0, options.width, options.height)
          .blur(options.blur)
          .blit(image, 0, parseInt((options.height/2)-(image.bitmap.height/2)))
          .quality(options.quality);

      } else {

        image.resize(jimp.AUTO, options.height);

        bgImage
          .resize(options.width, jimp.AUTO)
          .crop(0, parseInt((bgImage.bitmap.height-options.height)/2), options.width, options.height)
          .blur(options.blur)
          .blit(image, parseInt((options.width/2)-(image.bitmap.width/2)), 0)
          .quality(options.quality);

      }

      // image.resize(jimp.AUTO, 300)
      //   .quality(options.quality)
      //   .write(path.join(__dirname, '../images/out/', fileName+'-cover.' + fileExt));

      resolve(bgImage);

    });

  }


};
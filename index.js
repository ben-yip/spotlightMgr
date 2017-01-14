/**
 * Created by BenYip on 1/12/2017.
 */

"use strict";

// built-in lib
const fs = require('fs'),
    path = require('path'),
    os = require('os'),
    child_process = require('child_process');

// working dirs
const spotlightDir = path.join(os.homedir(), 'AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets/'),
    desktopDest = path.join(os.homedir(), 'Desktop/spotlight-wallpaper');

// filter out small size files like icons etc.
var minimalFilterSize = 450 * 1024;


// check if it's not running in Windows
if (os.type() !== 'Windows_NT') {
    console.log('Support Windows OS only.');
    return false;
}

// create dest dir on desktop
if (!fs.existsSync(desktopDest)) {
    fs.mkdirSync(desktopDest);
}

var saveSpotlightImages = function () {
    //read the dir where spotlight wallpapers are saved.
    fs.readdir(spotlightDir, function (err, filenames) {

        filenames.filter(function (filename) {
            //filter small size files
            return fs.statSync(path.join(spotlightDir, filename)).size > minimalFilterSize;

        }).forEach(function (filename) {
            var destFilepath = path.join(desktopDest, filename + '.jpg');

            //skip if file already exists in dest dir
            if (!fs.existsSync(destFilepath)) {
                //copy and rename
                fs.readFile(path.join(spotlightDir, filename), function (err, data) {
                    fs.writeFile(destFilepath, data);
                });
            }
        });

    });
};

saveSpotlightImages();

//open in file explorer to view those wallpapers.
child_process.exec('explorer.exe ' + desktopDest);

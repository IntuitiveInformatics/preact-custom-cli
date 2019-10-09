const ora = require('ora'); //Terminal Spinner
const fs = require('../fs'); //File System
const { resolve, join } = require('path'); //Copy of NodeJS Path
const { red, green } = require('kleur'); //Terminal Colors
const {
	info,
	isDir,
	hasCommand,
	error,
	trim,   
	warn,
	dirExists,
} = require('../util');

module.exports = async function (type, name, argv) {
    //Set to new values and then go from there. Starting place
    const cwd = resolve(argv.cwd);
    const genType = type || argv.type;
    const genName = name || argv.name;
    const genDest = argv.dest;

    try {
        console.log("CWD: " , cwd);
        console.log("Dest: ", genDest);
    } catch (error) {
        throw error;
    }
    

};
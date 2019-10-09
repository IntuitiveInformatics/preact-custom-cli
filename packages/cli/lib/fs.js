const {
	readFile,
	writeFile,
	copyFile,
	stat,
	statSync,
	readdir,
	existsSync,
} = require('fs');
const { promisify } = require('util');

module.exports = {
	copyFile: promisify(copyFile),
	readFile: promisify(readFile),
	writeFile: promisify(writeFile),
	stat: promisify(stat),
	readDir: promisify(readdir),
	statSync,
	existsSync,
};

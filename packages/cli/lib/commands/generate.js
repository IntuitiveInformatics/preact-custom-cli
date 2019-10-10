//const ora = require('ora'); //Terminal Spinner
const fs = require('../fs'); //File System
const { resolve, join } = require('path'); //Copy of NodeJS Path
const mkdirp = require('mkdirp');
//const { red, green } = require('kleur'); //Terminal Colors
const { isDir } = require('../util');

const tsx = `import { h, Component } from 'preact';
import * as style from './style.scss';

interface Props {}
interface State {}

export default class nameCap extends Component<Props, State> {
	public render() {
		return (
			<div class={style.name}>
				<h1>nameCap</h1>
				<p>This is the nameCap component.</p>
			</div>
		);
	} 
}`;

const scss = `.name {
    display: block;
}`;

//TODO: write creation of the files and insertion of the imports (if route)
function writeFiles(cwd, fileDest, name, type) {
	const destination = resolve(cwd, fileDest);
	const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
	const replacedUpperCaseTSX = tsx.replace(/nameCap/g, capitalized);
	const preparedTsx = replacedUpperCaseTSX.replace(/name/g, name);

	const preparedFileDest =
		'import ' + capitalized + " from '../" + fileDest.substring(4) + "';\n";

	const preparedScss = scss.replace(/name/g, name);

	fs.writeFile(resolve(destination, 'index.tsx'), preparedTsx);
	fs.writeFile(resolve(destination, 'style.scss'), preparedScss);

	if (type === 'route') {
		fs.readFile('./src/components/app.js', 'utf8', function(err, data) {
			let position = data.indexOf('\n', data.lastIndexOf('/routes/'));
			let newData =
				data.slice(0, position + 1) + preparedFileDest + data.slice(position);
			fs.writeFile('./src/components/app.js', newData);
		});
	}
}

//TODO: Prompt user for information if needed
module.exports = async function(type, name, argv) {
	//Set to new values and then go from there. Starting place
	//Current working directory of the user
	const cwd = resolve(argv.cwd);
	//Whether to create a component or a route, default component
	//TODO: ensure that the only 2 options are "component" or "route"
	const genType = type || argv.type;
	//Name of the component, default newComponent or newRoute based on type
	const genName = name || (genType === 'route' ? 'newRoute' : argv.name);
	//Replacing the placeholder name with the name of the component or "newComponent"/"newRoute" if not specified
	let dest = join(argv.dest, '{name}');
	dest = dest.replace('{name}', genName);
	//Local destination for the
	const genDest =
		genType === 'route' ? dest.replace('components', 'routes') : dest;
	let finalDirectory = join(cwd, genDest);

	if (isDir(finalDirectory)) {
		fs.readDir(finalDirectory, (err, files) => {
			if (err && !files) {
				console.error(err);
			}
			let regexp = RegExp('.tsx|.scss|.d.ts', 'gi');

			const result = files.filter(file => file.match(regexp));
			if (result.length === 0) {
				//Copy Files
				writeFiles(cwd, genDest, genName, genType);
			} else {
				throw 'There seems to be component files already in this directory... Exiting';
			}
		});
	} else {
		mkdirp(finalDirectory, function() {
			writeFiles(cwd, genDest, genName, genType);
		});
	}
};

const fse = require('fs-extra');
const copy = require('copy');

console.log('Removing old dist files...');
// Retaining node_modules by not deleting the whole dist folder
fse.removeSync('../dist/browser/');
fse.removeSync('../dist/models/');
fse.removeSync('../dist/render/');
fse.removeSync('../dist/services/');
fse.removeSync('../dist/triggers/');
fse.removeSync('../dist/cache.js');
fse.removeSync('../dist/cache.js.map');
fse.removeSync('../dist/index.d.ts');
fse.removeSync('../dist/index.js');
fse.removeSync('../dist/index.js.map');
fse.removeSync('../dist/render.d.ts');
fse.removeSync('../dist/render.js');
fse.removeSync('../dist/render.js.map');
fse.removeSync('../dist/package.json');
fse.removeSync('../dist/package-lock.json');

console.log('Copying Angular dist bundle...');
fse.copySync('../angular/dist/', '../dist/', { overwrite: true });
// fse.moveSync('../dist/browser/index.html', '../dist/browser/dynamic.html', { overwrite: true });

// Putting all files in same public dir for simplicity of static file serving later
fse.moveSync('../dist/admin/index.html', '../dist/browser/admin.html', { overwrite: true });
copy('../dist/admin/**', '../dist/browser/', () => {
    fse.removeSync('../dist/admin/');
    fse.removeSync('../dist/browser/assets/tanam.config.json');
});

console.log('Copying cloud functions dist bundle...');
fse.copySync('./dist/', '../dist/');
fse.copySync('./package.json', '../dist/package.json');
fse.copySync('./package-lock.json', '../dist/package-lock.json');

console.log('Copying Tanam configuration...');
try {
    fse.copySync('../tanam.config.json', '../dist/browser/assets/tanam.config.json');
} catch (err) {
    console.log("No Tanam config file found. Not a problem if you provided configuration in another way.");
}

console.log('Copying README and LICENSE');
fse.copySync('../README.md', '../dist/README.md', { overwrite: true });
fse.copySync('../LICENSE', '../dist/LICENSE', { overwrite: true });

console.log('Done!');

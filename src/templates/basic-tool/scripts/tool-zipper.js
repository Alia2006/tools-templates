const fs = require("fs");
const archiver = require("archiver");
const {remove} = require("./cleaner");

const zip = () => {

    // Copy all files to dist

    fs.copyFileSync("docs/index.md", "temp/tool/index.md");

    const mediaSource = "resources";
    const mediaDestination = "temp/tool/resources";
    remove([mediaDestination]);
    fs.mkdirSync(mediaDestination);

    const mediaFiles = fs.readdirSync(mediaSource);
    for (const file of mediaFiles) {
        fs.copyFileSync(`${mediaSource}/${file}`, `${mediaDestination}/${file}`);
    }

    // Transform and copy index.json

    const configText = fs.readFileSync("index.json", 'utf8');
    const config = JSON.parse(configText);
    // console.log(config);

    for (const action of config.actions) {
        if (!fs.existsSync(action.icon)) {
            continue;
        }
        const svg = fs.readFileSync(action.icon, 'utf8');
        const buffer = Buffer.from(svg);
        action.icon = `data:image/svg+xml;base64,${buffer.toString("base64")}`;
    }

    const serializedConfig = JSON.stringify(config);
    fs.writeFile("temp/tool/index.json", serializedConfig, 'utf8', function (err) {
        if (err) return console.log(err);
    });

    // TODO: The types could be a folder, not a single file. Talk with harry / alberto

    fs.writeFile("temp/tool/index.d.ts", "", 'utf8', function (err) {
        if (err) return console.log(err);
    });

    // Create zip file
    // src: https://stackoverflow.com/a/18775083/14627620

    if(!fs.existsSync("dist")) {
        fs.mkdirSync("dist");
    }

    const output = fs.createWriteStream(`dist/${config.name}.zip`);
    const archive = archiver('zip');

    output.on('close', function () {
        remove(["temp/tool"]);
        console.log('Tool successfully created!');
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);
    archive.directory("temp/tool", false);

    archive.finalize();

}

module.exports = {zip};

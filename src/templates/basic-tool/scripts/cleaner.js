const fs = require('fs');

const remove = (files) => {
    for (const file of files) {
        if (fs.existsSync(file)) {
            fs.rmSync(file, {recursive: true, force: true});
        }
    }
}

const cleanStart = () => {
    remove(["temp", "dist"]);
}

const cleanEnd = () => {
    remove(["temp"]);
}

module.exports = {cleanStart, cleanEnd, remove};


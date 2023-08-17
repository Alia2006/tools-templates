const fs = require("fs");

const bundle = () => {
    let source = fs.readFileSync("./temp/tool/index.js", 'utf8');
    source = source.replace("import * as THREE from 'three';", "");
    source = source.replace("import * as OBC from 'openbim-components';", "");
    source = source.replace("export { Main };", "");

    // Substitute explicit THREE.js imports by object destructuring

    let explicitThreeImports = source.match(/import *{.*} *from *['"`]three['"`];/);

    let threeExplicits = "";

    if(explicitThreeImports.length) {
        threeExplicits = explicitThreeImports[0];
        threeExplicits = threeExplicits.replace(/import *{/, "");
        threeExplicits = threeExplicits.replace(/} *from *['"`]three['"`];/, "");
    }

    source = source.replace(/import *{.*} *from *['"`]three['"`];/, "");

    if(threeExplicits.length) {
        threeExplicits = `const { ${threeExplicits} } = THREE;`
    }

    const tool = `
window.ThatOpenTool = (OBC, THREE) => {
    ${threeExplicits}

    ${source}

    return Main;
};
`;

    fs.writeFileSync("./temp/tool/index.js", tool, 'utf8');
}

module.exports = {bundle};

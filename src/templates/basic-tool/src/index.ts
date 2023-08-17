import {Tool} from "./types";
import * as OBC from "openbim-components";

import {FragmentsGroup} from "bim-fragment";

export class Main extends Tool<string> {
    group: FragmentsGroup;

    uiElement;

    constructor(components: OBC.Components) {
        const data = "hello world!";
        super(components, data);
        this.group = new FragmentsGroup();

        const Measure = new OBC.Button(components);
        Measure.onclick = () => {
            console.log(this.group);
            console.log("Measure active!");
        }

        Measure.tooltip = "Measure";

        const Camera = new OBC.Button(components);
        Camera.onclick = () => {
            console.log(this.group);
            console.log("Measure active!");
        }

        Camera.tooltip = "Camera";

        this.uiElement = {Measure, Camera};
    }

    log() {
        console.log(this.group);
    }

}
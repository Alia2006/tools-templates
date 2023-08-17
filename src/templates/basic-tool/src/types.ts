import * as OBC from "openbim-components"
import {Components} from "openbim-components";

export class Tool<T> extends OBC.Component<T> implements OBC.UI {

    /** {@link Component.enabled} */
    enabled = true;

    /** {@link Component.name} */
    name = "MainTool";

    protected _data: any;
    protected _components: Components;

    /** {@link UI.uiElement} */
    uiElement = {};

    constructor(components: OBC.Components, data: T) {
        super();
        this._components = components;
        this._data = data;
    }

    /** {@link Component.name} */
    get() {
        return this._data as T;
    }
}
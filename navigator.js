import '../edirom-core-web-components/src/edirom-icon.js';


const templates = {
    desktop: `
<div>
    <style>
        
    </style>
    <div id="navigator-container">
        <h1>Navigator Test Desktop</h1>
    </div>
</div>
`,

    mobile: `<div>
    <style>
        
    </style>
    <div id="navigator-container">
        <h1>Navigator Test Mobile</h1>
    </div>
</div>
`
};


class navigatorElement extends HTMLElement {
    constructor() {
        super();
        let me = this;
        this.mode = this.getAttribute('layout-mode') === 'mobile' ? 'mobile' : 'desktop';
        const template = document.createElement("template");
        template.innerHTML = templates[this.mode];
        this.shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
        this.shadow.append(template.content.cloneNode(true))
        this.navigatorData = {};

        // Elements


        // Event listeners


    }

    static get observedAttributes() {
        return ["navigator-data"];
    }

    // get navigatorData() {
    //     return this.getAttribute("navigator-data");
    // }
    // set navigatorData(value) {
    //     this.setAttribute("navigator-data", value);
    // }

    connectedCallback() {
        console.log("Navigator connected!");
    }

    disconnectedCallback() {
        console.log("Navigator disconnected!");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute: ${name} changed from ${oldValue} to ${newValue}`);
        if (oldValue === newValue) return;
        if (name === "navigator-data") {
            this.navigatorData = JSON.parse(newValue);
            this.renderNavigator();
        }

    }

    renderNavigator = () => {
        console.log("Rendering navigator with data");
    }




}

customElements.define("edirom-navigator", navigatorElement);


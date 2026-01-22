import '../edirom-core-web-components/src/edirom-icon.js';


const templates = {
    desktop: `
<div>
    <style>

    .hidden {
        display: none;
    }

    /* Category headings */
    .navigatorCategory,
    .navigatorCategory2,
    .navigatorCategory3,
    .navigatorCategory4,
    .navigatorCategory5 {
        margin: 0 0 6px 0;
    }


    .navigatorCategoryTitle {
        font-family: inherit;
        font-size: 13px;
        font-weight: 500;
        font-variant: small-caps;
        color: #555;
        margin: 12px 0 4px 0;
    }


    .navigatorItem,
    .navigatorItem2,
    .navigatorItem3,
    .navigatorItem4,
    .navigatorItem5,
    .navigatorCategoryTitle2,
    .navigatorCategoryTitle3,
    .navigatorCategoryTitle4,
    .navigatorCategoryTitle5 {
        font-family: inherit;
        font-size: 13px;
        font-weight: 400;
        margin: 2px 0;
        cursor: pointer;
    }

    /* Indentation per depth */
    .navigatorItem, .navigatorCategoryTitle2 { margin-left: 12px; }
    .navigatorItem2, .navigatorCategoryTitle3 { margin-left: 24px; }
    .navigatorItem3, .navigatorCategoryTitle4 { margin-left: 36px; }
    .navigatorItem4, .navigatorCategoryTitle5 { margin-left: 48px; }
    .navigatorItem5 { margin-left: 60px; }

    .navigatorCategoryTitle2 span,
    .navigatorCategoryTitle3 span,
    .navigatorCategoryTitle4 span,
    .navigatorCategoryTitle5 span {
        display: inline-flex;
        align-items: center;
    }

    .caret-icon {
        position: relative;
        top: -1px;
    }

    </style>
    <div id="navigator-container">
    </div>
</div>
`,

    mobile: `<div>
    <style>

    :host {
        --primary-color: #a3a3a3ff;
        --secondary-color: #565656ff;
        height: 100%;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        overflow-y: auto;
        overflow-x: auto;
    }

    .hidden {
        display: none;
    }

    #navigator-container {
        display: flex;
        flex-direction: column;
        /* align-items: center; removed to allow full width for lines */
        overflow-x: hidden;
        -webkit-user-select: none;
        user-select: none;
    }

    #navigator-container * {
        -webkit-tap-highlight-color: transparent;
    }

    /* Category headings */
    .navigatorCategory,
    .navigatorCategory2,
    .navigatorCategory3,
    .navigatorCategory4,
    .navigatorCategory5 {
        margin: 0 0 6px 0;
        text-align: center;
    }


    .navigatorCategoryTitle {
        font-family: inherit;
        font-size: 1.3rem;
        font-weight: 500;
        font-variant: small-caps;
        color: #555;
        margin: 12px 0 14px 0;
        line-height: 0.5;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .navigatorCategoryTitle::before,
    .navigatorCategoryTitle::after {
        content: '';
        flex: 1;
        height: 1px;
        margin: 0 10px;
    }

    .navigatorCategoryTitle::before {
        background: linear-gradient(to right, transparent, #555);
    }

    .navigatorCategoryTitle::after {
        background: linear-gradient(to right, #555, transparent);
    }


    .navigatorItem,
    .navigatorItem2,
    .navigatorItem3,
    .navigatorItem4,
    .navigatorItem5 {
        color: var(--primary-color);
        width: min(70vw, 400px);
        height: auto;
        min-height: 40px;
        font-size: 1rem;
        margin: 10px auto;
        padding: 5px;
        background-color: var(--secondary-color);
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
    }

    .navigatorCategoryTitle2,
    .navigatorCategoryTitle3,
    .navigatorCategoryTitle4,
    .navigatorCategoryTitle5 {
        font-family: inherit;
        font-size: 1.15rem;
        font-weight: 400;
        color: #555;
        margin: 12px 0 14px 0;
        line-height: 0.5;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .navigatorCategoryTitle2 span,
    .navigatorCategoryTitle3 span,
    .navigatorCategoryTitle4 span,
    .navigatorCategoryTitle5 span {
        display: inline-flex;
        align-items: center;
    }

    .caret-icon {
        position: relative;
        top: -1px;
    }

    </style>
    <div id="navigator-container">
    </div>
</div>
`
};


class navigatorElement extends HTMLElement {
    constructor() {
        super();
        this.mode = this.getLayoutMode(this.getAttribute('layout-mode'));
        this.shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
        this.navigatorData = {};

        // Elements


        // Event listeners


    }

    static get observedAttributes() {
        return ["navigator-data", "layout-mode"];
    }

    // get navigatorData() {
    //     return this.getAttribute("navigator-data");
    // }
    // set navigatorData(value) {
    //     this.setAttribute("navigator-data", value);
    // }

    connectedCallback() {
        console.log("Navigator connected!");
        this.mode = this.getLayoutMode(this.getAttribute('layout-mode'));
        this.applyTemplate();
        this.renderNavigator();
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
        } else if (name === "layout-mode") {
            this.mode = this.getLayoutMode(newValue);
            this.applyTemplate();
            this.renderNavigator();
        }

    }

    getLayoutMode = (layoutMode) => layoutMode === 'mobile' ? 'mobile' : 'desktop';

    applyTemplate = () => {
        const template = document.createElement("template");
        template.innerHTML = templates[this.mode];
        this.shadow.innerHTML = '';
        this.shadow.append(template.content.cloneNode(true));
    }

    renderNavigator = () => {
        if (!this.isConnected) return; // skip until attached
        console.log("Rendering navigator with data");
        const container = this.shadow.getElementById("navigator-container");

        if (!container) return;

        container.innerHTML = '';

        const navigatorDefinition = this.navigatorData?.navigatorDefinition || [];

        navigatorDefinition.forEach(category => {
            let categoryElement = this.renderCategory(category, 1);
            container.appendChild(categoryElement);
        });
        console.log(container.innerHTML);
    }

    renderCategory = (category, depth = 1) => {
        const categoryDiv = document.createElement('div');
        const depthSuffix = depth > 1 ? depth : '';
        categoryDiv.className = `navigatorCategory${depthSuffix}`;
        categoryDiv.id = category.id;

        const titleDiv = document.createElement('div');
        titleDiv.className = `navigatorCategoryTitle${depthSuffix}`;

        if (depth > 1) {
            // Nested categories have collapsible behavior
            const titleSpan = document.createElement('span');
            titleSpan.id = `${category.id}-title`;
            titleSpan.className = 'folded';
            titleSpan.textContent = category.name;

            const caretIcon = document.createElement('edirom-icon');
            caretIcon.className = 'caret-icon';
            caretIcon.name = 'arrow_right';
            titleSpan.appendChild(caretIcon);

            titleDiv.addEventListener('click', () => {
                const itemsDiv = this.shadow.getElementById(`${category.id}-items`);
                if (titleSpan.classList.contains('folded')) {
                    titleSpan.classList.remove('folded');
                    caretIcon.name = 'arrow_drop_down';
                    itemsDiv.classList.remove('hidden');
                } else {
                    titleSpan.classList.add('folded');
                    caretIcon.name = 'arrow_right';
                    itemsDiv.classList.add('hidden');
                }
            });

            titleDiv.appendChild(titleSpan);
        } else {
            const titleSpan = document.createElement('span');
            titleSpan.id = `${category.id}-title`;
            titleSpan.textContent = category.name;
            titleDiv.appendChild(titleSpan);
        }

        categoryDiv.appendChild(titleDiv);

        // Create items container
        const itemsDiv = document.createElement('div');
        itemsDiv.id = `${category.id}-items`;
        itemsDiv.className = depth > 1 ? 'hidden' : '';

        if (category.items) {
            category.items.forEach(item => {
                if (item.type === 'navigatorCategory') {
                    // Nested category - increase depth
                    const nestedCategory = this.renderCategory(item, depth + 1);
                    itemsDiv.appendChild(nestedCategory);
                } else if (item.type === 'navigatorItem') {
                    // Regular item
                    const itemDiv = this.renderItem(item, depth);
                    itemsDiv.appendChild(itemDiv);
                }
            });
        }

        categoryDiv.appendChild(itemsDiv);
        return categoryDiv;
    }

    renderItem = (item, depth = 1) => {
        const itemDiv = document.createElement('div');
        const depthSuffix = depth > 1 ? depth : '';
        itemDiv.className = `navigatorItem${depthSuffix}`;
        itemDiv.id = item.id;
        itemDiv.textContent = item.name;

        itemDiv.addEventListener('click', () => {
            this.loadLink(item.target, {});
        });

        return itemDiv;
    }

    loadLink = (target, options) => {
        console.log('Loading link:', target, options);
        // Dispatch a custom event that parent components can listen to
        this.dispatchEvent(new CustomEvent('load-link-request', {
            bubbles: true,
            composed: true,
            detail: { target, options }
        }));
    }

}

customElements.define("edirom-navigator", navigatorElement);


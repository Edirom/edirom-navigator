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

    /* Top-level category title: mono + uppercase */
    .navigatorCategoryTitle {
        font-family: "SFMono-Regular", "Courier New", monospace;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        font-size: 0.85rem;
        color: #555;
        margin: 12px 0 4px 0;
    }


    /* Items */
    .navigatorItem,
    .navigatorItem2,
    .navigatorItem3,
    .navigatorItem4,
    .navigatorItem5,
    .navigatorCategoryTitle2,
    .navigatorCategoryTitle3,
    .navigatorCategoryTitle4,
    .navigatorCategoryTitle5 {
        font-family: "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        font-weight: 400;
        margin: 2px 0;
        cursor: pointer;
    }

    /* Indentation per depth (items only) */
    .navigatorItem, .navigatorCategoryTitle2 { margin-left: 12px; }
    .navigatorItem2, .navigatorCategoryTitle3 { margin-left: 24px; }
    .navigatorItem3, .navigatorCategoryTitle4 { margin-left: 36px; }
    .navigatorItem4, .navigatorCategoryTitle5 { margin-left: 48px; }
    .navigatorItem5 { margin-left: 60px; }

    /* Minor caret alignment */
    .fa-fw { width: 14px; text-align: center; }

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
        const container = this.shadow.getElementById("navigator-container");

        container.innerHTML = '';

        const navigatorDefinition = this.navigatorData.navigatorDefinition || [];

        navigatorDefinition.forEach(category => {
            const categoryElement = this.renderCategory(category, 1);
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

            const caretIcon = document.createElement('i');
            caretIcon.className = 'fa fa-caret-right fa-fw';
            titleSpan.appendChild(caretIcon);

            titleSpan.addEventListener('click', () => {
                const itemsDiv = this.shadow.getElementById(`${category.id}-items`);
                if (titleSpan.classList.contains('folded')) {
                    titleSpan.classList.remove('folded');
                    caretIcon.classList.remove('fa-caret-right');
                    caretIcon.classList.add('fa-caret-down');
                    itemsDiv.classList.remove('hidden');
                } else {
                    titleSpan.classList.add('folded');
                    caretIcon.classList.remove('fa-caret-down');
                    caretIcon.classList.add('fa-caret-right');
                    itemsDiv.classList.add('hidden');
                }
            });

            titleDiv.appendChild(titleSpan);
        } else {
            titleDiv.textContent = category.name;
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
        this.dispatchEvent(new CustomEvent('navigator-link-click', {
            bubbles: true,
            composed: true,
            detail: { target, options }
        }));
    }




}

customElements.define("edirom-navigator", navigatorElement);


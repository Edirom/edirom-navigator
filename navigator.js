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

    /* Keep icon and label visually separated inside buttons */
    .navigatorItem edirom-icon,
    .navigatorItem2 edirom-icon,
    .navigatorItem3 edirom-icon,
    .navigatorItem4 edirom-icon,
    .navigatorItem5 edirom-icon {
        margin-right: 6px;
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

    .navigatorItem edirom-icon,
    .navigatorItem2 edirom-icon,
    .navigatorItem3 edirom-icon,
    .navigatorItem4 edirom-icon,
    .navigatorItem5 edirom-icon {
        margin-right: 5px;
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
    }

    static get observedAttributes() {
        return ["navigator-data", "layout-mode"];
    }

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

    /**
     * Parses a targets string into a URI target and a typed config object.
     *
     * The targets string consists of one or more space-separated URIs, with an
     * optional single config block in square brackets anywhere in the string.
     * Config key-value pairs are separated by commas; keys and values are
     * separated by `=` or `:`.
     *
     * Value types are inferred automatically:
     *   - Quoted values ('...' or "...") → string (quotes stripped)
     *   - `true` / `false`               → boolean
     *   - Numeric values (int or float)  → number
     *   - `[item1, item2, ...]`          → array (items are also type-inferred)
     *   - Anything else                  → string
     *
     * Only the first config block is used; any further `[...]` occurrences are
     * stripped from the target string. Multiple spaces in the resulting target
     * are collapsed to a single space.
     *
     * @param {string} targets - The raw targets attribute value.
     * @returns {{ target: string, config: Object }} Parsed target URI(s) and config.
     *
     * @example
     * // Single URI, no config
     * parseTargets('xmldb:exist:///db/apps/foo.xml')
     * // → { target: 'xmldb:exist:///db/apps/foo.xml', config: {} }
     *
     * @example
     * // Multiple URIs, config on first
     * parseTargets('foo.xml[page=2, label='Intro'] bar.xml')
     * // → { target: 'foo.xml bar.xml', config: { page: 2, label: 'Intro' } }
     *
     * @example
     * // Type inference: boolean, number, string, array
     * parseTargets('foo.xml[active=true, scale=1.25, mode=overview, ids=[a,b,c]]')
     * // → { target: 'foo.xml', config: { active: true, scale: 1.25, mode: 'overview', ids: ['a','b','c'] } }
     *
     * @example
     * // Array of numbers, colon separator
     * parseTargets('foo.xml[counts:[1,2,3]]')
     * // → { target: 'foo.xml', config: { counts: [1, 2, 3] } }
     *
     * @example
     * // Config in the middle, extra bracket blocks stripped
     * parseTargets('foo.xml[sort=sortGrid][ignored] bar.xml')
     * // → { target: 'foo.xml bar.xml', config: { sort: 'sortGrid' } }
     */
    parseTargets = (targets) => {
        console.log('Parsing targets:', targets);
        if (!targets) return { target: '', config: {} };

        // Splits a string on commas, but only at bracket depth 0 —
        // so commas inside array values like [a,b,c] are not treated as pair separators.
        const splitAtDepthZero = (s) => {
            const parts = [];
            let depth = 0, current = '';
            for (const ch of s) {
                if (ch === '[') { depth++; current += ch; }
                else if (ch === ']') { depth--; current += ch; }
                else if (ch === ',' && depth === 0) { parts.push(current); current = ''; }
                else { current += ch; }
            }
            if (current) parts.push(current); // push last segment (no trailing comma)
            return parts;
        };

        // Infers the JS type of a single config value string.
        const parseValue = (v) => {
            if ((v.startsWith("'") && v.endsWith("'")) || (v.startsWith('"') && v.endsWith('"')))
                return v.slice(1, -1);                              // quoted → string, strip quotes
            if (v === 'true') return true;
            if (v === 'false') return false;
            if (v !== '' && !isNaN(v) && isFinite(v)) return Number(v); // v !== '' guards against isNaN('') === false
            if (v.startsWith('[') && v.endsWith(']'))
                return splitAtDepthZero(v.slice(1, -1)).map(item => parseValue(item.trim())); // recurse for arrays
            return v;                                               // fallback: plain string
        };

        // Walk the string character-by-character to find the first outermost [...]
        // (a simple regex can't handle nested brackets like [sort=[a,b,c]])
        let configStart = -1, depth = 0, configEnd = -1;
        for (let i = 0; i < targets.length; i++) {
            if (targets[i] === '[') {
                if (depth === 0) configStart = i; // record opening of outermost block
                depth++;
            } else if (targets[i] === ']') {
                depth--;
                if (depth === 0 && configStart !== -1) {
                    configEnd = i; // found the matching close bracket
                    break;
                }
            }
        }

        // Remove the config block (and any subsequent [...] blocks) from the URI string,
        // then collapse any resulting double spaces.
        const target = (configStart === -1
            ? targets
            : targets.slice(0, configStart) + targets.slice(configEnd + 1)
        ).replace(/\s+/g, ' ').trim();

        if (configStart === -1) return { target, config: {} };

        const cfgString = targets.slice(configStart + 1, configEnd);
        const config = Object.fromEntries(
            splitAtDepthZero(cfgString)
                .map(pair => pair.split(/[=:](.*)/).slice(0, 2)) // split on first = or :, keep rest of value intact
                .filter(([k]) => k?.trim())                      // discard malformed pairs with empty keys
                .map(([k, v]) => [k.trim(), parseValue(v?.trim() ?? '')])
        );
        return { target, config };
    }

    isExternalLinkTarget = (item) => {
        const startsWithWebPrefix = (value) => typeof value === 'string' && (value.startsWith('http') || value.startsWith('www'));
        const { target } = this.parseTargets(item?.targets);
        return startsWithWebPrefix(target);
    }

    renderItem = (item, depth = 1) => {
        const itemDiv = document.createElement('div');
        const depthSuffix = depth > 1 ? depth : '';
        itemDiv.className = `navigatorItem${depthSuffix}`;
        itemDiv.id = item.id;

        if (this.mode === 'mobile' && this.isExternalLinkTarget(item)) {
            const linkIcon = document.createElement('edirom-icon');
            linkIcon.setAttribute('name', 'open_in_new');
            itemDiv.appendChild(linkIcon);
            itemDiv.appendChild(document.createTextNode(item.name));
        } else {
            itemDiv.textContent = item.name;
        }

        itemDiv.addEventListener('click', () => {
            const { target, config } = this.parseTargets(item.targets);
            this.dispatchLoadLinkRequest(target, config);
        });

        return itemDiv;
    }

    dispatchLoadLinkRequest = (target, config) => {
        console.log('Requesting to load link:', target, config);
        // Dispatch a custom event that parent components can listen to
        this.dispatchEvent(new CustomEvent('load-link-request', {
            bubbles: true,
            composed: true,
            detail: { target, config }
        }));
    }

}

customElements.define("edirom-navigator", navigatorElement);


// Colors shared by both layouts: the host page themes the component via --primary-color and
// --secondary-color (see README "Styling"); the rules below only read the private --_nav-* aliases.
const themeTokens = `
        --_nav-primary: var(--primary-color, currentcolor);
        --_nav-secondary: var(--secondary-color, #cacaca);
        --_nav-muted: #555;
`;

// Minimum horizontal travel of a swipe, and how steep it may be (|dy| / |dx|) before it counts as scrolling
const SWIPE_MIN_DISTANCE = 50;
const SWIPE_MAX_SLOPE = 0.6;

// Rules that both layouts have in common. A layout's own rules follow and override them where they differ.
const sharedStyles = `
    :host {${themeTokens}    }

    .hidden {
        display: none;
    }

    /* Tabs: the bar is rendered whenever navigator-data is an array. Each layout sizes and shapes them. */
    .tab {
        font-family: inherit;
        color: var(--_nav-muted);
        background: none;
        border: 0;
        cursor: pointer;
    }

    .tab[aria-selected="true"] {
        color: var(--_nav-primary);
    }

    /* Signals that an unselected tab was just created */
    .tab.flash:not([aria-selected="true"]) {
        animation: tab-flash 1.2s ease-out;
    }

    @keyframes tab-flash {
        0%, 40% { background-color: var(--_nav-flash); }
        100% { background-color: transparent; }
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
        font-weight: 500;
        font-variant: small-caps;
        color: var(--_nav-muted);
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

    .no-content-message {
        font-family: inherit;
        font-weight: 400;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        text-align: center;
        padding: 16px;
        box-sizing: border-box;
    }
`;

const layoutStyles = {
    desktop: `
    :host {
        --_nav-flash: var(--_nav-secondary);
    }

    /* Tab bar: an underlined row */
    .tab-list {
        display: flex;
        gap: 4px;
        margin: 0 0 6px 0;
        border-bottom: 1px solid var(--_nav-secondary);
    }

    .tab {
        font-size: 13px;
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
        padding: 3px 8px;
    }

    .tab:hover {
        color: var(--_nav-primary);
    }

    .tab[aria-selected="true"] {
        border-bottom-color: var(--_nav-primary);
    }

    .navigatorCategoryTitle {
        font-size: 13px;
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

    /* Keep icon and label visually separated inside buttons */
    .navigatorItem edirom-icon,
    .navigatorItem2 edirom-icon,
    .navigatorItem3 edirom-icon,
    .navigatorItem4 edirom-icon,
    .navigatorItem5 edirom-icon {
        margin-right: 6px;
    }

    .no-content-message {
        font-size: 13px;
        color: var(--_nav-muted);
    }
`,

    mobile: `
    :host {
        --_nav-flash: var(--_nav-secondary);
        --_tabs-height: 1.8rem;
        display: block;
        height: 100%;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        overflow: hidden;
    }

    #navigator-container {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        -webkit-user-select: none;
        user-select: none;
    }

    #navigator-container * {
        -webkit-tap-highlight-color: transparent;
    }

    /* Tab bar: a slim segmented control, tinted from the theme colors so that it stays in the background.
       It floats above the panels (which scroll underneath, blurred through the translucent bar), and
       nothing is visible above it. Swiping the panels switches tabs, too. */
    #navigator-tabs {
        position: absolute;
        top: 8px;
        left: 0;
        right: 0;
        z-index: 1;
    }

    .tab-list {
        display: flex;
        gap: 2px;
        width: min(calc(100% - 32px), 400px);
        height: var(--_tabs-height);
        margin: 0 auto;
        padding: 2px;
        box-sizing: border-box;
        border-radius: 8px;
        -webkit-backdrop-filter: blur(6px);
        backdrop-filter: blur(6px);
        box-shadow: 0 2px 6px color-mix(in srgb, var(--_nav-primary) 22%, transparent);
        background-color: color-mix(in srgb, var(--_nav-secondary) 50%, transparent);
    }

    .tab {
        flex: 1 1 0;
        min-width: 0;
        padding: 0 10px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background-color 0.2s ease, color 0.2s ease;
    }

    .tab[aria-selected="true"] {
        color: var(--_nav-secondary);
        background-color: color-mix(in srgb, var(--_nav-primary) 87%, transparent);
    }

    /* The panels scroll, the tab bar above them stays in place. Vertical panning is left to the browser,
       horizontal gestures are reported to the swipe handling in the script. */
    #navigator-panels {
        flex: 1 1 auto;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        touch-action: pan-y pinch-zoom;
    }

    /* With a tab bar the panels start below the strip above it, and are padded by the height of the bar
       plus the gap, so that they begin under the bar and scroll up behind it. */
    #navigator-tabs:not(:empty) + #navigator-panels {
        margin-top: 8px;
        padding-top: calc(var(--_tabs-height) + 8px);
    }

    .tab-panel:not(.hidden) {
        display: flex;
        flex-direction: column;
    }

    /* The panel of a tab that was just switched to slides in from the side it lies on */
    .tab-panel[data-enter] {
        animation: tab-enter 0.22s ease-out;
    }

    .tab-panel[data-enter="next"] { --_enter-from: 28px; }
    .tab-panel[data-enter="prev"] { --_enter-from: -28px; }

    @keyframes tab-enter {
        from { opacity: 0; transform: translateX(var(--_enter-from)); }
        to { opacity: 1; transform: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        .tab { transition: none; }
        .tab-panel[data-enter] { animation: none; }
    }

    .navigatorCategory,
    .navigatorCategory2,
    .navigatorCategory3,
    .navigatorCategory4,
    .navigatorCategory5 {
        text-align: center;
    }


    .navigatorCategoryTitle {
        font-size: 1.3rem;
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
        background: linear-gradient(to right, transparent, var(--_nav-muted));
    }

    .navigatorCategoryTitle::after {
        background: linear-gradient(to right, var(--_nav-muted), transparent);
    }


    .navigatorItem,
    .navigatorItem2,
    .navigatorItem3,
    .navigatorItem4,
    .navigatorItem5 {
        color: var(--_nav-primary);
        width: min(70vw, 400px);
        height: auto;
        min-height: 40px;
        font-size: 1rem;
        margin: 10px auto;
        padding: 5px;
        background-color: var(--_nav-secondary);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        cursor: pointer;
        border-radius: 6px;
    }

    .icons-div {
        display: flex;
        gap: 4px;
        color: #706f6f94;
    }

    .navigatorCategoryTitle2,
    .navigatorCategoryTitle3,
    .navigatorCategoryTitle4,
    .navigatorCategoryTitle5 {
        font-family: inherit;
        font-size: 1.15rem;
        font-weight: 400;
        color: var(--_nav-muted);
        margin: 12px 0 14px 0;
        line-height: 0.5;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .no-content-message {
        font-size: 1rem;
        color: var(--_nav-primary);
    }
`
};

const templates = Object.fromEntries(Object.entries(layoutStyles).map(([mode, styles]) => [mode, `
    <style>${sharedStyles}${styles}</style>
    <div id="navigator-container">
        <div id="navigator-tabs"></div>
        <div id="navigator-panels"></div>
    </div>
`]));


class navigatorElement extends HTMLElement {
    constructor() {
        super();
        this.mode = this.getLayoutMode(this.getAttribute('layout-mode'));
        this.shadow = this.attachShadow({ mode: "open", delegatesFocus: true });
        this.tabs = this.normalizeTabs(null);
        this.tabIds = null; // ids of the last navigator-data with tabs; null until the first one arrived
        this.flashTabIds = new Set();
        this.showTabBar = false;
        this.activeTab = null;
        this.renderedActiveId = null; // the tab that was active after the last render; null until the first one
        this.swipeStart = null;
        this.panelCache = new Map();
        this.noContentMessage = '';

        this.shadow.addEventListener('pointerdown', this.onSwipeStart);
        this.shadow.addEventListener('pointerup', this.onSwipeEnd);
        this.shadow.addEventListener('pointercancel', () => { this.swipeStart = null; });
    }

    static get observedAttributes() {
        return ["navigator-data", "layout-mode", "no-content-message", "active-tab"];
    }

    connectedCallback() {
        console.log("Navigator connected");
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
            let data = null;
            try {
                data = JSON.parse(newValue);
            } catch (error) {
                console.warn("Invalid navigator-data attribute payload", error);
            }
            const previousIds = this.tabIds;
            this.tabs = this.normalizeTabs(data);
            this.showTabBar = Array.isArray(data) && data.length > 0;
            // Only data with tabs counts: a tab that returns after a legacy (tab-less) object is not new
            if (this.showTabBar) this.tabIds = new Set(this.tabs.map(tab => tab.id));
            // The first navigator-data is the initial state, not a new tab
            this.flashTabIds = this.showTabBar && previousIds ? this.findNewTabIds(previousIds) : new Set();
            this.renderNavigator();
        } else if (name === "layout-mode") {
            this.mode = this.getLayoutMode(newValue);
            this.applyTemplate();
            this.renderNavigator();
        } else if (name === "no-content-message") {
            this.noContentMessage = newValue || '';
            this.renderNavigator();
        } else if (name === "active-tab") {
            this.activeTab = newValue;
            this.updateActiveTab();
        }

    }

    getLayoutMode = (layoutMode) => layoutMode === 'mobile' ? 'mobile' : 'desktop';

    // Accepts the legacy object `{ navigatorDefinition }` (one tab, no tab bar)
    // or an array of `{ id, name, navigatorDefinition }` (a tab bar, even for a single entry)
    normalizeTabs = (data) =>
        (Array.isArray(data) && data.length ? data : [data]).map((tab, i) => ({
            id: String(tab?.id ?? `tab-${i}`),
            name: tab?.name ?? '',
            navigatorDefinition: tab?.navigatorDefinition || []
        }));

    // Ids of the unselected tabs that did not exist in the previous navigator-data
    findNewTabIds = (previousIds) => {
        const activeId = this.getActiveTabId();
        return new Set(this.tabs
            .filter(tab => tab.id !== activeId && !previousIds.has(tab.id))
            .map(tab => tab.id));
    }

    // The requested tab if it exists, otherwise the first one (the attribute is left untouched)
    getActiveTabId = () => (this.tabs.find(tab => tab.id === this.activeTab) ?? this.tabs[0]).id;

    applyTemplate = () => {
        const template = document.createElement("template");
        template.innerHTML = templates[this.mode];
        this.shadow.innerHTML = '';
        this.shadow.append(template.content.cloneNode(true));
        this.panelCache = new Map();
        this.renderedActiveId = null;
    }

    renderNavigator = () => {
        // Flash once when the tab is created, not on every later render
        const flashTabIds = this.flashTabIds;
        this.flashTabIds = new Set();

        if (!this.isConnected) return; // skip until attached
        console.log("Rendering navigator with data");
        const tabsMount = this.shadow.getElementById("navigator-tabs");
        const panelsMount = this.shadow.getElementById("navigator-panels");

        if (!tabsMount || !panelsMount) return;

        tabsMount.replaceChildren(...(this.showTabBar ? [this.renderTabList(flashTabIds)] : []));

        const previousPanels = this.panelCache;
        this.panelCache = new Map();
        const rebuiltTabIds = new Set();
        const panels = this.tabs.map((tab, i) => {
            const cached = previousPanels.get(tab.id);
            const panel = this.getPanel(tab, cached);
            if (panel !== cached?.panel) rebuiltTabIds.add(tab.id);
            if (this.showTabBar) {
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', `navigator-tab-${i}`);
            } else {
                panel.removeAttribute('role');
                panel.removeAttribute('aria-labelledby');
            }
            return panel;
        });
        panelsMount.replaceChildren(...panels);

        this.updateActiveTab();

        // New content starts at the top
        if (rebuiltTabIds.has(this.getActiveTabId())) panelsMount.scrollTop = 0;
    }

    // Reuses the previous panel if its definition is unchanged, so fold state survives re-renders
    // triggered by another tab's data. Empty panels are always rebuilt (they show no-content-message).
    getPanel = (tab, cached) => {
        const signature = JSON.stringify(tab.navigatorDefinition);
        const panel = cached && tab.navigatorDefinition.length > 0 && cached.signature === signature
            ? cached.panel
            : this.renderPanel(tab);
        this.panelCache.set(tab.id, { signature, panel });
        return panel;
    }

    renderPanel = (tab) => {
        const panel = document.createElement('div');
        panel.className = 'tab-panel';
        panel.dataset.tabId = tab.id;
        panel.addEventListener('animationend', (event) => {
            if (event.target === panel) delete panel.dataset.enter;
        });

        if (tab.navigatorDefinition.length === 0) {
            if (this.noContentMessage) {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'no-content-message';
                messageDiv.textContent = this.noContentMessage;
                panel.appendChild(messageDiv);
            }
            return panel;
        }

        tab.navigatorDefinition.forEach(category => {
            panel.appendChild(this.renderCategory(category, 1));
        });
        return panel;
    }

    renderTabList = (flashTabIds = new Set()) => {
        const list = document.createElement('div');
        list.className = 'tab-list';
        list.setAttribute('role', 'tablist');

        this.tabs.forEach((tab, i) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'tab';
            button.id = `navigator-tab-${i}`;
            button.dataset.tabId = tab.id;
            button.setAttribute('role', 'tab');
            button.textContent = tab.name;
            if (flashTabIds.has(tab.id)) {
                button.classList.add('flash');
                button.addEventListener('animationend', () => button.classList.remove('flash'), { once: true });
            }
            button.addEventListener('click', () => this.selectTab(tab.id));
            list.appendChild(button);
        });

        list.addEventListener('keydown', this.onTabKeydown);
        return list;
    }

    onTabKeydown = (event) => {
        const buttons = [...this.shadow.querySelectorAll('.tab')];
        const current = buttons.indexOf(event.target.closest('.tab'));
        const targets = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: buttons.length - 1 };
        if (current < 0 || !(event.key in targets)) return;

        event.preventDefault();
        const next = buttons[(targets[event.key] + buttons.length) % buttons.length];
        this.selectTab(next.dataset.tabId);
        next.focus();
    }

    // Every way the user can switch tabs (click, keys, swipe) ends here. Setting active-tab from the
    // host stays silent, like the value of an input, so the host does not hear about its own changes.
    selectTab = (id) => {
        const previousId = this.getActiveTabId();
        this.setAttribute('active-tab', id);
        if (id !== previousId) {
            this.dispatchEvent(new CustomEvent('active-tab-changed', {
                bubbles: true,
                composed: true,
                detail: { activeTab: id }
            }));
        }
    }

    // Swiping is a mobile gesture. The panels leave horizontal gestures to the page (touch-action: pan-y),
    // so a finger that moves mostly sideways ends in a pointerup that is recognized here.
    onSwipeStart = (event) => {
        this.swipeStart = null;
        if (this.mode !== 'mobile' || !event.isPrimary || event.pointerType === 'mouse') return;
        if (!event.target.closest?.('#navigator-panels')) return;
        this.swipeStart = { x: event.clientX, y: event.clientY };
    }

    onSwipeEnd = (event) => {
        const start = this.swipeStart;
        this.swipeStart = null;
        if (!start) return;

        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) < SWIPE_MIN_DISTANCE || Math.abs(dy) > Math.abs(dx) * SWIPE_MAX_SLOPE) return;

        // Swiping left pulls the next tab in from the right
        this.selectNeighbourTab(dx < 0 ? 1 : -1);
    }

    selectNeighbourTab = (step) => {
        const activeId = this.getActiveTabId();
        const neighbour = this.tabs[this.tabs.findIndex(tab => tab.id === activeId) + step];
        if (neighbour) this.selectTab(neighbour.id);
    }

    updateActiveTab = () => {
        const activeId = this.getActiveTabId();
        const previousId = this.renderedActiveId;
        const switched = previousId !== null && previousId !== activeId;
        const ids = this.tabs.map(tab => tab.id);
        // Which side the newly active panel comes from, for layouts that animate the switch.
        // Unknown if the previous tab is gone.
        const enter = switched && ids.includes(previousId)
            ? (ids.indexOf(activeId) > ids.indexOf(previousId) ? 'next' : 'prev')
            : null;
        this.renderedActiveId = activeId;

        this.shadow.querySelectorAll('.tab-panel').forEach(panel => {
            const active = panel.dataset.tabId === activeId;
            panel.classList.toggle('hidden', !active);
            if (active && enter) {
                panel.dataset.enter = enter;
            } else {
                delete panel.dataset.enter;
            }
        });
        // A tab is shown from its top, not at the scroll position of the one before
        if (switched) this.shadow.getElementById('navigator-panels').scrollTop = 0;

        this.shadow.querySelectorAll('.tab').forEach(button => {
            const selected = button.dataset.tabId === activeId;
            if (selected) button.classList.remove('flash');
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
        });
    }

    renderCategory = (category, depth = 1) => {
        const categoryDiv = document.createElement('div');
        const depthSuffix = depth > 1 ? depth : '';
        categoryDiv.className = `navigatorCategory${depthSuffix}`;
        categoryDiv.id = category.id;

        const itemsDiv = document.createElement('div');
        itemsDiv.id = `${category.id}-items`;
        itemsDiv.className = depth > 1 ? 'hidden' : '';

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

        const itemNameDiv = document.createElement('div');
        itemNameDiv.appendChild(document.createTextNode(item.name));
        itemDiv.appendChild(itemNameDiv);

        if (this.mode === 'mobile') {
            const iconsDiv = document.createElement('div');
            iconsDiv.classList.add('icons-div');
            itemDiv.appendChild(iconsDiv);
            for (const icon of item.icons || []) {
                const itemIcon = document.createElement('edirom-icon');
                itemIcon.setAttribute('name', icon);
                itemIcon.setAttribute('size', '1.15rem');
                iconsDiv.appendChild(itemIcon);
            }
        }

        // itemDiv.textContent = item.name;

        itemDiv.addEventListener('click', () => {
            this.dispatchLoadLinksRequest(item.targets);
        });

        return itemDiv;
    }

    dispatchLoadLinksRequest = (targets) => {
        console.log('Requesting to load links:', targets);
        // Dispatch a custom event that parent components can listen to
        this.dispatchEvent(new CustomEvent('load-links-request', {
            bubbles: true,
            composed: true,
            detail: targets
        }));
    }

}

customElements.define("edirom-navigator", navigatorElement);

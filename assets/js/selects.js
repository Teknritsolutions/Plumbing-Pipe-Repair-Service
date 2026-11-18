/* Accessible, progressively enhanced dropdowns with Flowline interaction colors. */
(() => {
    const widgets = [];
    document.querySelectorAll('main select').forEach((select, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'branded-select';
        select.before(wrapper);
        wrapper.append(select);
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'select-trigger';
        trigger.id = `${select.id || `select-${index}`}-trigger`;
        trigger.setAttribute('role', 'combobox');
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        const label = document.querySelector(`label[for="${select.id}"]`);
        if (label) {
            label.id ||= `${trigger.id}-label`;
            trigger.setAttribute('aria-labelledby', `${label.id} ${trigger.id}-value`);
        } else trigger.setAttribute('aria-label', select.getAttribute('aria-label') || 'Choose an option');
        const value = document.createElement('span');
        value.id = `${trigger.id}-value`;
        trigger.append(value);
        trigger.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5"/></svg>');
        const list = document.createElement('div');
        list.className = 'select-options';
        list.id = `${trigger.id}-options`;
        list.setAttribute('role', 'listbox');
        if (label) list.setAttribute('aria-labelledby', label.id);
        list.hidden = true;
        trigger.setAttribute('aria-controls', list.id);
        wrapper.append(trigger, list);
        select.classList.add('enhanced-native-select');
        select.tabIndex = -1;
        select.setAttribute('aria-hidden', 'true');
        const options = [...select.options].filter(option => !option.disabled && option.value !== '');
        let active = -1;
        const entries = options.map((option, i) => {
            const entry = document.createElement('div');
            entry.className = 'select-option';
            entry.id = `${list.id}-${i}`;
            entry.setAttribute('role', 'option');
            entry.textContent = option.textContent;
            entry.addEventListener('pointerenter', () => highlight(i));
            entry.addEventListener('pointerdown', event => event.preventDefault());
            entry.addEventListener('click', () => choose(i));
            list.append(entry);
            return entry;
        });
        const highlight = i => {
            active = i;
            entries.forEach((entry, j) => entry.classList.toggle('is-highlighted', j === i));
            if (i >= 0) {
                trigger.setAttribute('aria-activedescendant', entries[i].id);
                entries[i].scrollIntoView({ block: 'nearest' });
            } else trigger.removeAttribute('aria-activedescendant');
        };
        const close = () => {
            list.hidden = true;
            trigger.setAttribute('aria-expanded', 'false');
            highlight(-1);
        };
        const update = () => {
            value.textContent = select.selectedOptions[0]?.textContent || 'Choose an option';
            trigger.classList.toggle('is-placeholder', !select.value);
            trigger.disabled = select.disabled;
            trigger.setAttribute('aria-required', String(select.required));
            trigger.setAttribute('aria-invalid', select.getAttribute('aria-invalid') || 'false');
            const described = select.getAttribute('aria-describedby');
            if (described) trigger.setAttribute('aria-describedby', described);
            entries.forEach((entry, i) => entry.setAttribute('aria-selected', String(options[i].value === select.value)));
        };
        const open = () => {
            widgets.forEach(widget => widget.close());
            list.hidden = false;
            trigger.setAttribute('aria-expanded', 'true');
            highlight(-1);
        };
        const choose = i => {
            if (!options[i]) return;
            select.value = options[i].value;
            select.dispatchEvent(new Event('input', { bubbles: true }));
            select.dispatchEvent(new Event('change', { bubbles: true }));
            update();
            close();
            trigger.focus();
        };
        trigger.addEventListener('click', () => list.hidden ? open() : close());
        let typed = '', typingTimer;
        trigger.addEventListener('keydown', event => {
            if (['ArrowDown','ArrowUp','Home','End','Enter',' '].includes(event.key)) {
                event.preventDefault();
                if (event.key === 'Enter' || event.key === ' ') {
                    if (list.hidden) open();
                    else if (active >= 0) choose(active);
                    else close();
                    return;
                }
                if (list.hidden) open();
                let next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : event.key === 'ArrowDown' ? (active + 1) % options.length : (active < 0 ? options.length - 1 : (active - 1 + options.length) % options.length);
                if (options.length) highlight(next);
            } else if (event.key === 'Escape') { event.preventDefault(); close(); }
            else if (event.key === 'Tab') close();
            else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
                clearTimeout(typingTimer);
                typed += event.key.toLowerCase();
                if (list.hidden) open();
                const i = options.findIndex(option => option.textContent.toLowerCase().startsWith(typed));
                if (i >= 0) highlight(i);
                typingTimer = setTimeout(() => typed = '', 700);
            }
        });
        wrapper.addEventListener('focusout', event => { if (!wrapper.contains(event.relatedTarget)) close(); });
        select.addEventListener('focus', () => trigger.focus());
        select.addEventListener('change', update);
        select.form?.addEventListener('reset', () => setTimeout(update, 0));
        new MutationObserver(update).observe(select, { attributes: true, attributeFilter: ['aria-invalid','aria-describedby','disabled'] });
        document.addEventListener('click', event => { if (!wrapper.contains(event.target)) close(); });
        widgets.push({ close });
        update();
    });
})();

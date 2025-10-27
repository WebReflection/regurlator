/*!
 * Copyright 2025 Andrea Giammarchi
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(browser => {
  const storage = browser.storage.local;
  const regurlator = document.querySelector('#regurlator');

  storage.get('rules', data => {
    let rules = data.rules || [];

    regurlator.addEventListener('submit', event => {
      event.preventDefault();

      rules.push({
        regexp: regexp.value,
        redirect: redirect.value,
        auto: auto.checked,
      });

      storage.set({ rules });
    });

    const add = document.querySelector('.add');
    const regexp = add.querySelector('input[name="regexp"]');
    const redirect = add.querySelector('input[name="redirect"]');
    const auto = add.querySelector('input[name="auto"]');
    const apply = add.querySelector('button');

    const restore = document.querySelector('input[name="restore"]');
    const save = document.querySelector('button[name="save"]');

    restore.addEventListener('change', event => {
      dropEvent(event);
      const [file] = restore.files;
      if (file) {   
        const reader = new FileReader;
        reader.onload = onJSONRead;
        reader.readAsText(file);
        restore.value = '';
      }
    });

    save.addEventListener('click', event => {
      dropEvent(event);
      const json = JSON.stringify(rules, null, 2);
      const file = new File([json], 'regurlator.json', { type: 'application/json' });
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'regurlator.json';
      a.click();
    });

    regexp.addEventListener('input', event => {
      regexp.setCustomValidity('');
    });

    apply.addEventListener('click', event => {
      const s = regexp.value.trim();
      const r = redirect.value.trim();

      // ignore empty values
      if (s === '' || r === '')  return;

      // ignore duplicated values
      if (rules.find(({ regexp }) => regexp === s))
        return regexp.setCustomValidity('Duplicated');

      // ignore invalid RegExp
      try { new RegExp(s) }
      catch { return regexp.setCustomValidity('Invalid RegExp') }

      // ignore if not the active element
      if (document.activeElement !== apply) return dropEvent(event);

      // otherwise add the new rule and move on ...
      addRow();

      requestAnimationFrame(() => {
        regexp.value = '';
        redirect.value = '';
        regexp.focus();
      });
    });

    for (const rule of rules) addRow(rule);

    function addRow(rule) {
      const tr = add.cloneNode(true);
      tr.classList.remove('add');
      for (const input of tr.querySelectorAll('input')) {
        if (input.name === 'auto') {
          if (rule) input.checked = rule.auto;
          input.addEventListener('change', changeAuto);
          continue;
        }
        if (rule) input.value = rule[input.name];
        input.disabled = true;
        input.title = input.value;
      }

      const remove = tr.querySelector('button');
      remove.title = 'Remove';
      remove.textContent = '➖';
      remove.addEventListener('click', removeRule);

      add.parentNode.insertBefore(tr, add);
    }

    function changeAuto(event) {
      const { currentTarget } = event;
      rules[getRuleIndex(currentTarget)].auto = currentTarget.checked;
      storage.set({ rules });
    }

    function dropEvent(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    function getRuleIndex(target) {
      const { value } = target.closest('tr').querySelector('input[name="regexp"]');
      return rules.findIndex(({ regexp }) => regexp === value);
    }

    function onJSONRead(event) {
      rules = JSON.parse(event.target.result);
      while (add.previousElementSibling) add.previousElementSibling.remove();
      for (const rule of rules) addRow(rule);
      storage.set({ rules });
    }

    function removeRule(event) {
      const { currentTarget } = event;
      dropEvent(event);
      if (document.activeElement === currentTarget) {
        event.preventDefault();
        event.stopPropagation();
        const tr = currentTarget.closest('tr');
        for (const input of tr.querySelectorAll('input')) input.disabled = true;
        rules.splice(getRuleIndex(currentTarget), 1);
        storage.set({ rules });
        currentTarget.closest('tr').remove();
      }
    }
  });

})(globalThis.chrome || browser);

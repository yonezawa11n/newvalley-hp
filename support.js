// Minimal DC framework — handles dc-import, x-dc, DCLogic, {{ }} templates

// Inject mobile.css on every page
(function(){
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'mobile.css';
  document.head.appendChild(link);
})();

class DCLogic {
  setState(updates) {
    Object.assign(this.state, updates);
    this._dc_update && this._dc_update();
  }
}

document.addEventListener('DOMContentLoaded', async () => {

  // ── 1. Resolve <dc-import name="X"> by fetching X.dc.html ──────────────
  async function resolveImports(root) {
    for (const imp of [...root.querySelectorAll('dc-import')]) {
      const name = imp.getAttribute('name');
      try {
        const html = await (await fetch(`./${name}.dc.html`)).text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const xdc = doc.querySelector('x-dc');
        if (!xdc) continue;
        // Inject <helmet> resources into <head>
        const helmet = xdc.querySelector('helmet');
        if (helmet) {
          for (const el of [...helmet.children]) {
            document.head.appendChild(el.cloneNode(true));
          }
          helmet.remove();
        }
        // Replace dc-import with component content
        const wrap = document.createElement('div');
        wrap.innerHTML = xdc.innerHTML;
        // Collect scripts before replaceWith (they'll be moved out of wrap)
        const scripts = [...wrap.querySelectorAll('script')];
        imp.replaceWith(...wrap.childNodes);
        // Re-execute any inline scripts (innerHTML doesn't run them)
        scripts.forEach(function(s) {
          var ns = document.createElement('script');
          if (s.src) { ns.src = s.src; } else { ns.textContent = s.textContent; }
          document.body.appendChild(ns);
        });
      } catch (e) {
        console.warn('[dc] import failed:', name, e);
        imp.remove();
      }
    }
  }

  // ── 2. Process main <x-dc> component with DCLogic script ──────────────
  function processComponent() {
    const xdc = document.querySelector('x-dc');
    const scriptEl = document.querySelector('script[type="text/x-dc"]');
    if (!xdc) return;

    // Inject helmet
    const helmet = xdc.querySelector('helmet');
    if (helmet) {
      for (const el of [...helmet.children]) document.head.appendChild(el);
      helmet.remove();
    }

    if (!scriptEl) {
      // No logic — just unwrap x-dc
      xdc.replaceWith(...[...xdc.childNodes]);
      return;
    }

    // Instantiate component class
    const Cls = new Function('DCLogic', `${scriptEl.textContent}; return Component;`)(DCLogic);
    const inst = new Cls();

    // Collect bindings (text nodes + attributes containing {{ }})
    const bindings = [];

    function collect(root) {
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
      );
      let node;
      while ((node = walker.nextNode())) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.includes('{{')) {
            const tmpl = node.textContent;
            node.textContent = '';
            bindings.push({ type: 'text', node, tmpl });
          }
        } else {
          for (const attr of [...node.attributes]) {
            if (!attr.value.includes('{{')) continue;
            const name = attr.name;
            const tmpl = attr.value;
            // Event handler attributes → bind once, delegate to latest renderVals()
            if (/^on[a-z]/i.test(name)) {
              const evtName = name.slice(2).toLowerCase();
              const fnExpr = tmpl.replace(/^\{\{\s*|\s*\}\}$/, '').trim();
              node.removeAttribute(name);
              node.addEventListener(evtName, (e) => {
                const fn = safeEval(fnExpr, inst.renderVals());
                if (typeof fn === 'function') fn(e);
              });
            } else {
              bindings.push({ type: 'attr', node, name, tmpl });
            }
          }
        }
      }
    }

    function update() {
      const vals = inst.renderVals();
      for (const b of bindings) {
        const val = interpolate(b.tmpl, vals);
        if (b.type === 'text') {
          b.node.textContent = val;
        } else {
          b.node.setAttribute(b.name, val);
        }
      }
    }

    function interpolate(tmpl, vals) {
      return tmpl.replace(/\{\{\s*([\s\S]+?)\s*\}\}/g, (_, expr) => {
        const v = safeEval(expr.trim(), vals);
        return v == null ? '' : v;
      });
    }

    function safeEval(expr, vals) {
      try {
        return new Function(...Object.keys(vals), `return (${expr});`)(...Object.values(vals));
      } catch { return undefined; }
    }

    collect(xdc);
    update();
    inst._dc_update = update;

    // Unwrap x-dc
    xdc.replaceWith(...[...xdc.childNodes]);
  }

  // ── Run ────────────────────────────────────────────────────────────────
  processComponent();
  await resolveImports(document);
});

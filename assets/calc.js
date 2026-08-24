/* =============================================================================
   calc.js — the surplus calculator on /surplus-calculator.html
   -----------------------------------------------------------------------------
   Arithmetic only. It runs entirely in the reader's browser:

       * no network call of any kind
       * nothing written to localStorage, sessionStorage, cookies or IndexedDB
       * nothing sent anywhere, ever

   Reloading the page returns the example values, which is the proof that
   nothing was kept.

   THE MODEL
   ---------
     surplus = take-home
               − rent / EMI
               − regular bills
               − everyday spending
               − money already committed to SIPs and investments
               − (annual & lumpy payments ÷ 12)

   The last term is the founder's rule made arithmetic: a ₹96,000 insurance
   premium is not a ₹96,000 shock in one month, it is ₹8,000 a month that was
   never yours to invest. It is subtracted BEFORE the surplus and shown on its
   own line so the reader can see it leave.

     safe-to-commit band = 60% … 80% of the surplus, rounded to ₹100

   The remaining 20–40% is the slack for the month that goes wrong. It is a
   rule of thumb, and the page says so. No return is projected anywhere in
   this file; the 12-month strip is the surplus multiplied by the month index
   and nothing else.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('calc');
  if (!form) return;

  /* --- the six inputs, in the order they are subtracted -------------------- */
  var FIELDS = ['income', 'housing', 'bills', 'everyday', 'invested', 'lumpy'];

  /* --- Indian digit grouping: 1,23,456 — last three, then pairs ------------ */
  function group(n) {
    var s = String(Math.abs(Math.round(n)));
    if (s.length <= 3) return s;
    var last3 = s.slice(-3);
    var rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    return rest + ',' + last3;
  }
  function inr(n) {
    return (n < 0 ? '−₹' : '₹') + group(n);
  }

  function digits(str) {
    return String(str == null ? '' : str).replace(/[^0-9]/g, '');
  }
  function value(name) {
    var el = form.elements[name];
    var d = digits(el && el.value);
    return d === '' ? 0 : parseInt(d, 10);
  }

  /* --- write the answer ---------------------------------------------------- */
  function out(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function render() {
    var income   = value('income');
    var housing  = value('housing');
    var bills    = value('bills');
    var everyday = value('everyday');
    var invested = value('invested');
    var lumpyYr  = value('lumpy');
    var lumpyMo  = Math.round(lumpyYr / 12);

    var committed = housing + bills + everyday + invested + lumpyMo;
    var surplus   = income - committed;

    out('r-income',   inr(income));
    out('r-housing',  inr(housing));
    out('r-bills',    inr(bills));
    out('r-everyday', inr(everyday));
    out('r-invested', inr(invested));
    out('r-lumpy',    inr(lumpyMo));
    out('r-lumpy-note', lumpyYr > 0
      ? inr(lumpyYr) + ' a year ÷ 12'
      : 'Nothing entered');
    out('r-committed', inr(committed));

    var result = document.getElementById('result');
    var state = income === 0 ? 'empty' : (surplus < 0 ? 'short' : 'ok');
    if (result) result.setAttribute('data-state', state);

    if (state === 'empty') {
      out('r-surplus', '₹0');
      out('r-verdict', 'Enter your monthly take-home to begin.');
      out('r-band', '—');
      out('r-year', '—');
      strip(0);
      return;
    }

    out('r-surplus', inr(surplus));

    if (surplus < 0) {
      out('r-verdict', 'You are ' + inr(-surplus) +
        ' short every month. Nothing is safe to commit until that gap closes — ' +
        'the honest next step is the gap, not a SIP.');
      out('r-band', 'Nothing, yet');
      out('r-year', 'Over twelve months that gap is ' + inr(-surplus * 12) + '.');
      strip(0);
      return;
    }

    var lo = Math.round(surplus * 0.6 / 100) * 100;
    var hi = Math.round(surplus * 0.8 / 100) * 100;
    out('r-verdict', 'That is what is genuinely left after everything you have told us about — ' +
      'including the payments that only arrive once a year.');
    out('r-band', inr(lo) + ' – ' + inr(hi));
    out('r-year', 'If nothing changes, twelve months of that surplus adds up to ' +
      inr(surplus * 12) + '.');
    strip(surplus);
  }

  /* --- the 12-month strip: cumulative surplus, no return, no growth -------- */
  var stripEl = document.getElementById('strip');
  var bars = [];
  if (stripEl) {
    for (var m = 1; m <= 12; m++) {
      var cell = document.createElement('div');
      cell.className = 'strip__cell';
      var bar = document.createElement('div');
      bar.className = 'strip__bar';
      bar.style.setProperty('--h', (m / 12 * 100) + '%');
      var lab = document.createElement('span');
      lab.className = 'strip__month caption';
      lab.textContent = String(m);
      cell.appendChild(bar);
      cell.appendChild(lab);
      stripEl.appendChild(cell);
      bars.push(bar);
    }
  }
  function strip(surplus) {
    for (var i = 0; i < bars.length; i++) {
      var cum = surplus * (i + 1);
      bars[i].setAttribute('title', 'Month ' + (i + 1) + ': ' + inr(cum));
    }
    var table = document.getElementById('strip-table');
    if (table) {
      var rows = table.querySelectorAll('td.strip__cum');
      for (var j = 0; j < rows.length; j++) {
        rows[j].textContent = inr(surplus * (j + 1));
      }
    }
  }

  /* --- formatting: group on blur, and while typing at the end of the field
         (so the caret is never dragged out from under a mid-string edit) --- */
  function reformat(el, force) {
    var atEnd = el.selectionStart === el.value.length;
    var d = digits(el.value);
    var next = d === '' ? '' : group(parseInt(d, 10));
    if (next === el.value) return;
    if (force || atEnd) {
      el.value = next;
      if (!force) {
        try { el.setSelectionRange(next.length, next.length); } catch (e) {}
      }
    } else {
      el.value = d;
    }
  }

  FIELDS.forEach(function (name) {
    var el = form.elements[name];
    if (!el) return;
    el.addEventListener('input', function () { reformat(el, false); render(); });
    el.addEventListener('blur',  function () { reformat(el, true);  render(); });
  });

  var reset = document.getElementById('calc-reset');
  if (reset) {
    reset.addEventListener('click', function () {
      FIELDS.forEach(function (name) {
        if (form.elements[name]) form.elements[name].value = '';
      });
      render();
      var first = form.elements.income;
      if (first) first.focus();
    });
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); });

  /* The example is markup, not state — it ships in the `value` attributes so
     the page is legible with JavaScript switched off, and so a reload always
     puts it back. Format it once, then compute. */
  FIELDS.forEach(function (name) {
    if (form.elements[name]) reformat(form.elements[name], true);
  });
  render();
})();

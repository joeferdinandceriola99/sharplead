
window.Demo = {currency:'PHP', fx:{PHP:1,USD:1/58}};
const $  = s=>document.querySelector(s);
const $$ = s=>Array.from(document.querySelectorAll(s));
const NF = new Intl.NumberFormat('en-US');
function fxVal(v,cur){ return v*(Demo.fx[cur]||1); }
function money(v,cur){ return new Intl.NumberFormat('en-US',{style:'currency',currency:cur,maximumFractionDigits:0}).format(fxVal(v,cur)); }
function short(v,cur){ const n = fxVal(v,cur); if(n>=1e6) return (n/1e6).toFixed(2)+'M'; if(n>=1e3) return (n/1e3).toFixed(1)+'K'; return n.toFixed(0); }
function toast(msg){ const t=document.createElement('div'); t.className='position-fixed bottom-0 end-0 m-3 alert alert-dark border'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1500); }

// header
function renderHeader(active){
  const nav = `
  <nav class="navbar navbar-expand-lg sticky-top bg-dark border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold" href="index.html">Sharplead Dashboard</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"><span class="navbar-toggler-icon"></span></button>
      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link ${active==='dashboard'?'active':''}" href="index.html">Dashboard</a></li>
          <li class="nav-item"><a class="nav-link ${active==='players'?'active':''}" href="players.html">Players</a></li>
          <li class="nav-item"><a class="nav-link ${active==='payments'?'active':''}" href="payments.html">Payments</a></li>
          <li class="nav-item"><a class="nav-link ${active==='withdrawals'?'active':''}" href="withdrawals.html">Withdrawals</a></li>
          <li class="nav-item"><a class="nav-link ${active==='banking'?'active':''}" href="banking.html">Banking</a></li>
          <li class="nav-item"><a class="nav-link ${active==='services'?'active':''}" href="services.html">Services</a></li>
          <li class="nav-item"><a class="nav-link ${active==='reports'?'active':''}" href="reports.html">Reports</a></li>
          <li class="nav-item"><a class="nav-link ${active==='risk'?'active':''}" href="risk.html">Risk</a></li>
          <li class="nav-item"><a class="nav-link ${active==='settings'?'active':''}" href="settings.html">Settings</a></li>
        </ul>
        <div class="d-flex align-items-center gap-2">
          <select id="currencySelTop" class="form-select form-select-sm" style="min-width:90px">
            <option value="PHP">PHP</option>
            <option value="USD">USD</option>
          </select>
          <input id="globalsearch" class="form-control form-control-sm" placeholder="Search...">
        </div>
      </div>
    </div>
  </nav>`;
  document.body.insertAdjacentHTML('afterbegin', nav);
  $('#currencySelTop').value = Demo.currency;
  $('#currencySelTop').addEventListener('change', e=>{ Demo.currency=e.target.value; if(window.onCurrencyChange) window.onCurrencyChange(); });
}

// util to export CSV
function exportCSV(rows, filename){
  const csv = rows.map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
}

// seed in window
Object.assign(window.Demo, window.DemoSeed || {});

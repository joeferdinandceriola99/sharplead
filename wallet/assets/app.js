
document.addEventListener('DOMContentLoaded', () => {
  // --- Helpers ---
  const peso = new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:2});
  const parseAmount = (v)=>{
    const n = Number(String(v).replace(/[^\d.]/g,''));
    return isNaN(n) ? 0 : n;
  };
  const $ = (sel)=>document.querySelector(sel);

  function toast(msg){
    const t = $('#toast'); if(!t) return;
    t.textContent = msg; t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2000);
  }
  window.toast = toast;

  // --- SPA Nav ---
  function showView(id){
    document.querySelectorAll('.view').forEach(v=> v.style.display = (v.id === id ? 'block' : 'none'));
    document.querySelectorAll('.navbtn').forEach(n=> n.classList.remove('active'));
    const match = document.querySelector(`.navbtn[data-view="${id}"]`);
    if (match) match.classList.add('active');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  window.showView = showView;
  document.querySelectorAll('[data-view]').forEach(btn=> btn.addEventListener('click', ()=> showView(btn.getAttribute('data-view')) ));
  const brand = $('#brand'); if (brand) brand.addEventListener('click', ()=> showView('wallet'));

  // --- Balance state ---
  let balance = parseAmount($('#walletBalance').dataset.amount || '12450');
  function renderBalance(){
    $('#walletBalance').textContent = peso.format(balance);
    $('#walletBalance').dataset.amount = String(balance);
  }
  renderBalance();

  // --- Transactions list ---
  const txList = $('#txList');
  function pushTx({label, amount, positive}){
    const div = document.createElement('div');
    div.className = 'tile';
    div.innerHTML = `<div class="left"><div class="icon">${positive?'₱':'↘️'}</div><div>${label}</div></div><div class="amount ${positive?'plus':'minus'}">${positive?'+ ':'- '}${peso.format(amount).replace('PHP','')}</div>`;
    txList.prepend(div);
  }

  // --- Top-up actions ---
  function doTopup(amount){
    if(amount<=0){ toast('Enter a valid amount'); return; }
    balance += amount; renderBalance();
    pushTx({label:'Deposit · Wallet', amount, positive:true});
    toast('Added ' + peso.format(amount));
  }
  document.querySelectorAll('[data-topup]').forEach(btn=> btn.addEventListener('click', ()=>{
    doTopup(parseAmount(btn.getAttribute('data-topup')));
  }));
  const addBtn = $('#customAdd');
  if (addBtn){
    addBtn.addEventListener('click', ()=>{
      const amt = parseAmount($('#customTopup').value);
      doTopup(amt);
      $('#customTopup').value='';
    });
  }

  // --- Withdraw (demo: deduct immediately) ---
  const withdrawBtn = $('#withdrawRequest');
  if (withdrawBtn){
    withdrawBtn.addEventListener('click', ()=>{
      const amt = parseAmount($('#withdrawAmt').value);
      if(amt<=0 || amt>balance){ toast('Invalid amount'); return; }
      balance -= amt; renderBalance();
      pushTx({label:'Withdraw request', amount:amt, positive:false});
      toast('Withdrawal requested: ' + peso.format(amt));
      window.closeSheet && closeSheet('sheetWithdraw');
    });
  }

  // --- Payment method select (existing) ---
  document.querySelectorAll('[data-method]').forEach(tile=>{
    tile.addEventListener('click', ()=>{
      document.querySelectorAll('[data-method]').forEach(t=> t.classList.remove('active'));
      tile.classList.add('active');
      const method = tile.getAttribute('data-method');
      const lbl = $('#selectedMethod'); if (lbl) lbl.textContent = method;
    });
  });

  // --- Fake pay success ---
  const payBtn = $('#payBtn');
  if (payBtn){
    payBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      openSheet('sheetSuccess');
      setTimeout(()=> closeSheet('sheetSuccess'), 1500);
    });
  }

  // --- Sheets helpers ---
  function openSheet(id){ const el = document.getElementById(id); if(el) el.classList.add('show'); }
  function closeSheet(id){ const el = document.getElementById(id); if(el) el.classList.remove('show'); }
  window.openSheet = openSheet; window.closeSheet = closeSheet;

  // --- Add method (unchanged demo) ---
  function addMethod(type){
    const list = document.getElementById('methodList');
    if(!list){ console.warn('methodList not found'); return; }
    const li = document.createElement('div');
    li.className = 'tile';
    let label = '';
    if(type==='gcash') label = 'GCash • 09•• ••• ••12';
    if(type==='maya')  label = 'Maya • 09•• ••• ••34';
    if(type==='card')  label = 'Visa •••• 4242';
    li.innerHTML = `<div class="left"><div class="icon">${type==='card'?'💳':(type==='maya'?'🟣':'🔵')}</div><div><div>${label}</div><div class="method-meta">Added just now · Default</div></div></div><div class="method-actions"><button type="button" class="btn small">Set Default</button><button type="button" class="btn ghost small">Remove</button></div>`;
    list.prepend(li);
    toast('Added new ' + type + ' method (demo)');
  }
  window.addMethod = addMethod;
});

const display = document.getElementById('display');

function append(val){ display.value += val; }

function clearAll(){ display.value = ''; }

function backspace(){ display.value = display.value.slice(0,-1); }

function percent(){ 
  try{
    const v = parseFloat(display.value);
    if(isNaN(v)) return;
    display.value = (v/100).toString();
  }catch(e){ display.value = 'Error' }
}

function calculate(){
  try{
    // sanitize expression: allow digits, operators, parentheses, dot, space
    const expr = display.value;
    if(!/^[0-9+\-*/(). %]+$/.test(expr)) { display.value = 'Error'; return; }
    // Replace unicode division/multiplication
    const safeExpr = expr.replace(/÷/g, '/').replace(/×/g, '*').replace(/\s/g,'');
    // Evaluate using Function (slightly safer than eval)
    const result = Function('"use strict";return (' + safeExpr + ')')();
    display.value = (result === Infinity || Number.isNaN(result)) ? 'Error' : String(result);
  }catch(e){
    display.value = 'Error';
  }
}

document.querySelectorAll('[data-value]').forEach(b=>{
  b.addEventListener('click', ()=> append(b.getAttribute('data-value')));
});
document.querySelectorAll('[data-action]').forEach(b=>{
  b.addEventListener('click', ()=> {
    const a = b.getAttribute('data-action');
    if(a === 'clear') clearAll();
    if(a === 'back') backspace();
    if(a === 'percent') percent();
    if(a === 'equals') calculate();
  });
});

// Keyboard support
document.addEventListener('keydown', (e)=>{
  const k = e.key;
  if(k === 'Enter' || k === '='){ e.preventDefault(); calculate(); return; }
  if(k === 'Escape'){ clearAll(); return; }
  if(k === 'Backspace'){ backspace(); return; }
  if(/^[0-9+\-/*().%]$/.test(k)){ append(k); }
});

// Auto-generated from gmail/foxxy.js
// DO NOT EDIT - Run build_plugins.js to regenerate

(function() {
  function findElement(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector)
    if (el) return el
  }
  return null
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

window.__foxxy_open_compose = async function open_compose() {
  console.log('✉️ open_compose called');
  
  const composeBtn = findElement([
    "div.T-I.T-I-KE.L3[role='button']",
    "div.T-I.T-I-KE",
    "div[gh='cm'][role='button']",
    "div[role='button'][gh='cm']"
  ]);
  
  if (composeBtn) {
    console.log('✅ Found compose button, clicking...');
    composeBtn.click();
    await wait(500);
    return 'success';
  }
  
  console.log('❌ Compose button not found');
  return 'not_found';
}

window.__foxxy_fill_compose = async function fill_compose({ to, subject, body } = {}) {
  console.log('📝 fill_compose called with:', { to, subject, body });
  
  if (to) {
    const toField = findElement([
      "input[aria-label='To']",
      "textarea[name='to']",
      "div.wO.nr.l1 textarea",
      "input[peoplekit-id='BbVjBd']",
      "input.agP.aFw"
    ]);
    if (toField) {
      toField.focus();
      toField.value = to;
      toField.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ Filled To field');
    }
  }
  
  if (subject) {
    const subjectField = findElement([
      "input[name='subjectbox']",
      "input[aria-label='Subject']",
      "input.aoT"
    ]);
    if (subjectField) {
      subjectField.focus();
      subjectField.value = subject;
      subjectField.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ Filled Subject field');
    }
  }
  
  if (body) {
    const bodyField = findElement([
      "div[aria-label='Message Body'][role='textbox']",
      "div.Am.aiL.Al.editable.LW-avf[contenteditable='true']",
      "div[g_editable='true'][role='textbox']",
      "div.editable[contenteditable='true']"
    ]);
    if (bodyField) {
      bodyField.focus();
      bodyField.textContent = body;
      bodyField.dispatchEvent(new Event('input', { bubbles: true }));
      console.log('✅ Filled Body field');
    }
  }
  
  return 'success';
}

window.__foxxy_compose_email = async function compose_email({ to, subject, body }) {
  // Legacy function - opens compose and fills everything automatically
  await open_compose();
  await wait(300);
  await fill_compose({ to, subject, body });
  return 'success';
}

window.__foxxy_reply = async function reply({ text }) {
  const replyBtn = findElement([
    "div[aria-label='Reply'][role='button']",
    "span.ams.bkH",
    "div.T-I.J-J5-Ji.T-I-Js-IF.aaq.T-I-ax7.L3"
  ])
  if (replyBtn) replyBtn.click()
  await wait(300)
  
  const bodyField = findElement([
    "div[aria-label='Message Body'][role='textbox']",
    "div.Am.aiL.Al.editable[contenteditable='true']",
    "div[g_editable='true'][contenteditable='true']"
  ])
  if (bodyField) {
    bodyField.focus()
    bodyField.textContent = text
    bodyField.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  const sendBtn = findElement([
    "div[role='button'][data-tooltip^='Send']",
    "div.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3"
  ])
  if (sendBtn) sendBtn.click()
  return 'success'
}

window.__foxxy_forward = async function forward({ to }) {
  const forwardBtn = findElement([
    "div[aria-label='Forward'][role='button']",
    "span.aap[role='link']",
    "div[data-tooltip='Forward']"
  ])
  if (forwardBtn) forwardBtn.click()
  await wait(300)
  
  const toField = findElement([
    "div[aria-label='To'] input[type='text']",
    "textarea[name='to']",
    "input[aria-label='To recipients']"
  ])
  if (toField) {
    toField.focus()
    toField.value = to
    toField.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  const sendBtn = findElement(["div[role='button'][data-tooltip^='Send']"])
  if (sendBtn) sendBtn.click()
  return 'success'
}

window.__foxxy_delete_email = async function delete_email() {
  const btn = findElement([
    "div[data-tooltip='Delete'][role='button']",
    "div.T-I.J-J5-Ji.nX.T-I-ax7.T-I-Js-Gs.mA[aria-label='Delete']",
    "button[aria-label='Delete']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_archive_email = async function archive_email() {
  const btn = findElement([
    "div[data-tooltip='Archive'][role='button']",
    "div.T-I.J-J5-Ji.nX.T-I-ax7.T-I-Js-Gs.aap.T-I-awG[aria-label='Archive']",
    "button[aria-label='Archive']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_star_email = async function star_email() {
  const btn = findElement([
    "span.T-KT[role='button'][aria-label*='star']",
    "div[role='button'][data-tooltip*='Star']",
    "span.T-KT.aXw[aria-label^='Not starred']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_search = async function search({ query }) {
  const searchField = findElement([
    "input[aria-label='Search mail']",
    "input.gb_Bd[name='q']",
    "input[placeholder='Search mail']"
  ])
  if (searchField) {
    searchField.focus()
    searchField.value = query
    searchField.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
  }
  return 'success'
}

window.__foxxy_open_email = async function open_email({ n }) {
  console.log('📧 open_email called with:', { n });
  
  // Find email rows in the inbox/list view
  const selectors = [
    "tr.zA[role='row']",  // Main email rows in table view
    "div[role='main'] tr.zA",
    "table.F.cf.zt tr.zA",
    "tr[role='row'].zA",
    "div.ae4.aDM tr.zA"
  ];
  
  let emailRows = [];
  for (const selector of selectors) {
    emailRows = Array.from(document.querySelectorAll(selector));
    console.log(`  Tried selector: ${selector} -> found ${emailRows.length} emails`);
    if (emailRows.length > 0) break;
  }
  
  console.log(`✅ Total emails found: ${emailRows.length}, requesting index: ${n}`);
  
  if (emailRows[n - 1]) {
    console.log('✅ Clicking email at index', n - 1);
    emailRows[n - 1].click();
    return 'success';
  }
  
  return `not_found (found ${emailRows.length} emails, requested n=${n})`;
}

window.__foxxy_get_subject = async function get_subject() {
  const el = findElement([
    "h2.hP[data-legacy-thread-id]",
    "h2[data-thread-perm-id]",
    "span.bog > span.hP"
  ])
  return el ? el.textContent.trim() : null
}

window.__foxxy_get_sender = async function get_sender() {
  const el = findElement([
    "span.gD[email]",
    "span.go[email]",
    "span[email][data-hovercard-id]"
  ])
  return el ? el.textContent.trim() : null
}

})();

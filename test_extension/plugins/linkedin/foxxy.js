
// Auto-generated from linkedin/foxxy.js
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

window.__foxxy_create_post = async function create_post({ text }) {
  const openBtn = findElement([
    "button.share-box-feed-entry__trigger",
    "button[aria-label='Start a post']",
    ".share-box-feed-entry__trigger",
    "button.artdeco-button--tertiary[aria-label*='Start a post']"
  ])
  if (openBtn) openBtn.click()
  await wait(500)
  
  const editor = findElement([
    "div.ql-editor[contenteditable='true']",
    "div[data-placeholder='What do you want to talk about?']",
    "div.share-creation-state__text-editor div.ql-editor",
    "div[role='textbox'][contenteditable='true']"
  ])
  if (editor) {
    editor.focus()
    editor.textContent = text
    editor.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  const postBtn = findElement([
    "button.share-actions__primary-action[type='submit']",
    "button.share-actions__primary-action",
    "button[aria-label='Post']"
  ])
  if (postBtn) postBtn.click()
  return 'success'
}

window.__foxxy_like_post = async function like_post() {
  const btn = findElement([
    "button[aria-label^='Like'][aria-pressed='false']",
    "button.reactions-react-button",
    "button[data-test-icon='thumbs-up-outline-medium']",
    "button.social-actions-button[aria-label*='Like']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_comment = async function comment({ text }) {
  const btn = findElement([
    "button.social-actions-button[aria-label*='Comment']",
    "button[data-test-icon='comment-medium']",
    "button[aria-label*='comment on']"
  ])
  if (btn) btn.click()
  await wait(300)
  
  const editor = findElement([
    "div.ql-editor[contenteditable='true']",
    "div.comments-comment-box__form div[role='textbox']",
    "div.comments-comment-texteditor div.ql-editor"
  ])
  if (editor) {
    editor.focus()
    editor.textContent = text
    editor.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  const submitBtn = findElement([
    "button.comments-comment-box__submit-button--cr",
    "button.comments-comment-box__submit-button",
    "button[type='submit'][form*='comment']"
  ])
  if (submitBtn) submitBtn.click()
  return 'success'
}

window.__foxxy_connect = async function connect() {
  const btn = findElement([
    "button[aria-label^='Invite'][aria-label*='to connect']",
    "button.pvs-profile-actions__action[aria-label*='Connect']",
    "button.artdeco-button--primary[aria-label*='Connect']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_search_jobs = async function search_jobs({ query }) {
  window.location.href = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`
}

window.__foxxy_apply_job = async function apply_job() {
  const btn = findElement([
    "button.jobs-apply-button[aria-label*='Easy Apply']",
    "button.jobs-apply-button--top-card",
    "button[aria-label*='Easy Apply to']",
    ".jobs-apply-button"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_search_people = async function search_people({ query }) {
  window.location.href = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`
}

})();

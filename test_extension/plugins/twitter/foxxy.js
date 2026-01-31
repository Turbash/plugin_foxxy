
// Auto-generated from twitter/foxxy.js
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

window.__foxxy_post_tweet = async function post_tweet({ text }) {
  const openBtn = findElement([
    "a[data-testid='SideNav_NewTweet_Button']",
    "a[aria-label='Post']",
    "button[data-testid='SideNav_NewTweet_Button']"
  ])
  if (openBtn) openBtn.click()
  await wait(500)
  
  const textarea = findElement([
    "div[data-testid='tweetTextarea_0'][contenteditable='true']",
    "div.public-DraftStyleDefault-block",
    "div[role='textbox'][contenteditable='true']"
  ])
  if (textarea) {
    textarea.focus()
    textarea.textContent = text
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
  await wait(300)
  
  const postBtn = findElement([
    "button[data-testid='tweetButton']",
    "button[data-testid='tweetButtonInline']",
    "div[data-testid='tweetButton']"
  ])
  if (postBtn) postBtn.click()
  return 'success'
}

window.__foxxy_like_tweet = async function like_tweet() {
  const btn = findElement([
    "button[data-testid='like']:not([data-testid='unlike'])",
    "div[role='button'][data-testid='like']",
    "button[aria-label*='Like']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_retweet = async function retweet() {
  const btn = findElement([
    "button[data-testid='retweet']",
    "div[role='button'][data-testid='retweet']"
  ])
  if (btn) btn.click()
  await wait(300)
  
  const confirmBtn = findElement([
    "div[data-testid='retweetConfirm']",
    "button[data-testid='retweetConfirm']",
    "div[role='menuitem'][data-testid='retweetConfirm']"
  ])
  if (confirmBtn) confirmBtn.click()
  return 'success'
}

window.__foxxy_reply = async function reply({ text }) {
  const btn = findElement([
    "button[data-testid='reply']",
    "div[role='button'][data-testid='reply']"
  ])
  if (btn) btn.click()
  await wait(500)
  
  const textarea = findElement([
    "div[data-testid='tweetTextarea_0'][contenteditable='true']",
    "div[role='textbox'][contenteditable='true']"
  ])
  if (textarea) {
    textarea.focus()
    textarea.textContent = text
    textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }
  
  const postBtn = findElement(["button[data-testid='tweetButton']"])
  if (postBtn) postBtn.click()
  return 'success'
}

window.__foxxy_follow_user = async function follow_user() {
  const btn = findElement([
    "button[data-testid$='-follow']",
    "div[role='button'][aria-label='Follow']",
    "button[aria-label='Follow']",
    "div[data-testid$='-follow']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_search = async function search({ query }) {
  window.location.href = `https://twitter.com/search?q=${encodeURIComponent(query)}`
}

window.__foxxy_get_tweet_text = async function get_tweet_text() {
  const el = findElement([
    "div[data-testid='tweetText']",
    "div[data-testid='tweetText'] span",
    "article div[lang]"
  ])
  return el ? el.textContent.trim() : null
}

})();

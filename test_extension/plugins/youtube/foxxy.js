
// Auto-generated from youtube/foxxy.js
// DO NOT EDIT - Run build_plugins.js to regenerate

(function() {
  function findElement(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector)
    if (el) return el
  }
  return null
}

window.__foxxy_search = async function search({ query }) {
  window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}

window.__foxxy_play_video = async function play_video({ n }) {
  // If n is provided, click on the nth video thumbnail on search results
  if (n !== undefined) {
    const videoIndex = parseInt(n) - 1; // Convert to 0-based index
    const videoLinks = findElement([
      "ytd-video-renderer a#video-title",
      "ytd-video-renderer a.yt-simple-endpoint",
      "#contents ytd-video-renderer a#thumbnail"
    ]);
    
    if (!videoLinks) {
      return 'no_videos_found';
    }
    
    // Get all video links
    const allVideos = document.querySelectorAll("ytd-video-renderer a#video-title");
    
    if (videoIndex >= 0 && videoIndex < allVideos.length) {
      allVideos[videoIndex].click();
      return 'success';
    } else {
      return `video_${n}_not_found (found ${allVideos.length} videos)`;
    }
  }
  
  // Otherwise, play/pause the current video player
  const btn = findElement([
    "button.ytp-play-button[aria-label='Play']",
    ".ytp-play-button[title='Play (k)']",
    "button.ytp-play-button"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_pause_video = async function pause_video() {
  const btn = findElement([
    "button.ytp-play-button[aria-label='Pause']",
    ".ytp-play-button[title='Pause (k)']",
    "button.ytp-play-button"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_like_video = async function like_video() {
  const btn = findElement([
    "like-button-view-model button",
    "ytd-menu-renderer like-button-view-model button[aria-label*='like']",
    "button[aria-label^='like this video']",
    "#segmented-like-button button",
    "yt-icon-button button[aria-label*='Like']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_subscribe = async function subscribe() {
  const btn = findElement([
    "ytd-subscribe-button-renderer button[aria-label*='Subscribe']",
    "#subscribe-button button",
    "yt-button-shape button[aria-label^='Subscribe']",
    "ytd-button-renderer button"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

window.__foxxy_get_title = async function get_title() {
  const el = findElement([
    "ytd-watch-metadata h1 yt-formatted-string",
    "h1.ytd-watch-metadata",
    "ytd-video-primary-info-renderer h1",
    "#title h1 yt-formatted-string"
  ])
  return el ? el.textContent.trim() : null
}

window.__foxxy_get_views = async function get_views() {
  const el = findElement([
    "ytd-video-view-count-renderer span.view-count",
    "#info-container #info span",
    ".ytd-video-view-count-renderer",
    "ytd-watch-metadata #info span"
  ])
  return el ? el.textContent.trim() : null
}

})();

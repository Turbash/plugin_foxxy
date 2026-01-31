function findElement(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector)
    if (el) return el
  }
  return null
}

export async function search({ query }) {
  window.location.href = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`
}

export async function open_listing({ n }) {
  console.log('🔗 open_listing called with:', { n });
  
  // Find product links on search results
  const selectors = [
    ".s-result-item h2 a",
    ".s-result-item .a-link-normal.s-no-outline",
    "[data-component-type='s-search-result'] h2 a",
    ".s-result-item a.s-underline-text",
    ".s-main-slot .s-result-item a[href*='/dp/']"
  ];
  
  let productLinks = [];
  for (const selector of selectors) {
    productLinks = Array.from(document.querySelectorAll(selector));
    console.log(`  Tried selector: ${selector} -> found ${productLinks.length} links`);
    if (productLinks.length > 0) break;
  }
  
  console.log(`✅ Total product links found: ${productLinks.length}, requesting index: ${n}`);
  
  if (productLinks[n - 1]) {
    console.log('✅ Clicking product link at index', n - 1, productLinks[n - 1].href);
    productLinks[n - 1].click();
    return 'success';
  }
  
  return `not_found (found ${productLinks.length} links, requested n=${n})`;
}

export async function sort({ method }) {
  console.log('🔄 sort called with:', { method });
  
  // Map enum values to Amazon sort parameter values
  const sortMap = {
    'featured': 'relevanceblender',
    'price_low_to_high': 'price-asc-rank',
    'price_high_to_low': 'price-desc-rank',
    'avg_customer_review': 'review-rank',
    'newest': 'date-desc-rank'
  };
  
  const sortValue = sortMap[method];
  if (!sortValue) {
    console.log('❌ Invalid sort method:', method);
    return `invalid_method (valid: ${Object.keys(sortMap).join(', ')})`;
  }
  
  // Modify URL directly - most reliable method
  const url = new URL(window.location.href);
  url.searchParams.set('s', sortValue);
  console.log('✅ Redirecting with sort parameter:', sortValue);
  console.log('   New URL:', url.toString());
  window.location.href = url.toString();
  return 'success';
}

export async function add_to_cart({ n } = {}) {
  console.log('🛒 add_to_cart called with:', { n });
  
  // If n is provided, click nth "Add to cart" button on search results
  if (n) {
    console.log('🔍 Searching for add to cart buttons on search results...');
    
    // Try multiple selector patterns for search result add to cart buttons
    const selectors = [
      ".s-result-item button[aria-label*='Add to cart']",
      ".s-result-item button[aria-label*='Add to Cart']",
      ".s-result-item input[aria-labelledby*='add-to-cart']",
      "[data-component-type='s-search-result'] button[aria-label*='cart']",
      ".s-result-item .a-button-input",
      ".s-result-item button.a-button-primary",
      "button[id^='a-autoid-']"
    ];
    
    let addToCartButtons = [];
    for (const selector of selectors) {
      addToCartButtons = Array.from(document.querySelectorAll(selector));
      console.log(`  Tried selector: ${selector} -> found ${addToCartButtons.length} buttons`);
      if (addToCartButtons.length > 0) break;
    }
    
    console.log(`✅ Total buttons found: ${addToCartButtons.length}, requesting index: ${n}`);
    
    if (addToCartButtons[n - 1]) {
      console.log('✅ Clicking button at index', n - 1);
      addToCartButtons[n - 1].click();
      return 'success';
    }
    return `not_found (found ${addToCartButtons.length} buttons, requested n=${n})`;
  }
  
  console.log('📄 No n parameter, using product page logic');
  
  // Default behavior for product page
  const btn = findElement([
    "#add-to-cart-button",
    "input#add-to-cart-button",
    "button[name='submit.add-to-cart']",
    "#submit\\.add-to-cart",
    "span#submit\\.add-to-cart-announce",
    ".a-button-input[aria-labelledby='submit.add-to-cart-announce']"
  ])
  if (btn) btn.click()
  return btn ? 'success' : 'not_found'
}

export async function buy_now() {
  console.log('💳 buy_now called');
  
  const btn = findElement([
    "#buy-now-button",
    "input#buy-now-button",
    "input[name='submit.buy-now']",
    ".a-button-input[aria-labelledby='submit.buy-now-announce']",
    "span[id='submit.buy-now-announce'] input",
    "#buyNow",
    "button[name='submit.buy-now']",
    ".a-button-input[name='submit.buy-now']"
  ])
  
  if (btn) {
    console.log('✅ Found Buy Now button:', btn);
    btn.click();
    return 'success';
  }
  
  console.log('❌ Buy Now button not found');
  return 'not_found';
}

export async function go_to_checkout() {
  console.log('🛍️ go_to_checkout called');
  
  // Navigate directly to checkout page - most reliable method
  const checkoutUrl = window.location.origin + '/gp/cart/view.html?ref_=nav_cart&proceedToCheckout=1';
  console.log('✅ Navigating to checkout:', checkoutUrl);
  window.location.href = checkoutUrl;
  return 'success';
}

export async function click_proceed_checkout() {
  console.log('💳 click_proceed_checkout called');
  
  // Find and click the "Proceed to checkout" button on cart page
  const btn = findElement([
    "input[name='proceedToRetailCheckout']",
    "input[name='proceedToCheckout']",
    "#sc-buy-box-ptc-button input",
    "span[id='sc-buy-box-ptc-button'] input",
    "#sc-buy-box-ptc-button .a-button-input",
    "[data-feature-id='proceed-to-checkout-action'] input",
    ".sc-buy-box-ptc-button input",
    "input[aria-labelledby='sc-buy-box-ptc-button-announce']",
    "input[name='proceedToALMCheckout']",
    "[name='proceedToRetailCheckout']",
    ".a-button-primary input[name='proceedToRetailCheckout']"
  ]);
  
  if (btn) {
    console.log('✅ Found proceed to checkout button:', btn);
    btn.click();
    return 'success';
  }
  
  console.log('❌ Proceed to checkout button not found');
  return 'not_found';
}

export async function get_price() {
  const el = findElement([
    ".a-price[data-a-color='price'] .a-offscreen",
    "span.a-price-whole",
    ".a-price .a-price-whole",
    "#priceblock_ourprice",
    "#priceblock_dealprice",
    ".a-price.aok-align-center span.a-offscreen"
  ])
  return el ? el.textContent.trim() : null
}

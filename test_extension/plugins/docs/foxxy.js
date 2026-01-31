
// Auto-generated from docs/foxxy.js
// DO NOT EDIT - Run build_plugins.js to regenerate

(function() {
  async function wait(ms = 100) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function findElement(selectors) {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return null;
}

function getContentEditable() {
  return findElement([
    'div[contenteditable="true"][data-is-root-content-editable="true"]',
    'div[contenteditable="true"][jsname="V67aGc"]',
    'div[contenteditable="true"]',
  ]);
}

window.__foxxy_create_document = async function create_document({ title }) {
  try {
    window.open('https://docs.google.com/document/u/0/create', '_blank');
    await wait(3000);
    
    const titleInput = findElement([
      'input[placeholder="Untitled document"]',
      'input[aria-label="Document title"]',
      '[role="textbox"][aria-label*="title"]'
    ]);
    
    if (titleInput) {
      titleInput.click();
      titleInput.value = title;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(500);
    }
    
    return 'success';
  } catch (error) {
    console.error('create_document error:', error);
    return 'error';
  }
}

window.__foxxy_type_text = async function type_text({ text }) {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    await wait(100);
    
    // Simulate typing
    for (const char of text) {
      const event = new KeyboardEvent('keydown', {
        key: char,
        bubbles: true,
        cancelable: true
      });
      editor.dispatchEvent(event);
      
      // Insert character
      document.execCommand('insertText', false, char);
      await wait(10);
    }
    
    return 'success';
  } catch (error) {
    console.error('type_text error:', error);
    return 'error';
  }
}

window.__foxxy_add_heading = async function add_heading({ text, level = 'Heading 1' }) {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    await wait(100);
    
    // First type the text
    for (const char of text) {
      document.execCommand('insertText', false, char);
      await wait(5);
    }
    
    await wait(200);
    
    // Apply heading style
    const headingMap = {
      'Heading 1': 'formatBlock',
      'Heading 2': 'formatBlock',
      'Heading 3': 'formatBlock'
    };
    
    const blockMap = {
      'Heading 1': '<h1>',
      'Heading 2': '<h2>',
      'Heading 3': '<h3>'
    };
    
    document.execCommand('selectAll', false, null);
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      selection.collapse(editor.firstChild || editor, 0);
    }
    
    document.execCommand('formatBlock', false, blockMap[level]);
    
    // Move cursor to end
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    
    return 'success';
  } catch (error) {
    console.error('add_heading error:', error);
    return 'error';
  }
}

window.__foxxy_bold = async function bold() {
  try {
    document.execCommand('bold', false, null);
    return 'success';
  } catch (error) {
    console.error('bold error:', error);
    return 'error';
  }
}

window.__foxxy_italic = async function italic() {
  try {
    document.execCommand('italic', false, null);
    return 'success';
  } catch (error) {
    console.error('italic error:', error);
    return 'error';
  }
}

window.__foxxy_underline = async function underline() {
  try {
    document.execCommand('underline', false, null);
    return 'success';
  } catch (error) {
    console.error('underline error:', error);
    return 'error';
  }
}

window.__foxxy_create_list = async function create_list({ type = 'bulleted' }) {
  try {
    if (type === 'numbered') {
      document.execCommand('insertOrderedList', false, null);
    } else {
      document.execCommand('insertUnorderedList', false, null);
    }
    return 'success';
  } catch (error) {
    console.error('create_list error:', error);
    return 'error';
  }
}

window.__foxxy_insert_link = async function insert_link({ url, text }) {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    await wait(100);
    
    if (text) {
      document.execCommand('insertText', false, text);
      await wait(100);
      
      // Select the text we just typed
      const range = document.createRange();
      const selection = window.getSelection();
      let charCount = 0;
      let found = false;
      
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null, false);
      let node;
      while (node = walker.nextNode()) {
        const textLength = node.length;
        if (charCount + textLength >= charCount + text.length && !found) {
          range.setStart(node, charCount + textLength - text.length);
          range.setEnd(node, charCount + textLength);
          found = true;
          break;
        }
        charCount += textLength;
      }
      
      if (found) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    
    document.execCommand('createLink', false, url);
    return 'success';
  } catch (error) {
    console.error('insert_link error:', error);
    return 'error';
  }
}

window.__foxxy_find_replace = async function find_replace({ find, replace }) {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    const text = editor.innerText;
    if (!text.includes(find)) return 'not_found';
    
    const newText = text.replaceAll(find, replace);
    editor.innerText = newText;
    
    return 'success';
  } catch (error) {
    console.error('find_replace error:', error);
    return 'error';
  }
}

window.__foxxy_set_font_size = async function set_font_size({ size }) {
  try {
    document.execCommand('fontSize', false, size);
    return 'success';
  } catch (error) {
    console.error('set_font_size error:', error);
    return 'error';
  }
}

window.__foxxy_insert_table = async function insert_table({ rows, cols }) {
  try {
    const rowCount = parseInt(rows) || 2;
    const colCount = parseInt(cols) || 2;
    
    let html = '<table style="border-collapse: collapse; width: 100%;"><tbody>';
    for (let i = 0; i < rowCount; i++) {
      html += '<tr>';
      for (let j = 0; j < colCount; j++) {
        html += '<td style="border: 1px solid #ddd; padding: 8px;"></td>';
      }
      html += '</tr>';
    }
    html += '</tbody></table>';
    
    document.execCommand('insertHTML', false, html);
    return 'success';
  } catch (error) {
    console.error('insert_table error:', error);
    return 'error';
  }
}

window.__foxxy_add_comment = async function add_comment({ text }) {
  try {
    // Try to open comment dialog
    const commentButton = findElement([
      'button[aria-label="Comment"]',
      'button[aria-label*="comment"]',
      '[data-tooltip="Comment"]'
    ]);
    
    if (commentButton) {
      commentButton.click();
      await wait(500);
      
      const commentInput = findElement([
        'textarea[aria-label*="comment"]',
        '[role="textbox"][data-tooltip*="comment"]'
      ]);
      
      if (commentInput) {
        commentInput.focus();
        commentInput.value = text;
        commentInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        const submitButton = findElement([
          'button:contains("Comment")',
          '[aria-label="Comment"]',
          'button[data-tooltip*="Save"]'
        ]);
        
        if (submitButton) {
          submitButton.click();
          return 'success';
        }
      }
    }
    
    return 'comment_button_not_found';
  } catch (error) {
    console.error('add_comment error:', error);
    return 'error';
  }
}

window.__foxxy_set_page_color = async function set_page_color({ color }) {
  try {
    const colorMap = {
      'white': '#ffffff',
      'light_gray': '#f5f5f5',
      'light_blue': '#e8f4fd',
      'light_green': '#e6f4ea',
      'light_yellow': '#fef7e0'
    };
    
    const rgbColor = colorMap[color] || '#ffffff';
    
    const pageBackground = findElement([
      '[role="presentation"] > div[style*="background"]',
      '.kix-appview-editor-container',
      'div[jsname="V67aGc"]'
    ]);
    
    if (pageBackground) {
      pageBackground.style.backgroundColor = rgbColor;
      return 'success';
    }
    
    // Alternative: Use Docs menu
    const fileMenu = findElement([
      'button[aria-label="File"]',
      'div[role="menuitem"][aria-label*="File"]'
    ]);
    
    if (fileMenu) {
      fileMenu.click();
      await wait(300);
      
      const pageColorOption = findElement([
        'div[role="menuitem"]:contains("Page color")',
        'button:contains("Page color")'
      ]);
      
      if (pageColorOption) {
        pageColorOption.click();
      }
    }
    
    return 'success';
  } catch (error) {
    console.error('set_page_color error:', error);
    return 'error';
  }
}

})();

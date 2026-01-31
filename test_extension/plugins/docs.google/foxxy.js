
// Auto-generated from docs.google/foxxy.js
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

window.__foxxy_create_document = async function create_document() {
  try {
    // Just navigate to create new doc
    window.location.href = 'https://docs.google.com/document/u/0/create';
    await wait(3000);
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
    await wait(300);
    
    // Use InputEvent which Google Docs responds to
    const inputEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text
    });
    
    editor.dispatchEvent(inputEvent);
    
    const inputEvent2 = new InputEvent('input', {
      bubbles: true,
      cancelable: false,
      inputType: 'insertText',
      data: text
    });
    
    editor.dispatchEvent(inputEvent2);
    
    await wait(100);
    
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
    await wait(300);
    
    // First insert the text
    const inputEvent = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertText',
      data: text
    });
    editor.dispatchEvent(inputEvent);
    editor.dispatchEvent(new InputEvent('input', {
      bubbles: true,
      inputType: 'insertText',
      data: text
    }));
    
    await wait(200);
    
    // Select all the text we just typed (Ctrl+A)
    document.execCommand('selectAll', false, null);
    await wait(100);
    
    // Apply heading style using keyboard shortcut
    const levelMap = {
      'Heading 1': '1',
      'Heading 2': '2',
      'Heading 3': '3'
    };
    const num = levelMap[level] || '1';
    
    // Ctrl+Alt+1/2/3 for headings
    const event = new KeyboardEvent('keydown', {
      key: num,
      keyCode: 49 + parseInt(num) - 1,
      ctrlKey: true,
      altKey: true,
      bubbles: true
    });
    document.dispatchEvent(event);
    
    return 'success';
  } catch (error) {
    console.error('add_heading error:', error);
    return 'error';
  }
}

window.__foxxy_bold = async function bold() {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    
    // Try to apply bold using execCommand on selection
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      document.execCommand('bold', false, null);
    }
    
    return 'success';
  } catch (error) {
    console.error('bold error:', error);
    return 'error';
  }
}

window.__foxxy_italic = async function italic() {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      document.execCommand('italic', false, null);
    }
    
    return 'success';
  } catch (error) {
    console.error('italic error:', error);
    return 'error';
  }
}

window.__foxxy_underline = async function underline() {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      document.execCommand('underline', false, null);
    }
    
    return 'success';
  } catch (error) {
    console.error('underline error:', error);
    return 'error';
  }
}

window.__foxxy_create_list = async function create_list({ type = 'bulleted' }) {
  try {
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    
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
    await wait(300);
    
    if (text) {
      // Type the link text first
      const inputEvent = new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertText',
        data: text
      });
      editor.dispatchEvent(inputEvent);
      editor.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: text
      }));
      
      await wait(200);
      
      // Select the text
      document.execCommand('selectAll', false, null);
      await wait(100);
    }
    
    // Open link dialog with Ctrl+K
    const ctrlK = new KeyboardEvent('keydown', {
      key: 'k',
      keyCode: 75,
      ctrlKey: true,
      bubbles: true
    });
    document.dispatchEvent(ctrlK);
    
    await wait(800);
    
    // Find the link input and fill it
    const linkInput = findElement([
      'input[aria-label*="Link"]',
      'input.docs-link-urlinput-url',
      'input[type="text"][placeholder*="link"]'
    ]);
    
    if (linkInput) {
      linkInput.value = url;
      linkInput.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(200);
      
      // Press Enter
      linkInput.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'Enter',
        keyCode: 13,
        bubbles: true
      }));
      
      return 'success';
    }
    
    return 'link_dialog_not_found';
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
    
    editor.innerHTML = editor.innerHTML.replaceAll(find, replace);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    
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
    const editor = getContentEditable();
    if (!editor) return 'editor_not_found';
    
    editor.focus();
    await wait(200);
    
    // Click Insert menu
    const insertMenu = findElement([
      '[aria-label="Insert"]',
      'div[role="button"][aria-label="Insert"]'
    ]);
    
    if (insertMenu) {
      insertMenu.click();
      await wait(400);
      
      // Click Table menu item
      const tableItem = findElement([
        '[role="menuitem"][aria-label*="Table"]',
        'span:contains("Table")'
      ]);
      
      if (tableItem) {
        tableItem.click();
        await wait(300);
        
        // Just click first grid cell for 1x1 table
        // Google Docs will show a grid picker
        const gridCell = document.querySelector('[role="gridcell"]');
        if (gridCell) {
          gridCell.click();
          return 'success';
        }
      }
    }
    
    return 'table_menu_not_found';
  } catch (error) {
    console.error('insert_table error:', error);
    return 'error';
  }
}

window.__foxxy_add_comment = async function add_comment({ text }) {
  try {
    console.log('Comment feature requires manual interaction with Google Docs UI');
    return 'manual_interaction_required';
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
    
    // Find the page background and change it
    const pageContainer = findElement([
      '.kix-appview-editor-container',
      '[data-page-background-color]',
      '.docs-page'
    ]);
    
    if (pageContainer) {
      pageContainer.style.backgroundColor = rgbColor;
      return 'success';
    }
    
    return 'page_background_not_found';
  } catch (error) {
    console.error('set_page_color error:', error);
    return 'error';
  }
}

})();

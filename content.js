console.log('Content script loaded');
// Function to copy password to clipboard using the Clipboard API
async function copyPasswordToClipboard(password) {
  try {
    await navigator.clipboard.writeText(password);
    alert(chrome.i18n.getMessage('passwordCopied'));
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}

// Function to reveal the password
function revealPassword(field) {
  field.type = field.type === 'password' ? 'text' : 'password';
}

// Function to check if the domain is disabled
function isDomainDisabled() {
  const domain = window.location.hostname;
  return new Promise((resolve) => {
    chrome.storage.local.get(['passsnap_disabled_domains'], (data) => {
      const disabledDomains = data.passsnap_disabled_domains || [];
      resolve(disabledDomains.includes(domain));
    });
  });
}

// Function to check if the page is disabled
function isPageDisabled() {
  const pageUrl = window.location.href;
  return new Promise((resolve) => {
    chrome.storage.local.get(['passsnap_disabled_pages'], (data) => {
      const disabledPages = data.passsnap_disabled_pages || [];
      resolve(disabledPages.includes(pageUrl));
    });
  });
}

// Function to create a copy button and attach it next to password fields
async function addCopyButtons() {
  const passwordFields = document.querySelectorAll('input[type="password"]');

  const [domainDisabled, pageDisabled] = await Promise.all([isDomainDisabled(), isPageDisabled()]);

  if (domainDisabled || pageDisabled) return; // Exit if the extension is disabled for this page or domain

  chrome.storage.local.get(['passsnap_action'], (data) => {
    const action = data.passsnap_action || 'copy';

    passwordFields.forEach((field) => {
      const actionButton = document.createElement('button');
      actionButton.appendChild(document.createTextNode(
        action === 'copy' ? chrome.i18n.getMessage('copyPassword') :
          action === 'reveal' ? chrome.i18n.getMessage('revealPassword') :
            chrome.i18n.getMessage('copyAndRevealPassword')
      ));
      actionButton.style.marginLeft = '10px';


      // Apply MUI styles
      Object.assign(actionButton.style, {
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        fontSize: '14px',
        cursor: 'pointer',
        textTransform: 'uppercase',
        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        transition: 'background-color 0.3s ease',
      });

      actionButton.addEventListener('mouseover', () => {
        actionButton.style.backgroundColor = '#1565c0';
      });

      actionButton.addEventListener('mouseout', () => {
        actionButton.style.backgroundColor = '#1976d2';
      });

      actionButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        if (action === 'copy') {
          field.type = 'text'; // Temporarily change to text to copy
          copyPasswordToClipboard(field.value);
          field.type = 'password'; // Change back to password type
        } else if (action === 'reveal') {
          revealPassword(field);
        } else if (action === 'copy_and_reveal') {
          copyPasswordToClipboard(field.value);
          revealPassword(field);
        }
      });

      // Insert the button after the password field
      field.parentNode.insertBefore(actionButton, field.nextSibling);
    });
  });
}

// Run the function to add copy buttons when the content script is loaded
addCopyButtons();

/**
 * Plint Waitlist Integration
 * 
 * This script automatically integrates waitlist functionality with your Framer-exported HTML.
 * 
 * USAGE: Add these lines before </body> in your HTML:
 *   <link rel="stylesheet" href="./waitlist-integration.css">
 *   <script src="./waitlist-integration.js"></script>
 * 
 * CONFIGURATION (optional): Add before the script tag:
 *   <script>
 *     window.WAITLIST_CONFIG = {
 *       apiEndpoint: '/api/waitlist',  // Your API endpoint
 *       buttonSelectors: ['#1cv54m', '#zk9qad', '.framer-1hhz98c-container a', '.framer-1t490rx-container a'],
 *       formSelectors: ['form.framer-a2xppx'],
 *       buttonTextMatch: /get\s*access/i,  // Regex to match button text
 *       debug: true
 *     };
 *   </script>
 */

(function() {
  'use strict';
  
  // Immediate debug output
  console.log('[Waitlist] Script loaded!');

  // Default configuration
  const DEFAULT_CONFIG = {
    apiEndpoint: '/api/waitlist',
    contactApiEndpoint: '/api/contact',
    // Selectors for buttons that should open the modal
    buttonSelectors: [
      '#1cv54m',           // Hero section button
      '#zk9qad',           // "Design Faster" section button
      '.framer-1hhz98c-container a',  // Desktop navbar button
      '.framer-1t490rx-container a'   // Mobile navbar button
    ],
    // Selectors for existing forms on the page (like join-waitlist-page.html)
    formSelectors: [
      'form.framer-a2xppx'
    ],
    // Selectors for contact/query forms
    contactFormSelectors: [
      'form.framer-exiu6h'
    ],
    // Regex to match button text for auto-detection
    buttonTextMatch: /get\s*access/i,
    // Links that should open modal instead of navigating
    linkPatterns: [
      /join-waitlist/i,
      /\/waitlist$/i
    ],
    debug: true  // Set to true for debugging
  };

  // Merge user config with defaults
  const config = { ...DEFAULT_CONFIG, ...(window.WAITLIST_CONFIG || {}) };

  function log(...args) {
    if (config.debug) console.log('[Waitlist]', ...args);
  }

  // ============================================
  // MODAL CREATION
  // ============================================
  
  function createModal() {
    // Check if modal already exists
    if (document.getElementById('waitlist-modal')) {
      log('Modal already exists');
      return document.getElementById('waitlist-modal');
    }

    log('Creating new modal element...');
    const modal = document.createElement('div');
    modal.id = 'waitlist-modal';
    modal.className = 'waitlist-modal';
    // Full inline styles for reliability
    modal.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;align-items:center;justify-content:center;background-color:rgba(0,0,0,0.5);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);';
    
    modal.innerHTML = `
      <div style="position:relative;width:100%;max-width:900px;margin:20px;display:flex;border-radius:16px;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);background:#fff;">
        <!-- Left side - Image -->
        <div style="flex:1;min-height:500px;display:none;background-color:#F4F3EE;" class="waitlist-image-side">
          <img src="https://framerusercontent.com/images/enBCkZ1R5jXYBq2d1Y1WCCVhixI.png?scale-down-to=1024" 
               alt="Interior Design"
               style="width:100%;height:100%;object-fit:cover;object-position:58% 50%;">
        </div>
        <!-- Right side - Form -->
        <div style="flex:1;background-color:#fff;padding:48px 40px;position:relative;min-width:320px;">
          <!-- Close button -->
          <button class="waitlist-modal-close" style="position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;padding:8px;border-radius:4px;transition:background 0.2s;" aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M11.686 0.314C11.485 0.113 11.212 0 10.928 0C10.643 0 10.37 0.113 10.169 0.314L6 4.484L1.831 0.314C1.412 -0.105 0.733 -0.105 0.314 0.314C-0.104 0.733 -0.105 1.411 0.314 1.83L4.484 6L0.314 10.169C-0.105 10.588 -0.105 11.267 0.314 11.686C0.733 12.105 1.412 12.105 1.831 11.686L6 7.516L10.169 11.685C10.588 12.104 11.267 12.104 11.686 11.685C12.105 11.267 12.105 10.588 11.686 10.169L7.516 5.999L11.686 1.83C12.104 1.411 12.104 0.732 11.686 0.314Z" fill="#b8b8b8"/>
            </svg>
          </button>
          
          <h2 style="font-family:'Neue Montreal Medium',Helvetica,Arial,sans-serif;font-size:32px;font-weight:500;line-height:1.2;margin:0 0 12px 0;color:#000;">Join our Waitlist Now</h2>
          <p style="font-family:'Neue Montreal Medium',Helvetica,Arial,sans-serif;font-size:16px;font-weight:500;line-height:1.4;color:#5E5E5E;margin:0 0 32px 0;">Design stunning, production-ready outputs<br>just from your plans, elevations and inputs.</p>
          
          <form class="waitlist-modal-form" style="display:flex;flex-direction:column;gap:20px;">
            <div style="display:flex;flex-direction:column;gap:8px;">
              <label style="font-family:'Neue Montreal Medium',Helvetica,Arial,sans-serif;font-size:12px;font-weight:500;color:#888;">Name</label>
              <input type="text" name="name" placeholder="John Doe" 
                     style="width:100%;padding:14px 16px;border:1px solid rgba(136,136,136,0.2);border-radius:10px;background:rgba(187,187,187,0.1);font-family:'Neue Montreal Regular',Helvetica,Arial,sans-serif;font-size:14px;color:#3C3E3C;box-sizing:border-box;outline:none;">
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <label style="font-family:'Neue Montreal Medium',Helvetica,Arial,sans-serif;font-size:12px;font-weight:500;color:#888;">Email</label>
              <input type="email" name="email" placeholder="john.doe@gmail.com" required
                     style="width:100%;padding:14px 16px;border:1px solid rgba(136,136,136,0.2);border-radius:10px;background:rgba(187,187,187,0.1);font-family:'Neue Montreal Regular',Helvetica,Arial,sans-serif;font-size:14px;color:#3C3E3C;box-sizing:border-box;outline:none;">
            </div>
            <div class="waitlist-message" style="display:none;padding:12px;border-radius:8px;font-family:'Neue Montreal Regular',Helvetica,Arial,sans-serif;font-size:14px;text-align:center;"></div>
            <button type="button" class="waitlist-submit-btn" style="width:100%;padding:14px;background-color:#2E4934;color:#fff;border:none;border-radius:10px;font-family:'Neue Montreal Regular',Helvetica,Arial,sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:opacity 0.2s;">Submit</button>
          </form>
        </div>
      </div>
      <style>
        @media (min-width: 768px) {
          .waitlist-image-side { display: block !important; }
        }
        .waitlist-modal-close:hover { background: rgba(0,0,0,0.05); }
        .waitlist-modal-close:hover svg path { fill: #666; }
        .waitlist-submit-btn:hover { opacity: 0.9; }
        .waitlist-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .waitlist-modal-form input:focus { border-color: #2E4934; }
      </style>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  function createToast() {
    if (document.getElementById('waitlist-toast')) {
      return document.getElementById('waitlist-toast');
    }

    const toast = document.createElement('div');
    toast.id = 'waitlist-toast';
    toast.className = 'waitlist-toast';
    document.body.appendChild(toast);
    return toast;
  }

  // ============================================
  // MODAL CONTROL
  // ============================================

  function openModal(e) {
    log('openModal called');
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      log('Event prevented and stopped');
    }
    const modal = document.getElementById('waitlist-modal');
    log('Modal element:', modal);
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex'; // Force display
      document.body.style.overflow = 'hidden';
      log('Modal opened and display set to flex');
      log('Modal classList:', modal.classList.toString());
    } else {
      log('ERROR: Modal element not found!');
    }
  }

  function closeModal() {
    log('closeModal called');
    const modal = document.getElementById('waitlist-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';  // Force hide
      document.body.style.overflow = '';
      // Reset form
      const form = modal.querySelector('.waitlist-modal-form');
      if (form) form.reset();
      const msg = modal.querySelector('.waitlist-message');
      if (msg) msg.style.display = 'none';
      log('Modal closed and hidden');
    }
  }

  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================

  function showToast(message, type) {
    const toast = document.getElementById('waitlist-toast');
    if (toast) {
      toast.textContent = message;
      toast.className = 'waitlist-toast active ' + type;
      setTimeout(() => {
        toast.classList.remove('active');
      }, 4000);
    }
  }

  // ============================================
  // API SUBMISSION
  // ============================================

  async function submitToWaitlist(name, email, form, submitBtn) {
    const originalText = submitBtn ? submitBtn.textContent : 'Submit';
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Joining...';
    }

    const apiUrl = config.apiEndpoint;
    log('Calling API:', apiUrl);
    log('Payload:', { email, full_name: name || null });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          full_name: name || null,
        }),
      });

      log('Response status:', response.status);
      const data = await response.json();
      log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      log('Successfully submitted:', email);
      return { success: true, message: data.message || 'Successfully joined the waitlist!' };
    } catch (error) {
      log('Submission error:', error.message);
      log('Full error:', error);
      return { success: false, message: error.message || 'Something went wrong. Please try again.' };
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  }

  // ============================================
  // CONTACT FORM API SUBMISSION
  // ============================================

  async function submitContactQuery(name, query, form, submitBtn) {
    const originalText = submitBtn ? (submitBtn.querySelector('.framer-text, p')?.textContent || submitBtn.textContent || 'Submit') : 'Submit';
    const textEl = submitBtn ? submitBtn.querySelector('.framer-text, p') : null;
    
    if (submitBtn) {
      submitBtn.disabled = true;
      if (textEl) textEl.textContent = 'Submitting...';
      else submitBtn.textContent = 'Submitting...';
    }

    const apiUrl = config.contactApiEndpoint;
    log('Calling Contact API:', apiUrl);
    log('Payload:', { name, query });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          query: query,
        }),
      });

      log('Response status:', response.status);
      const data = await response.json();
      log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit query');
      }

      log('Successfully submitted contact query');
      return { success: true, message: data.message || 'Your query has been submitted successfully!' };
    } catch (error) {
      log('Submission error:', error.message);
      log('Full error:', error);
      return { success: false, message: error.message || 'Something went wrong. Please try again.' };
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        if (textEl) textEl.textContent = originalText;
        else submitBtn.textContent = originalText;
      }
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  function handleModalFormSubmit(e) {
    log('Modal form submit triggered');
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const submitBtn = form.querySelector('.waitlist-submit-btn');
    const messageDiv = form.querySelector('.waitlist-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    log('Form data - Name:', name, 'Email:', email);

    if (!email) {
      log('Email validation failed - empty');
      messageDiv.textContent = 'Email is required';
      messageDiv.className = 'waitlist-message error';
      messageDiv.style.display = 'block';
      return;
    }

    log('Submitting to API...');
    submitToWaitlist(name, email, form, submitBtn).then(result => {
      log('API Response:', result);
      messageDiv.textContent = result.message;
      messageDiv.className = 'waitlist-message ' + (result.success ? 'success' : 'error');
      messageDiv.style.display = 'block';

      if (result.success) {
        form.reset();
        setTimeout(closeModal, 2000);
      }
    });
  }

  function handleExistingFormSubmit(e) {
    log('Existing form submit triggered');
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[name="Name"]');
    const emailInput = form.querySelector('input[name="Email"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    log('Form data - Name:', name, 'Email:', email);

    if (!email) {
      log('Email validation failed - empty');
      showToast('Email is required', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      log('Email validation failed - invalid format');
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Store original text
    const textEl = submitBtn ? submitBtn.querySelector('.framer-text, p') : null;
    const originalText = textEl ? textEl.textContent : 'Submit';

    if (textEl) textEl.textContent = 'Joining...';
    if (submitBtn) submitBtn.disabled = true;

    log('Submitting to API...');
    submitToWaitlist(name, email, form, null).then(result => {
      log('API Response:', result);
      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success) form.reset();
      if (textEl) textEl.textContent = originalText;
      if (submitBtn) submitBtn.disabled = false;
    });
  }

  function handleContactFormSubmit(e) {
    log('Contact form submit triggered');
    e.preventDefault();
    e.stopPropagation();
    
    const form = e.target;
    
    // Find name and query inputs - the form uses "Email" as name attribute for both
    // First input is Name, second is the query/message
    const inputs = form.querySelectorAll('input.framer-form-input');
    const nameInput = inputs[0]; // First input is Name
    const queryInput = inputs[1]; // Second input is Query (it's actually a text input styled as textarea)
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const query = queryInput ? queryInput.value.trim() : '';
    
    log('Contact Form data - Name:', name, 'Query:', query);

    // Validation: Name is required
    if (!name) {
      log('Name validation failed - empty');
      showToast('Name is required', 'error');
      if (nameInput) nameInput.focus();
      return;
    }

    // Validation: Query is required
    if (!query) {
      log('Query validation failed - empty');
      showToast('Please enter your query', 'error');
      if (queryInput) queryInput.focus();
      return;
    }

    // Validation: Query max 200 words
    const wordCount = query.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 200) {
      log('Query validation failed - too many words:', wordCount);
      showToast(`Query exceeds 200 words limit. Current: ${wordCount} words`, 'error');
      if (queryInput) queryInput.focus();
      return;
    }

    log('Submitting contact query to API...');
    submitContactQuery(name, query, form, submitBtn).then(result => {
      log('Contact API Response:', result);
      showToast(result.message, result.success ? 'success' : 'error');
      if (result.success) {
        form.reset();
        // Clear the input fields explicitly
        if (nameInput) nameInput.value = '';
        if (queryInput) queryInput.value = '';
      }
    });
  }

  // ============================================
  // BUTTON DETECTION & BINDING
  // ============================================

  function shouldOpenModal(element) {
    // Check if element or its children contain "Get access" text
    const text = element.textContent || '';
    if (config.buttonTextMatch.test(text)) return true;

    // Check href patterns
    const href = element.getAttribute('href') || '';
    for (const pattern of config.linkPatterns) {
      if (pattern.test(href)) return true;
    }

    return false;
  }

  function bindButtonEvents() {
    log('Binding button events using document-level capture...');
    
    // Use document-level event capturing to intercept clicks BEFORE Framer
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // Check if click is inside any of our target elements
      // Check by ID (hero button: 1cv54m, design faster button: zk9qad)
      const heroBtn = document.getElementById('1cv54m');
      const designBtn = document.getElementById('zk9qad');
      
      // Check if clicked inside hero button
      if (heroBtn && (heroBtn === target || heroBtn.contains(target))) {
        log('Hero button clicked!');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal();
        return false;
      }
      
      // Check if clicked inside design faster button
      if (designBtn && (designBtn === target || designBtn.contains(target))) {
        log('Design Faster button clicked!');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal();
        return false;
      }
      
      // Check navbar buttons by class
      const navbarContainers = ['.framer-1hhz98c-container', '.framer-1t490rx-container'];
      for (const containerClass of navbarContainers) {
        const container = target.closest(containerClass);
        if (container) {
          const link = container.querySelector('a');
          const href = link ? link.getAttribute('href') || '' : '';
          if (href.includes('join-waitlist') || href.includes('waitlist')) {
            log('Navbar button clicked!');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            openModal();
            return false;
          }
        }
      }
      
      // Check for any link to waitlist pages
      const clickedLink = target.closest('a');
      if (clickedLink) {
        const href = clickedLink.getAttribute('href') || '';
        if (href.includes('join-waitlist') || href.includes('/waitlist')) {
          log('Waitlist link clicked:', href);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          openModal();
          return false;
        }
      }
      
      // Check for "Get access" text in clicked element
      const textContent = target.textContent || '';
      if (/get\s*access/i.test(textContent) && target.closest('a, button')) {
        log('Get access button clicked by text match!');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        openModal();
        return false;
      }
      
    }, true); // TRUE = capture phase (runs before other handlers)
    
    log('Document-level click handler installed');
    log('Hero button (1cv54m) found:', !!document.getElementById('1cv54m'));
    log('Design button (zk9qad) found:', !!document.getElementById('zk9qad'));
  }

  function bindFormEvents() {
    log('Binding form events...');
    log('Looking for forms with selectors:', config.formSelectors);
    
    config.formSelectors.forEach(selector => {
      const forms = document.querySelectorAll(selector);
      log('Found', forms.length, 'forms for selector:', selector);
      
      forms.forEach((form, index) => {
        if (!form._waitlistBound) {
          // Bind form submit event
          form.addEventListener('submit', handleExistingFormSubmit);
          form._waitlistBound = true;
          log('Bound existing form #' + index + ':', selector);
          
          // IMPORTANT: Also bind to submit button click as Framer may intercept form submit
          const submitBtn = form.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
              log('Existing form submit button clicked');
              e.preventDefault();
              e.stopPropagation();
              handleExistingFormSubmit({ preventDefault: () => {}, target: form });
            }, true); // Use capture phase to intercept before Framer
          }
        }
      });
    });
  }

  function bindContactFormEvents() {
    log('Binding contact form events...');
    log('Looking for contact forms with selectors:', config.contactFormSelectors);
    
    // Use document-level event capturing to intercept clicks BEFORE Framer
    document.addEventListener('click', function(e) {
      const target = e.target;
      
      // Check if clicked on a submit button inside contact form
      // Use closest() to find if click was on button or any child element
      const clickedButton = target.closest('button[type="submit"]');
      if (clickedButton) {
        // Check if this button is inside a contact form
        config.contactFormSelectors.forEach(selector => {
          const forms = document.querySelectorAll(selector);
          forms.forEach(form => {
            if (form.contains(clickedButton)) {
              log('Contact form submit button clicked via document handler!');
              log('Target element:', target.tagName, target.className);
              log('Button found:', clickedButton);
              log('Form found:', form);
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              handleContactFormSubmit({ preventDefault: () => {}, stopPropagation: () => {}, target: form });
              return;
            }
          });
        });
      }
    }, true); // TRUE = capture phase (runs before Framer's handlers)
    
    // Also bind form submit event for keyboard submissions
    config.contactFormSelectors.forEach(selector => {
      const forms = document.querySelectorAll(selector);
      log('Found', forms.length, 'contact forms for selector:', selector);
      
      forms.forEach((form, index) => {
        if (!form._contactBound) {
          form.addEventListener('submit', handleContactFormSubmit, true);
          form._contactBound = true;
          log('Bound contact form #' + index + ':', selector);
        }
      });
    });
    
    log('Contact form document-level click handler installed');
    
    // Immediate debug: log found forms
    config.contactFormSelectors.forEach(selector => {
      const forms = document.querySelectorAll(selector);
      console.log('[Waitlist] Contact forms found for selector "' + selector + '":', forms.length);
      forms.forEach((form, i) => {
        console.log('[Waitlist] Form #' + i + ':', form);
        const inputs = form.querySelectorAll('input.framer-form-input');
        console.log('[Waitlist] Inputs found in form:', inputs.length);
        const btns = form.querySelectorAll('button[type="submit"]');
        console.log('[Waitlist] Submit buttons found in form:', btns.length);
      });
    });
  }

  function bindModalEvents() {
    const modal = document.getElementById('waitlist-modal');
    if (!modal) {
      log('ERROR: Modal element not found!');
      return;
    }
    log('Binding modal events...');

    // Close on backdrop click
    modal.onclick = function(e) {
      if (e.target === modal) {
        log('Backdrop clicked');
        closeModal();
      }
    };

    // Close button - use onclick for reliability
    const closeBtn = modal.querySelector('.waitlist-modal-close');
    if (closeBtn) {
      closeBtn.onclick = function(e) {
        log('Close button clicked');
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      };
      log('Close button bound');
    }

    // Form submission
    const form = modal.querySelector('.waitlist-modal-form');
    if (form) {
      log('Modal form found');
      
      // Primary handler: submit button click
      const submitBtn = form.querySelector('.waitlist-submit-btn');
      if (submitBtn) {
        log('Submit button found, attaching click handler');
        submitBtn.onclick = function(e) {
          log('=== SUBMIT BUTTON CLICKED ===');
          e.preventDefault();
          e.stopPropagation();
          
          const nameInput = form.querySelector('input[name="name"]');
          const emailInput = form.querySelector('input[name="email"]');
          const messageDiv = form.querySelector('.waitlist-message');
          
          const name = nameInput ? nameInput.value.trim() : '';
          const email = emailInput ? emailInput.value.trim() : '';
          
          log('Form values - Name:', name, 'Email:', email);
          
          if (!email) {
            log('Email validation failed');
            if (messageDiv) {
              messageDiv.textContent = 'Email is required';
              messageDiv.style.display = 'block';
              messageDiv.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
              messageDiv.style.color = 'rgb(220, 38, 38)';
              messageDiv.style.padding = '12px';
              messageDiv.style.borderRadius = '8px';
            }
            return false;
          }
          
          // Disable button
          submitBtn.disabled = true;
          submitBtn.textContent = 'Joining...';
          
          log('Calling API...');
          submitToWaitlist(name, email, form, submitBtn).then(result => {
            log('API result:', result);
            if (messageDiv) {
              messageDiv.textContent = result.message;
              messageDiv.style.display = 'block';
              messageDiv.style.padding = '12px';
              messageDiv.style.borderRadius = '8px';
              if (result.success) {
                messageDiv.style.backgroundColor = 'rgba(46, 73, 52, 0.1)';
                messageDiv.style.color = 'rgb(46, 73, 52)';
                form.reset();
                setTimeout(closeModal, 2000);
              } else {
                messageDiv.style.backgroundColor = 'rgba(220, 38, 38, 0.1)';
                messageDiv.style.color = 'rgb(220, 38, 38)';
              }
            }
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
          });
          
          return false;
        };
        log('Submit button onclick handler set');
      } else {
        log('WARNING: Submit button not found in modal!');
      }
    } else {
      log('WARNING: Modal form not found!');
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
    
    log('Modal events bound successfully');
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  function init() {
    log('Initializing Waitlist Integration...');
    log('Current URL:', window.location.href);
    log('Config:', JSON.stringify(config, null, 2));
    
    // Create modal and toast
    const modal = createModal();
    const toast = createToast();
    log('Modal created:', !!modal);
    log('Toast created:', !!toast);

    // Bind events
    bindModalEvents();
    bindButtonEvents();
    bindFormEvents();
    bindContactFormEvents();

    // Expose global functions for manual triggering
    window.PlintWaitlist = {
      openModal,
      closeModal,
      showToast,
      rebind: () => {
        bindButtonEvents();
        bindFormEvents();
        bindContactFormEvents();
      }
    };

    log('Initialization complete');
    log('You can manually open the modal by running: PlintWaitlist.openModal()');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


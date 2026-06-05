/**
 * Doc Vault - Frontend Application Engine
 * Implements state management, agentic document mapping, retention handshake contract,
 * and live compliance simulation with countdown timers.
 */

// Global Application State
const state = {
  // Navigation
  activeTab: 'vault',

  // Customer Vault Documents
  vault: [
    {
      id: 'doc_passport',
      name: 'John_Smith_Passport.pdf',
      class: 'Primary Identity',
      code: 'primary_id',
      uploaded: '2026-01-15',
      expiry: '2030-12-15',
      size: '2.4 MB',
      status: 'Secured',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      contexts: [
        { title: 'Identity Verification (IDV)', provider: 'Apex, Nova, Horizon', desc: 'Provides national photographic identification for onboarding credit accounts.' }
      ],
      analytics: [
        { title: 'Age Gating Automation', prospective: 'Entertainment, Retailers', desc: 'Verified date of birth (DOB) payload can automate regulatory age-compliance processes.' }
      ]
    },
    {
      id: 'doc_license',
      name: 'Driver_License_NSW.jpg',
      class: 'Secondary Identity',
      code: 'secondary_id',
      uploaded: '2026-02-10',
      expiry: '2028-04-10',
      size: '1.8 MB',
      status: 'Secured',
      hash: '82f6e3c0989fbf52b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649a',
      contexts: [
        { title: 'Secondary ID Verification', provider: 'Apex Mortgages', desc: 'Fulfills multi-agency credit verification requirements.' },
        { title: 'Manual Vehicle Suitability Check', provider: 'Horizon Logistics (Prospective)', desc: 'Validates legal capacity to operate manual transmissions based on class endorsements.' }
      ],
      analytics: [
        { title: 'Truck Driver Recruitment Check', prospective: 'DHL, Linfox, AusPost', desc: 'Validates commercial driving capability. Prospective logistics platforms can automate recruitment credential checks.' }
      ]
    },
    {
      id: 'doc_tax_fy25',
      name: 'FY25_Tax_Assessment.pdf',
      class: 'Financial Audit',
      code: 'tax_return',
      uploaded: '2025-07-15',
      expiry: 'N/A',
      size: '4.1 MB',
      status: 'Secured',
      hash: '495991b7852b855e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca',
      contexts: [
        { title: 'Financial Capacity Verification', provider: 'Apex Mortgages', desc: 'Verifies annual gross earnings and tax compliance history for underwriting.' }
      ],
      analytics: [
        { title: 'Rental Application Screening', prospective: 'RealEstate.com, Domain', desc: 'Annual earnings proof could automate credit health scoring for prospective tenant applications.' }
      ]
    },
    {
      id: 'doc_payslip_apr',
      name: 'Payslip_April_2026.pdf',
      class: 'Income Proof',
      code: 'payslip',
      uploaded: '2026-05-01',
      expiry: 'N/A',
      size: '950 KB',
      status: 'Secured',
      hash: '27ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afbf4c8996fb924',
      contexts: [
        { title: 'Active Income Verification', provider: 'Apex Mortgages, Horizon Auto', desc: 'Verifies current employment status and stable net earnings cycles.' }
      ],
      analytics: [
        { title: 'ABN Verification Autocomplete', prospective: 'Business Banking Accounts', desc: 'Ingests employer ABN to suggest business verification statuses automatically.' }
      ]
    },
    {
      id: 'doc_payslip_mar',
      name: 'Payslip_March_2026.pdf',
      class: 'Income Proof',
      code: 'payslip',
      uploaded: '2026-04-01',
      expiry: 'N/A',
      size: '950 KB',
      status: 'Secured',
      hash: 'c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afbf4',
      contexts: [
        { title: 'Active Income Verification', provider: 'Apex Mortgages', desc: 'Validates previous month base income consistency.' }
      ],
      analytics: [
        { title: 'Salary Sacrificing Analysis', prospective: 'Novated Lease Providers', desc: 'Identifies pre-tax salary sacrifice deductions to suggest car loan eligibility optimization.' }
      ]
    }
  ],

  // Enterprise Policies Configuration
  policies: {
    home_loan: {
      name: 'Home Loan Assessment Rules',
      desc: 'Multi-channel home loan assessment requiring extensive financial and identity verifications.',
      channel: 'Broker Portal',
      rules: [
        { docClass: 'Primary Identity', code: 'primary_id', retention: '60', trigger: 'Upon verification' },
        { docClass: 'Secondary Identity', code: 'secondary_id', retention: '90', trigger: 'Upon verification' },
        { docClass: 'Income Proof', code: 'payslip', retention: '180', trigger: 'Post decision / 14 days' },
        { docClass: 'Financial Audit', code: 'tax_return', retention: '300', trigger: 'Regulatory audit archive' }
      ]
    },
    car_loan: {
      name: 'Car Loan Branch Rules',
      desc: 'Facilitated in-branch by a banker. Requires Primary ID and proof of income (1 Pay Slip).',
      channel: 'Branch Tablet',
      rules: [
        { docClass: 'Primary Identity', code: 'primary_id', retention: '45', trigger: 'Immediate verif check' },
        { docClass: 'Income Proof', code: 'payslip', retention: '90', trigger: 'Post decision / 7 days' }
      ]
    },
    credit_card: {
      name: 'Fast-Track Credit Card Rules',
      desc: 'Instant mobile application. Requires only a Primary ID. Instant decisions.',
      channel: 'Mobile API',
      rules: [
        { docClass: 'Primary Identity', code: 'primary_id', retention: '20', trigger: 'Post decision / 30 seconds' }
      ]
    }
  },

  // Active Customer Handshakes (Visible on Dashboard)
  activeHandshakes: [
    {
      id: 'hs_active_1',
      provider: 'Apex Mortgages',
      providerCode: 'apex',
      service: 'Home Loan',
      sharedFiles: [
        { docId: 'doc_passport', name: 'John_Smith_Passport.pdf', code: 'primary_id', status: 'verified', timer: null },
        { docId: 'doc_payslip_apr', name: 'Payslip_April_2026.pdf', code: 'payslip', status: 'counting', timer: 145 },
        { docId: 'doc_payslip_mar', name: 'Payslip_March_2026.pdf', code: 'payslip', status: 'counting', timer: 145 }
      ]
    }
  ],

  // Completed purges counter
  purgesCompleted: 14,

  // Simulator State Machine
  sim: {
    step: 1,
    journey: null, // 'home_loan_broker', 'car_loan_branch', 'cc_mobile'
    serviceKey: '', // 'home_loan', 'car_loan', 'credit_card'
    providerName: '', // 'Apex Mortgages', 'Horizon Auto', 'Nova Credit'
    matchedFiles: [], // List of matched file objects
    consentGiven: false,
    activeShares: [], // Live simulation files in bank cache
    timers: [], // Active timers for step 4
    decisionMade: false // Has applicant been approved or rejected
  }
};

// Document Class Helper Icons
const DOC_ICONS = {
  'Primary Identity': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  'Secondary Identity': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="4"></line><line x1="8" y1="2" x2="8" y2="4"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  'Income Proof': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
  'Financial Audit': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  'default': `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`
};

// ==========================================
// 1. TABS MANAGEMENT
// ==========================================
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabName = item.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;
  
  // Update nav menu active state
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });

  // Switch tab display
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  const targetTab = document.getElementById(`tab-${tabName}`);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Update Page Title and Descriptions
  const titles = {
    vault: {
      title: 'Customer Vault',
      desc: 'Secure custodian repository of your personal verification records.'
    },
    enterprise: {
      title: 'Enterprise Policies',
      desc: 'Establish default document ingestion rules and legal retention handshake contracts.'
    },
    simulator: {
      title: 'Handshake Simulator Sandbox',
      desc: 'Test the end-to-end user document verification and automated purge workflow.'
    }
  };

  document.getElementById('current-tab-title').innerText = titles[tabName].title;
  document.getElementById('current-tab-desc').innerText = titles[tabName].desc;

  // Render specific tab content if needed
  if (tabName === 'vault') {
    renderVaultGrid();
    renderActiveHandshakes();
    updateDashboardStats();
  } else if (tabName === 'enterprise') {
    loadPolicyEditor('home_loan');
  }
}

// ==========================================
// 2. VAULT TAB MANAGEMENT
// ==========================================
function updateDashboardStats() {
  // Handshakes count
  const hsCount = state.activeHandshakes.filter(hs => 
    hs.sharedFiles.some(f => f.status === 'counting' || f.status === 'verified')
  ).length;
  document.getElementById('active-handshakes-count').innerText = `${hsCount} Connected`;

  // Shared files count
  const sharedCount = state.activeHandshakes.reduce((acc, hs) => {
    return acc + hs.sharedFiles.filter(f => f.status === 'counting' || f.status === 'verified').length;
  }, 0);
  document.getElementById('shared-files-count').innerText = `${sharedCount} Files`;

  // Purged completed count
  document.getElementById('purged-files-count').innerText = `${state.purgesCompleted} Documents`;
}

function renderVaultGrid() {
  const grid = document.getElementById('document-grid');
  grid.innerHTML = '';

  state.vault.forEach(doc => {
    const icon = DOC_ICONS[doc.class] || DOC_ICONS['default'];
    const card = document.createElement('div');
    card.className = 'document-card';
    card.setAttribute('data-id', doc.id);
    
    card.innerHTML = `
      <div class="doc-top">
        <div class="doc-icon">${icon}</div>
        <div class="doc-padlock">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
      </div>
      <div class="doc-info">
        <div class="doc-name" title="${doc.name}">${doc.name}</div>
        <div class="doc-meta">${doc.class} • ${doc.size}</div>
      </div>
      <div class="doc-actions">
        <span class="doc-status">${doc.status}</span>
        <button class="doc-btn-view" data-id="${doc.id}">Details</button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Attach event listeners to details button
  document.querySelectorAll('.doc-btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.getAttribute('data-id');
      openDocumentDetails(id);
    });
  });
}

let activeDocId = null;

function openDocumentDetails(docId) {
  const doc = state.vault.find(d => d.id === docId);
  if (!doc) return;

  activeDocId = docId;
  document.getElementById('modal-doc-title').innerText = doc.name;
  document.getElementById('modal-doc-hash').innerText = `SHA-256: ${doc.hash}`;

  // Pre-fill customisable inputs
  document.getElementById('modal-custom-name').value = doc.name;
  document.getElementById('modal-class-override').value = doc.class;

  const grid = document.getElementById('modal-metadata-grid');
  grid.innerHTML = `
    <div class="metadata-row">
      <span class="metadata-label">File Size</span>
      <span class="metadata-val">${doc.size}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Upload Date</span>
      <span class="metadata-val">${doc.uploaded}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Expiration Date</span>
      <span class="metadata-val">${doc.expiry}</span>
    </div>
    <div class="metadata-row">
      <span class="metadata-label">Custodian Status</span>
      <span class="metadata-val text-emerald">100% User Custody</span>
    </div>
  `;

  // Render Context Potential List
  const contextList = document.getElementById('modal-context-list');
  contextList.innerHTML = '';
  
  const contexts = doc.contexts || [
    { title: 'General Document Verification', provider: 'Onboarded Service Providers', desc: 'Allows general proof/verification criteria matching.' }
  ];

  contexts.forEach(ctx => {
    const el = document.createElement('div');
    el.className = 'context-item';
    el.innerHTML = `
      <div class="context-item-header">
        <strong>${ctx.title}</strong>
        <span class="badge success" style="font-size: 0.6rem;">${ctx.provider}</span>
      </div>
      <p>${ctx.desc}</p>
    `;
    contextList.appendChild(el);
  });

  // Render Internal Analytics prospective suggestions
  const analyticsList = document.getElementById('modal-analytics-list');
  analyticsList.innerHTML = '';

  const analytics = doc.analytics || [
    { title: 'Standard Digital Compliance', prospective: 'Prospective SaaS Integrators', desc: 'General verification suggestion detects this doc class to automate workflow checklists.' }
  ];

  analytics.forEach(an => {
    const el = document.createElement('div');
    el.className = 'analytics-item';
    el.innerHTML = `
      <div class="analytics-item-header">
        <strong>${an.title}</strong>
        <span class="badge blue" style="font-size: 0.6rem;">${an.prospective}</span>
      </div>
      <p>${an.desc}</p>
    `;
    analyticsList.appendChild(el);
  });

  document.getElementById('doc-modal').style.display = 'flex';
}

function setupModal() {
  const modal = document.getElementById('doc-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Save changes handler
  document.getElementById('modal-save-changes-btn').addEventListener('click', () => {
    if (!activeDocId) return;
    
    const doc = state.vault.find(d => d.id === activeDocId);
    if (!doc) return;

    const newName = document.getElementById('modal-custom-name').value.trim();
    const newClass = document.getElementById('modal-class-override').value;

    if (newName) {
      doc.name = newName;
    }

    doc.class = newClass;

    // Map the system class to standard category codes so the agent can match it
    const classMapping = {
      'Primary Identity': 'primary_id',
      'Secondary Identity': 'secondary_id',
      'Income Proof': 'payslip',
      'Financial Audit': 'tax_return'
    };

    doc.code = classMapping[newClass] || 'unknown';

    // If it's a difficult path file resolved, update contexts
    if (newClass !== 'Ambiguous - Class Refinement Needed') {
      doc.status = 'Secured';
      // Populate context and analytics if missing or ambiguous
      doc.contexts = [
        { title: 'Custom User Resolved Verification', provider: 'Onboarded Providers', desc: `Manually re-classified as ${newClass} to enable direct workspace ingestion.` }
      ];
      doc.analytics = [
        { title: 'User Optimized Matching', prospective: 'Prospective Integrations', desc: 'Custom overrides suggest auto-match accuracy optimizations for future uploads.' }
      ];
    } else {
      doc.status = 'Ambiguous - Review Needed';
    }

    renderVaultGrid();
    modal.style.display = 'none';

    // Trigger glowing visual feedback on the card
    const card = document.querySelector(`.document-card[data-id="${activeDocId}"]`);
    if (card) {
      card.style.borderColor = 'var(--accent-emerald)';
      card.style.boxShadow = 'var(--shadow-glow-emerald)';
      setTimeout(() => {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      }, 2000);
    }
  });
}

function renderActiveHandshakes() {
  const list = document.getElementById('active-handshakes-list');
  list.innerHTML = '';

  const activeHS = state.activeHandshakes.filter(hs => 
    hs.sharedFiles.some(f => f.status === 'counting' || f.status === 'verified')
  );

  if (activeHS.length === 0) {
    list.innerHTML = `
      <div class="glass-card text-center" style="padding: 2rem; color: var(--text-muted);">
        <p>No active shared handshakes found.</p>
        <p style="font-size: 0.75rem; margin-top: 5px;">Initiate a loan journey in the Simulator to establish a handshake.</p>
      </div>
    `;
    return;
  }

  activeHS.forEach(hs => {
    const card = document.createElement('div');
    card.className = 'handshake-share-card';
    
    let checklistItems = '';
    hs.sharedFiles.forEach(file => {
      let timerClass = 'counting';
      let timerText = '';

      if (file.status === 'purged') {
        timerClass = 'purged';
        timerText = 'PURGED';
      } else if (file.status === 'verified') {
        timerClass = 'verified';
        timerText = 'VERIFIED';
      } else {
        const mins = Math.floor(file.timer / 60);
        const secs = file.timer % 60;
        timerText = `${mins}:${secs.toString().padStart(2, '0')}`;
      }

      checklistItems += `
        <div class="share-file-item">
          <span class="share-file-name">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            ${file.name}
          </span>
          <span class="share-file-timer ${timerClass}">${timerText}</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="share-card-header">
        <div class="share-provider-info">
          <div class="provider-logo ${hs.providerCode}">${hs.provider.substring(0,2).toUpperCase()}</div>
          <div>
            <h4>${hs.provider}</h4>
            <p>${hs.service} Handshake Active</p>
          </div>
        </div>
        <span class="badge success">Connected</span>
      </div>
      <div class="share-files-checklist">
        ${checklistItems}
      </div>
    `;

    list.appendChild(card);
  });
}

// Simulated countdown clocks
function startDashboardTimers() {
  setInterval(() => {
    let updated = false;

    state.activeHandshakes.forEach(hs => {
      hs.sharedFiles.forEach(file => {
        if (file.status === 'counting' && file.timer > 0) {
          file.timer--;
          updated = true;

          if (file.timer === 0) {
            file.status = 'purged';
            state.purgesCompleted++;
            
            // Log to console if simulator tab is active
            if (state.activeTab === 'simulator' && state.sim.step === 4) {
              logAuditTrail(`AUTO_PURGED: Shared copy of "${file.name}" deleted from server cache.`, 'purge');
            }
          }
        }
      });
    });

    if (updated) {
      if (state.activeTab === 'vault') {
        renderActiveHandshakes();
        updateDashboardStats();
      }
      if (state.activeTab === 'simulator' && state.sim.step === 4) {
        renderLiveExecutionFiles();
      }
    }
  }, 1000);
}

// Upload Area simulation
function setupUpload() {
  const zone = document.getElementById('upload-zone');
  const input = document.getElementById('file-input');

  zone.addEventListener('click', () => {
    input.click();
  });

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--primary)';
  });

  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = 'var(--border-color)';
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files.length > 0) {
      simulateScanAndAdd(e.dataTransfer.files[0].name);
    }
  });

  input.addEventListener('change', () => {
    if (input.files.length > 0) {
      simulateScanAndAdd(input.files[0].name);
    }
  });

  // Happy Path Trigger
  document.getElementById('btn-upload-happy').addEventListener('click', () => {
    simulateScanAndAdd('NSW_Drivers_License_John_Smith.jpg', {
      predefinedClass: 'Secondary Identity',
      code: 'secondary_id',
      contexts: [
        { title: 'Identity Verification Check (IDV)', provider: 'Apex Mortgages, Horizon Auto', desc: 'Validates primary/secondary photographic ID credentials.' },
        { title: 'Manual Vehicle Suitability Check', provider: 'Horizon Logistics (Prospective)', desc: 'Validates licence endorsements for operating heavy manual transmission vehicles.' }
      ],
      analytics: [
        { title: 'Driver Qualification Compliance', prospective: 'Linfox, DHL Recruitment', desc: 'NSW HR Class License detected. Suggest onboarding prospective transport firms to automate dispatch vetting.' }
      ]
    });
  });

  // Difficult Path Trigger
  document.getElementById('btn-upload-difficult').addEventListener('click', () => {
    simulateScanAndAdd('Combined_Assessment_and_WaterBill_LowRes.pdf', {
      predefinedClass: 'Ambiguous - Class Refinement Needed',
      code: 'unknown',
      contexts: [],
      analytics: [
        { title: 'Metadata Parsing Issues Detected', prospective: 'SaaS OCR Refiner', desc: 'Low resolution and mixed document type pages make auto-classification ambiguous. Manual override requested.' }
      ]
    });
  });
}

function simulateScanAndAdd(fileName, predefinedDetails = null) {
  // 1. Create a dummy element representing upload progress
  const grid = document.getElementById('document-grid');
  const tempCard = document.createElement('div');
  tempCard.className = 'document-card';
  tempCard.innerHTML = `
    <div class="scanner-overlay"></div>
    <div class="scanner-line-glow"></div>
    <div class="doc-top">
      <div class="doc-icon">
        <div class="spinner-small"></div>
      </div>
    </div>
    <div class="doc-info">
      <div class="doc-name">${fileName}</div>
      <div class="doc-meta">AI Scanning Document Metadata...</div>
    </div>
    <div class="doc-actions">
      <span class="doc-status" style="color: var(--accent-amber)">OCR Parsing</span>
    </div>
  `;
  grid.prepend(tempCard);

  // 2. Determine Document Class automatically
  let docClass = 'Primary Identity';
  let code = 'primary_id';
  let contexts = [];
  let analytics = [];
  
  if (predefinedDetails) {
    docClass = predefinedDetails.predefinedClass;
    code = predefinedDetails.code;
    contexts = predefinedDetails.contexts || [];
    analytics = predefinedDetails.analytics || [];
  } else {
    const nameLower = fileName.toLowerCase();
    if (nameLower.includes('payslip') || nameLower.includes('pay') || nameLower.includes('salary')) {
      docClass = 'Income Proof';
      code = 'payslip';
      contexts = [{ title: 'Active Income Verification', provider: 'Onboarded Lenders', desc: 'Provides active net income cycle verification.' }];
      analytics = [{ title: 'Net Income Calculation', prospective: 'Prospective Underwriters', desc: 'Validates regular baseline deposits.' }];
    } else if (nameLower.includes('tax') || nameLower.includes('taxreturn') || nameLower.includes('assessment')) {
      docClass = 'Financial Audit';
      code = 'tax_return';
      contexts = [{ title: 'Tax Ingestion Audit', provider: 'Mortgage Brokers', desc: 'Validates gross yearly earnings declarations.' }];
      analytics = [{ title: 'Credit Capability Indexing', prospective: 'Asset Financiers', desc: 'Analyzes multi-year income trends.' }];
    } else if (nameLower.includes('license') || nameLower.includes('driver')) {
      docClass = 'Secondary Identity';
      code = 'secondary_id';
      contexts = [{ title: 'Secondary Photo ID Check', provider: 'Auto Lenders, Brokers', desc: 'Validates driver auth qualifications.' }];
      analytics = [{ title: 'Driver Risk Profile check', prospective: 'Auto Insurance Brokers', desc: 'Validates license state clean records.' }];
    } else if (nameLower.includes('statement') || nameLower.includes('bank')) {
      docClass = 'Financial Audit';
      code = 'tax_return';
      contexts = [{ title: 'Liquid Cash Verification', provider: 'Lenders', desc: 'Validates active savings balance check-offs.' }];
      analytics = [{ title: 'Liquidity Analytics Ingestion', prospective: 'Credit Index Agencies', desc: 'Tracks regular outgoing payments.' }];
    } else {
      // General upload fallback
      contexts = [{ title: 'Custodian File Proof', provider: 'Standard Integrations', desc: 'Serves general doc ingestion checks.' }];
      analytics = [{ title: 'Unclassified Context Indexing', prospective: 'Prospective Integrations', desc: 'Manual metadata refinement is recommended to activate automated matching.' }];
    }
  }

  // 3. Complete OCR simulation in 2s
  setTimeout(() => {
    tempCard.remove();

    // Create random details
    const randomHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const today = new Date().toISOString().split('T')[0];
    const mockDoc = {
      id: 'doc_' + Math.random().toString(36).substring(2, 9),
      name: fileName,
      class: docClass,
      code: code,
      uploaded: today,
      expiry: docClass.includes('Identity') ? '2031-05-01' : 'N/A',
      size: (Math.random() * 3 + 1).toFixed(1) + ' MB',
      status: docClass.includes('Ambiguous') ? 'Ambiguous - Review Needed' : 'Secured',
      hash: randomHash,
      contexts: contexts,
      analytics: analytics
    };

    // Add to state and re-render
    state.vault.push(mockDoc);
    renderVaultGrid();

    // Open detail details modal automatically if difficult path, to guide the user
    if (docClass.includes('Ambiguous')) {
      setTimeout(() => {
        openDocumentDetails(mockDoc.id);
      }, 500);
    }
  }, 2000);
}

// ==========================================
// 3. ENTERPRISE TAB MANAGEMENT
// ==========================================
let activePolicyService = 'home_loan';

function setupEnterpriseView() {
  const tabs = document.querySelectorAll('.service-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const service = tab.getAttribute('data-service');
      loadPolicyEditor(service);
    });
  });

  document.getElementById('save-policy-btn').addEventListener('click', () => {
    savePolicyRules();
  });

  document.getElementById('reset-policy-btn').addEventListener('click', () => {
    resetPolicyDefaults();
  });
}

function loadPolicyEditor(serviceKey) {
  activePolicyService = serviceKey;
  const policy = state.policies[serviceKey];
  
  document.getElementById('policy-service-name').innerText = policy.name;
  document.getElementById('policy-service-desc').innerText = policy.desc;
  document.getElementById('policy-channel-badge').innerText = policy.channel;

  const rulesList = document.getElementById('policy-rules-list');
  rulesList.innerHTML = '';

  policy.rules.forEach((rule, idx) => {
    const row = document.createElement('div');
    row.className = 'policy-rule-row';
    
    // Retention dropdown selection
    let retentionOptions = `
      <option value="20" ${rule.retention === '20' ? 'selected' : ''}>20 seconds (CC Fast)</option>
      <option value="45" ${rule.retention === '45' ? 'selected' : ''}>45 seconds (Identity Check)</option>
      <option value="60" ${rule.retention === '60' ? 'selected' : ''}>60 seconds (Short Verification)</option>
      <option value="90" ${rule.retention === '90' ? 'selected' : ''}>90 seconds (Medium assessment)</option>
      <option value="180" ${rule.retention === '180' ? 'selected' : ''}>180 seconds (Default Underwriting)</option>
      <option value="300" ${rule.retention === '300' ? 'selected' : ''}>300 seconds (Deep analysis audit)</option>
    `;

    row.innerHTML = `
      <div class="rule-doc-type">
        <strong>${rule.docClass}</strong>
        <span>Requirements tag: ${rule.code}</span>
      </div>
      <div class="rule-selects">
        <select class="policy-select retention-selector" data-index="${idx}">
          ${retentionOptions}
        </select>
        <select class="policy-select trigger-selector" disabled>
          <option>Self-Executing Purge</option>
        </select>
      </div>
    `;

    rulesList.appendChild(row);
  });
}

function savePolicyRules() {
  const policy = state.policies[activePolicyService];
  const selectors = document.querySelectorAll('.retention-selector');
  
  selectors.forEach(sel => {
    const idx = parseInt(sel.getAttribute('data-index'));
    policy.rules[idx].retention = sel.value;
  });

  // Visual success feedback
  const saveBtn = document.getElementById('save-policy-btn');
  const oldText = saveBtn.innerText;
  saveBtn.innerText = 'Updated Successfully!';
  saveBtn.style.backgroundColor = 'var(--accent-emerald)';
  saveBtn.disabled = true;

  setTimeout(() => {
    saveBtn.innerText = oldText;
    saveBtn.style.backgroundColor = '';
    saveBtn.disabled = false;
  }, 1500);
}

function resetPolicyDefaults() {
  const defaults = {
    home_loan: [
      { docClass: 'Primary Identity', code: 'primary_id', retention: '60', trigger: 'Upon verification' },
      { docClass: 'Secondary Identity', code: 'secondary_id', retention: '90', trigger: 'Upon verification' },
      { docClass: 'Income Proof', code: 'payslip', retention: '180', trigger: 'Post decision / 14 days' },
      { docClass: 'Financial Audit', code: 'tax_return', retention: '300', trigger: 'Regulatory audit archive' }
    ],
    car_loan: [
      { docClass: 'Primary Identity', code: 'primary_id', retention: '45', trigger: 'Immediate verif check' },
      { docClass: 'Income Proof', code: 'payslip', retention: '90', trigger: 'Post decision / 7 days' }
    ],
    credit_card: [
      { docClass: 'Primary Identity', code: 'primary_id', retention: '20', trigger: 'Post decision / 30 seconds' }
    ]
  };

  state.policies[activePolicyService].rules = JSON.parse(JSON.stringify(defaults[activePolicyService]));
  loadPolicyEditor(activePolicyService);
}

// ==========================================
// 4. SIMULATOR TAB MANAGEMENT (SANDBOX WIZARD)
// ==========================================
function setupSimulator() {
  // Step 1: Selection Cards
  const cards = document.querySelectorAll('.journey-card');
  cards.forEach(card => {
    card.querySelector('.select-journey-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const journey = card.getAttribute('data-journey');
      selectSimulatorJourney(journey);
    });
  });

  // Navigation actions
  document.getElementById('back-to-step-1').addEventListener('click', () => gotoSimStep(1));
  document.getElementById('back-to-step-2').addEventListener('click', () => gotoSimStep(2));
  
  document.getElementById('trigger-agent-match-btn').addEventListener('click', runAgenticMatch);
  document.getElementById('proceed-to-step-3').addEventListener('click', generateHandshakeContract);
  
  document.getElementById('consent-checkbox').addEventListener('change', (e) => {
    document.getElementById('proceed-to-step-4').disabled = !e.target.checked;
  });

  document.getElementById('proceed-to-step-4').addEventListener('click', executeHandshakeTransmission);

  // Time controls step 4
  document.getElementById('sim-time-ff').addEventListener('click', fastForwardTime);
  document.getElementById('sim-btn-approve').addEventListener('click', () => resolveApplication('APPROVED'));
  document.getElementById('sim-btn-reject').addEventListener('click', () => resolveApplication('REJECTED'));
  document.getElementById('reset-simulator-btn').addEventListener('click', resetSimulatorJourney);
}

function selectSimulatorJourney(journeyKey) {
  state.sim.journey = journeyKey;
  
  const mapping = {
    'home_loan_broker': { serviceKey: 'home_loan', providerName: 'Apex Mortgages' },
    'car_loan_branch': { serviceKey: 'car_loan', providerName: 'Horizon Auto' },
    'cc_mobile': { serviceKey: 'credit_card', providerName: 'Nova Credit' }
  };

  state.sim.serviceKey = mapping[journeyKey].serviceKey;
  state.sim.providerName = mapping[journeyKey].providerName;

  // Move to step 2 automatically
  gotoSimStep(2);
}

function gotoSimStep(stepNumber) {
  state.sim.step = stepNumber;

  // Update wizard visual indicators
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`w-step-${i}`);
    el.className = 'w-step';
    if (i < stepNumber) {
      el.classList.add('completed');
    } else if (i === stepNumber) {
      el.classList.add('active');
    }
  }

  // Display correct panel
  document.querySelectorAll('.step-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  document.getElementById(`sim-step-${stepNumber}`).classList.add('active');

  // Trigger step-specific load behaviors
  if (stepNumber === 2) {
    loadAgenticStep();
  }
}

// Load Step 2 setup
function loadAgenticStep() {
  document.getElementById('agentic-service-title').innerText = state.sim.providerName;
  document.getElementById('agentic-service-logo').innerText = state.sim.providerName.substring(0,2).toUpperCase();
  document.getElementById('enterprise-node-name').innerText = state.sim.providerName + ' Portal';

  // Render checklist requirements
  const checklist = document.getElementById('requirements-checklist-list');
  checklist.innerHTML = '';

  const policy = state.policies[state.sim.serviceKey];
  policy.rules.forEach(rule => {
    const li = document.createElement('li');
    li.className = 'req-checklist-item';
    li.id = `checklist-${rule.code}`;
    li.innerHTML = `
      <span class="req-check-bubble"></span>
      <span>${rule.docClass} Check</span>
    `;
    checklist.appendChild(li);
  });

  // Reset visual canvas, status bar, and buttons
  const svg = document.getElementById('connecting-svg');
  svg.innerHTML = '';
  document.getElementById('matcher-status-bar').style.backgroundColor = '';
  document.getElementById('matcher-status-text').innerText = 'Click "Run Doc Vault Agentic Match" to begin mapping files from your vault to the application rules.';
  document.getElementById('trigger-agent-match-btn').disabled = false;
  document.getElementById('proceed-to-step-3').disabled = true;

  // Reset activity console
  const consoleEl = document.getElementById('agent-log-console');
  consoleEl.innerHTML = `<p class="console-line system">[System]: Initiating secure connection workspace...</p>`;
}

// Running OCR/Agentic match visual simulation
function runAgenticMatch() {
  const consoleEl = document.getElementById('agent-log-console');
  const matchBtn = document.getElementById('trigger-agent-match-btn');
  const spinner = document.getElementById('agentic-spinner');
  
  matchBtn.disabled = true;
  spinner.style.display = 'block';
  document.getElementById('matcher-status-text').innerText = 'Agent evaluating rules... Searching user custodian directory.';

  // Start sequential agentic mapping steps
  let stepIdx = 0;
  const policy = state.policies[state.sim.serviceKey];
  const requiredRules = policy.rules;
  state.sim.matchedFiles = [];

  function processNextRule() {
    if (stepIdx >= requiredRules.length) {
      // Complete mapping successfully
      spinner.style.display = 'none';
      document.getElementById('matcher-status-text').innerText = 'Agentic match completed. All files securely mapped. Handshake contract ready.';
      document.getElementById('matcher-status-bar').style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
      document.getElementById('proceed-to-step-3').disabled = false;
      return;
    }

    const rule = requiredRules[stepIdx];
    
    // Look up doc in user vault
    const candidate = state.vault.find(doc => doc.code === rule.code);

    if (candidate) {
      // Document found
      state.sim.matchedFiles.push({
        rule: rule,
        doc: candidate
      });

      // Update log console
      appendConsoleLine(`Searching matching asset for "${rule.docClass}"...`, 'agent');
      
      setTimeout(() => {
        appendConsoleLine(`SUCCESS: Matched vault file "${candidate.name}" (SHA-256: ${candidate.hash.substring(0,8)}...)`, 'success');
        
        // Draw visual bezier curve line
        drawConnectingLine(stepIdx, requiredRules.length);
        
        // Light up checkbox item
        const chk = document.getElementById(`checklist-${rule.code}`);
        if (chk) chk.classList.add('matched');

        stepIdx++;
        setTimeout(processNextRule, 1000);
      }, 800);

    } else {
      // Document missing
      appendConsoleLine(`WARNING: Missing required document matching tag "${rule.code}"!`, 'warning');
      spinner.style.display = 'none';
      document.getElementById('matcher-status-text').innerText = `Failed: Missing document class "${rule.docClass}" in your vault. Go back to Dashboard and upload it first.`;
      document.getElementById('matcher-status-bar').style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
    }
  }

  processNextRule();
}

function appendConsoleLine(text, type) {
  const consoleEl = document.getElementById('agent-log-console');
  const line = document.createElement('p');
  line.className = `console-line ${type}`;
  line.innerText = `[${new Date().toLocaleTimeString()}]: ${text}`;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function drawConnectingLine(index, total) {
  const svg = document.getElementById('connecting-svg');
  
  // Create defs for gradients if not already present
  if (!svg.querySelector('defs')) {
    svg.innerHTML = `
      <defs>
        <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="100%" stop-color="#3b82f6" />
        </linearGradient>
      </defs>
    `;
  }

  const w = svg.clientWidth || 300;
  const h = svg.clientHeight || 250;

  // Calculate start (vault side) and end (enterprise side)
  const startX = 20;
  const startY = h / 2;
  
  const endX = w - 20;
  const stepH = h / (total + 1);
  const endY = stepH * (index + 1);

  // Bezier curve calculations
  const cp1X = startX + (endX - startX) * 0.4;
  const cp1Y = startY;
  const cp2X = startX + (endX - startX) * 0.6;
  const cp2Y = endY;

  const pathStr = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
  
  // Background path
  const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  bgPath.setAttribute('d', pathStr);
  bgPath.setAttribute('class', 'drawing-path');
  svg.appendChild(bgPath);

  // Glowing animated overlay path
  const activePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  activePath.setAttribute('d', pathStr);
  activePath.setAttribute('class', 'active-path');
  svg.appendChild(activePath);
}

// Generate Handshake Step 3 contract details
function generateHandshakeContract() {
  document.getElementById('contract-receiver-name').innerText = state.sim.providerName;
  document.getElementById('consent-checkbox').checked = false;
  document.getElementById('proceed-to-step-4').disabled = true;

  const tbody = document.getElementById('contract-policies-tbody');
  tbody.innerHTML = '';

  state.sim.matchedFiles.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.rule.docClass}</strong></td>
      <td>${item.doc.name}</td>
      <td><span class="text-amber">${item.rule.retention} seconds</span> retention</td>
      <td>Purge post verification (${item.rule.trigger})</td>
    `;
    tbody.appendChild(tr);
  });

  gotoSimStep(3);
}

// Step 4 Execution Launch
function executeHandshakeTransmission() {
  // Transfer matched files to temporary enterprise database in simulated app
  state.sim.activeShares = state.sim.matchedFiles.map(item => {
    return {
      docId: item.doc.id,
      name: item.doc.name,
      docClass: item.doc.class,
      code: item.doc.code,
      timer: parseInt(item.rule.retention),
      status: 'counting' // 'counting', 'purged', 'verified'
    };
  });

  // Inject this handshake into customer dashboard status as active
  const newHandshake = {
    id: 'hs_' + Math.random().toString(36).substring(2, 9),
    provider: state.sim.providerName,
    providerCode: state.sim.journey.includes('broker') ? 'apex' : (state.sim.journey.includes('branch') ? 'horizon' : 'nova'),
    service: state.sim.serviceKey === 'home_loan' ? 'Home Loan' : (state.sim.serviceKey === 'car_loan' ? 'Car Loan' : 'Credit Card'),
    sharedFiles: state.sim.activeShares
  };

  // Prepend to dashboard so user can see it when switching tabs
  state.activeHandshakes.unshift(newHandshake);

  state.sim.decisionMade = false;

  // Setup Step 4 view components
  document.getElementById('enterprise-cache-title').innerText = state.sim.providerName + ' Storage';
  document.getElementById('enterprise-cache-status').innerText = 'Processing Assessment...';
  document.getElementById('enterprise-cache-status').className = 'text-amber text-sm';
  document.getElementById('sim-btn-approve').disabled = false;
  document.getElementById('sim-btn-reject').disabled = false;

  // Clear console log
  const consoleEl = document.getElementById('audit-ledger-console');
  consoleEl.innerHTML = '';

  // Log contract handshake initiation
  logAuditTrail(`HANDSHAKE_INITIATED: Signed term contract #C-${Math.floor(Math.random()*90000+10000)} executed.`, 'handshake');
  
  state.sim.activeShares.forEach(f => {
    logAuditTrail(`TRANSFERRED: Access token granted for "${f.name}" (${f.docClass}) with ${f.timer}s countdown.`, 'system');
  });

  renderLiveExecutionFiles();
  gotoSimStep(4);
}

function renderLiveExecutionFiles() {
  // Render master copies in customer vault side
  const masterContainer = document.getElementById('sim-vault-master-files');
  masterContainer.innerHTML = '';

  state.sim.matchedFiles.forEach(item => {
    const row = document.createElement('div');
    row.className = 'sim-file-row';
    row.innerHTML = `
      <div class="sim-file-info">
        <div class="sim-file-icon">${DOC_ICONS[item.doc.class] || DOC_ICONS['default']}</div>
        <div class="sim-file-meta">
          <strong>${item.doc.name}</strong>
          <span>${item.doc.class} • Master File</span>
        </div>
      </div>
      <div class="sim-file-seal" title="100% Secure Custody">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
      </div>
    `;
    masterContainer.appendChild(row);
  });

  // Render temporary copies on enterprise database side
  const cacheContainer = document.getElementById('sim-enterprise-cache-files');
  cacheContainer.innerHTML = '';

  state.sim.activeShares.forEach(file => {
    const card = document.createElement('div');
    card.className = `enterprise-file-card ${file.status === 'purged' ? 'shredded' : ''}`;
    
    let timerBadge = '';
    let descriptionText = '';

    if (file.status === 'purged') {
      timerBadge = `<span class="ent-timer-badge wiped">WIPED</span>`;
      descriptionText = `SHREDDED: Data block scrubbed from disk completely.`;
    } else if (file.status === 'verified') {
      timerBadge = `<span class="ent-timer-badge verified">VERIFIED</span>`;
      descriptionText = `Verified identity. Cached metadata deleted immediately.`;
    } else {
      timerBadge = `<span class="ent-timer-badge counting">${file.timer}s</span>`;
      descriptionText = `Active shared record. Enforced retention policy counting.`;
    }

    card.innerHTML = `
      <div class="ent-card-header">
        <div class="ent-card-title">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          ${file.name}
        </div>
        ${timerBadge}
      </div>
      <div class="ent-card-desc">${descriptionText}</div>
    `;

    cacheContainer.appendChild(card);
  });
}

function logAuditTrail(message, type) {
  const consoleEl = document.getElementById('audit-ledger-console');
  const line = document.createElement('p');
  line.className = 'ledger-line';
  
  const time = new Date().toLocaleTimeString();
  line.innerHTML = `
    <span class="ledger-time">${time}</span>
    <span class="ledger-tag ${type}">${type.toUpperCase()}</span>
    ${message}
  `;
  consoleEl.appendChild(line);
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

// Fast forward simulator time
function fastForwardTime() {
  let hasActiveCountdowns = false;

  state.sim.activeShares.forEach(file => {
    if (file.status === 'counting' && file.timer > 0) {
      file.timer = Math.max(0, file.timer - 30);
      hasActiveCountdowns = true;

      if (file.timer === 0) {
        file.status = 'purged';
        state.purgesCompleted++;
        logAuditTrail(`AUTO_PURGED: Shared copy of "${file.name}" deleted from Horizon server.`, 'purge');
      }
    }
  });

  if (hasActiveCountdowns) {
    renderLiveExecutionFiles();
  }
}

// Application Decision triggers immediate purge
function resolveApplication(decision) {
  state.sim.decisionMade = true;
  document.getElementById('enterprise-cache-status').innerText = `Application ${decision}`;
  document.getElementById('enterprise-cache-status').className = decision === 'APPROVED' ? 'text-emerald text-sm font-glow-green' : 'text-rose text-sm';
  document.getElementById('sim-btn-approve').disabled = true;
  document.getElementById('sim-btn-reject').disabled = true;

  logAuditTrail(`DECISION_RECORDED: Underwriting decided: ${decision}. Initiating cleanup routines.`, 'system');

  // Terminate all temporary file access immediately
  state.sim.activeShares.forEach(file => {
    if (file.status === 'counting') {
      file.timer = 0;
      file.status = 'purged';
      state.purgesCompleted++;
      logAuditTrail(`PURGE_ENFORCED: Application decided. Immediate purge executed on "${file.name}".`, 'purge');
    }
  });

  renderLiveExecutionFiles();
}

function resetSimulatorJourney() {
  // Go back to step 1
  document.querySelectorAll('.journey-card').forEach(c => c.classList.remove('selected'));
  state.sim = {
    step: 1,
    journey: null,
    serviceKey: '',
    providerName: '',
    matchedFiles: [],
    consentGiven: false,
    activeShares: [],
    timers: [],
    decisionMade: false
  };
  
  gotoSimStep(1);
}

// URL Deep-Linking Parser for Presenter Spotlight Actions
function parseUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  const step = urlParams.get('step');
  const action = urlParams.get('action');

  if (tab) {
    switchTab(tab);
    
    if (tab === 'simulator' && step) {
      // Auto pre-select Home Loan broker journey to load demo state correctly
      state.sim.journey = 'home_loan_broker';
      state.sim.serviceKey = 'home_loan';
      state.sim.providerName = 'Apex Mortgages';
      
      const policy = state.policies.home_loan;
      state.sim.matchedFiles = policy.rules.map(rule => {
        return {
          rule: rule,
          doc: state.vault.find(doc => doc.code === rule.code)
        };
      });

      gotoSimStep(parseInt(step));

      // If deep linking to step 4, simulate the active handshake cache countdowns
      if (parseInt(step) === 4) {
        state.sim.activeShares = state.sim.matchedFiles.map(item => {
          return {
            docId: item.doc.id,
            name: item.doc.name,
            docClass: item.doc.class,
            code: item.doc.code,
            timer: parseInt(item.rule.retention),
            status: 'counting'
          };
        });
        
        // Log transaction logs to let it look realistic
        const consoleEl = document.getElementById('audit-ledger-console');
        if (consoleEl) {
          consoleEl.innerHTML = '';
          logAuditTrail('HANDSHAKE_INITIATED: Presenter spotlight transaction sealed.', 'handshake');
          state.sim.activeShares.forEach(f => {
            logAuditTrail(`TRANSFERRED: Access granted for "${f.name}" (${f.timer}s limit).`, 'system');
          });
        }
        renderLiveExecutionFiles();
      }
    }
  }

  // Pre-configured trigger upload actions
  if (action === 'happy_upload') {
    setTimeout(() => {
      const btn = document.getElementById('btn-upload-happy');
      if (btn) btn.click();
    }, 800);
  } else if (action === 'difficult_upload') {
    setTimeout(() => {
      const btn = document.getElementById('btn-upload-difficult');
      if (btn) btn.click();
    }, 800);
  }
}

// ==========================================
// 5. BOOTSTRAP INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderVaultGrid();
  renderActiveHandshakes();
  setupModal();
  setupUpload();
  
  // Setup other view features
  setupEnterpriseView();
  setupSimulator();
  
  // Start countdown loops
  startDashboardTimers();

  // Parse spotlight parameters
  parseUrlParameters();
  
  console.log('Doc Vault Prototype initialized successfully.');
});

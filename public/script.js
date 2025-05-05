
// DOM Elements
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const modalContainer = document.getElementById('modal-container');
const modals = document.querySelectorAll('.modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const toastContainer = document.getElementById('toast-container');

// Sample data
const customersData = [
  { id: 1, name: 'John Smith', accountNo: 'EL-001-2023', address: '123 Main St', phone: '(555) 123-4567', email: 'john.smith@example.com', status: 'active' },
  { id: 2, name: 'Sarah Johnson', accountNo: 'EL-002-2023', address: '456 Oak Ave', phone: '(555) 234-5678', email: 'sarah.j@example.com', status: 'active' },
  { id: 3, name: 'Robert Williams', accountNo: 'EL-003-2023', address: '789 Pine Rd', phone: '(555) 345-6789', email: 'rob.w@example.com', status: 'inactive' },
  { id: 4, name: 'Emily Davis', accountNo: 'EL-004-2023', address: '321 Cedar Ln', phone: '(555) 456-7890', email: 'emily.d@example.com', status: 'active' },
  { id: 5, name: 'Michael Brown', accountNo: 'EL-005-2023', address: '654 Birch Dr', phone: '(555) 567-8901', email: 'michael.b@example.com', status: 'active' },
];

const billsData = [
  { id: 1, billNo: 'BILL-001-2023', customerId: 1, customerName: 'John Smith', amount: 124.50, units: 250, status: 'unpaid', dueDate: '2023-07-15', generatedDate: '2023-07-01' },
  { id: 2, billNo: 'BILL-002-2023', customerId: 2, customerName: 'Sarah Johnson', amount: 89.75, units: 180, status: 'paid', dueDate: '2023-07-15', generatedDate: '2023-07-01', paidDate: '2023-07-10' },
  { id: 3, billNo: 'BILL-003-2023', customerId: 3, customerName: 'Robert Williams', amount: 156.25, units: 310, status: 'unpaid', dueDate: '2023-07-15', generatedDate: '2023-07-01' },
  { id: 4, billNo: 'BILL-004-2023', customerId: 4, customerName: 'Emily Davis', amount: 102.80, units: 205, status: 'paid', dueDate: '2023-07-15', generatedDate: '2023-07-01', paidDate: '2023-07-08' },
  { id: 5, billNo: 'BILL-005-2023', customerId: 5, customerName: 'Michael Brown', amount: 67.20, units: 135, status: 'overdue', dueDate: '2023-06-15', generatedDate: '2023-06-01' },
];

const paymentsData = [
  { id: 1, transactionId: 'TX-001-2023', billNo: 'BILL-002-2023', customerName: 'Sarah Johnson', amount: 89.75, method: 'Credit Card', date: '2023-07-10' },
  { id: 2, transactionId: 'TX-002-2023', billNo: 'BILL-004-2023', customerName: 'Emily Davis', amount: 102.80, method: 'Bank Transfer', date: '2023-07-08' },
  { id: 3, transactionId: 'TX-003-2023', billNo: 'BILL-007-2023', customerName: 'David Wilson', amount: 132.45, method: 'Debit Card', date: '2023-07-05' },
  { id: 4, transactionId: 'TX-004-2023', billNo: 'BILL-009-2023', customerName: 'Jessica Lee', amount: 95.30, method: 'Credit Card', date: '2023-07-03' },
  { id: 5, transactionId: 'TX-005-2023', billNo: 'BILL-011-2023', customerName: 'Thomas Anderson', amount: 78.60, method: 'Cash', date: '2023-06-30' },
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Charts
  initializeCharts();
  
  // Populate tables
  populateCustomersTable();
  populateBillsTable();
  populatePaymentsTable();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check for URL hash to switch page
  const hash = window.location.hash || '#dashboard';
  switchPage(hash.substring(1));
});

// Setup event listeners
function setupEventListeners() {
  // Sidebar toggle
  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('collapsed');
  });
  
  // Menu item clicks
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      switchPage(page);
      
      // Update URL hash without scrolling
      history.pushState(null, null, `#${page}`);
    });
  });
  
  // Window hash change
  window.addEventListener('hashchange', function() {
    const hash = window.location.hash || '#dashboard';
    switchPage(hash.substring(1));
  });
  
  // Add Customer button
  document.getElementById('add-customer-btn').addEventListener('click', function() {
    showModal('add-customer-modal');
  });
  
  // Generate Bills button
  document.getElementById('generate-bills-btn').addEventListener('click', function() {
    showToast('Bills Generated', '36 new bills have been generated successfully.', 'success');
  });
  
  // Export Payments button
  document.getElementById('export-payments-btn').addEventListener('click', function() {
    showToast('Report Exported', 'Payment report has been exported successfully.', 'info');
  });
  
  // Close modal buttons
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      hideAllModals();
    });
  });
  
  // Modal background click to close
  modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) {
      hideAllModals();
    }
  });
  
  // Customer search
  document.getElementById('customer-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterCustomers(searchTerm);
  });
  
  // Bill search
  document.getElementById('bill-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterBills(searchTerm, document.getElementById('bill-status-filter').value);
  });
  
  // Bill status filter
  document.getElementById('bill-status-filter').addEventListener('change', function() {
    const status = this.value;
    filterBills(document.getElementById('bill-search').value.toLowerCase(), status);
  });
  
  // Payment search
  document.getElementById('payment-search').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    filterPayments(searchTerm, document.getElementById('payment-method-filter').value);
  });
  
  // Payment method filter
  document.getElementById('payment-method-filter').addEventListener('change', function() {
    const method = this.value;
    filterPayments(document.getElementById('payment-search').value.toLowerCase(), method);
  });
  
  // Add customer form submission
  document.getElementById('confirm-add-customer').addEventListener('click', function() {
    const form = document.getElementById('add-customer-form');
    const name = form.querySelector('[name="name"]').value.trim();
    const address = form.querySelector('[name="address"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    
    if (!name || !address || !phone || !email) {
      showToast('Error', 'Please fill in all fields.', 'error');
      return;
    }
    
    // Create new customer ID and account number
    const newId = customersData.length > 0 ? Math.max(...customersData.map(c => c.id)) + 1 : 1;
    const accountNo = `EL-${String(newId).padStart(3, '0')}-2023`;
    
    const newCustomer = {
      id: newId,
      name,
      accountNo,
      address,
      phone,
      email,
      status: 'active'
    };
    
    customersData.push(newCustomer);
    populateCustomersTable();
    
    // Clear form and hide modal
    form.reset();
    hideAllModals();
    
    showToast('Customer Added', `${name} has been added successfully.`, 'success');
  });
  
  // Cancel add customer
  document.getElementById('cancel-add-customer').addEventListener('click', function() {
    hideAllModals();
  });
  
  // Edit customer confirmation
  document.getElementById('confirm-edit-customer').addEventListener('click', function() {
    const form = document.getElementById('edit-customer-form');
    const id = parseInt(document.getElementById('edit-customer-id').value);
    const name = form.querySelector('[name="name"]').value.trim();
    const address = form.querySelector('[name="address"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    
    if (!name || !address || !phone || !email) {
      showToast('Error', 'Please fill in all fields.', 'error');
      return;
    }
    
    // Update customer
    const customerIndex = customersData.findIndex(c => c.id === id);
    if (customerIndex !== -1) {
      customersData[customerIndex] = {
        ...customersData[customerIndex],
        name,
        address,
        phone,
        email
      };
      
      populateCustomersTable();
      hideAllModals();
      showToast('Customer Updated', `${name}'s information has been updated.`, 'success');
    }
  });
  
  // Cancel edit customer
  document.getElementById('cancel-edit-customer').addEventListener('click', function() {
    hideAllModals();
  });
  
  // Delete customer confirmation
  document.getElementById('confirm-delete-customer').addEventListener('click', function() {
    const id = parseInt(document.getElementById('delete-customer-id').value);
    const customerIndex = customersData.findIndex(c => c.id === id);
    
    if (customerIndex !== -1) {
      const customerName = customersData[customerIndex].name;
      customersData.splice(customerIndex, 1);
      
      populateCustomersTable();
      hideAllModals();
      showToast('Customer Deleted', `${customerName} has been removed from the system.`, 'success');
    }
  });
  
  // Cancel delete customer
  document.getElementById('cancel-delete-customer').addEventListener('click', function() {
    hideAllModals();
  });
  
  // Pay bill confirmation
  document.getElementById('confirm-payment').addEventListener('click', function() {
    const billId = parseInt(document.getElementById('pay-bill-id').value);
    const paymentMethod = document.getElementById('payment-method').value;
    
    if (!paymentMethod) {
      showToast('Error', 'Please select a payment method.', 'error');
      return;
    }
    
    const billIndex = billsData.findIndex(b => b.id === billId);
    if (billIndex !== -1) {
      const bill = billsData[billIndex];
      
      // Update bill status
      billsData[billIndex] = {
        ...bill,
        status: 'paid',
        paidDate: new Date().toISOString().split('T')[0]
      };
      
      // Create payment record
      const newPaymentId = paymentsData.length > 0 ? Math.max(...paymentsData.map(p => p.id)) + 1 : 1;
      const transactionId = `TX-${String(newPaymentId).padStart(3, '0')}-2023`;
      
      const newPayment = {
        id: newPaymentId,
        transactionId,
        billNo: bill.billNo,
        customerName: bill.customerName,
        amount: bill.amount,
        method: paymentMethod === 'credit' ? 'Credit Card' : 
                paymentMethod === 'debit' ? 'Debit Card' : 
                paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash',
        date: new Date().toISOString().split('T')[0]
      };
      
      paymentsData.push(newPayment);
      
      populateBillsTable();
      populatePaymentsTable();
      hideAllModals();
      
      showToast('Payment Successful', `Bill ${bill.billNo} has been paid successfully.`, 'success');
    }
  });
  
  // Cancel payment
  document.getElementById('cancel-payment').addEventListener('click', function() {
    hideAllModals();
  });
  
  // Tab switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Remove active class from all tab buttons and panes
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Add active class to current tab button and pane
      this.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Settings form submissions
  const settingsForms = document.querySelectorAll('.settings-form');
  settingsForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formId = this.id;
      let message = '';
      
      switch(formId) {
        case 'company-form':
          message = 'Company information has been updated successfully.';
          break;
        case 'billing-form':
          message = 'Billing settings have been updated successfully.';
          break;
        case 'notifications-form':
          message = 'Notification settings have been updated successfully.';
          break;
        case 'security-form':
          message = 'Security settings have been updated successfully.';
          break;
      }
      
      showToast('Settings Updated', message, 'success');
    });
  });
}

// Switch page
function switchPage(pageId) {
  // Hide all pages
  pages.forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  const activePage = document.getElementById(`${pageId}-page`);
  if (activePage) {
    activePage.classList.add('active');
  }
  
  // Update menu items
  menuItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-page') === pageId) {
      item.classList.add('active');
    }
  });
}

// Show modal
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  
  if (modal) {
    // Show modal container
    modalContainer.classList.add('active');
    
    // Hide all modals
    modals.forEach(m => {
      m.classList.remove('active');
    });
    
    // Show selected modal
    modal.classList.add('active');
  }
}

// Hide all modals
function hideAllModals() {
  modalContainer.classList.remove('active');
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
}

// Show toast notification
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = '';
  switch(type) {
    case 'success':
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      break;
    case 'error':
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
      break;
    case 'warning':
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      break;
    default:
      iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
  }
  
  toast.innerHTML = `
    <div class="toast-icon">${iconSvg}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">&times;</button>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Auto remove toast after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
  
  // Close button functionality
  toast.querySelector('.toast-close').addEventListener('click', function() {
    toast.remove();
  });
}

// Initialize Charts
function initializeCharts() {
  // Energy Consumption Chart
  const consumptionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Energy Usage (kWh)',
      data: [340, 325, 410, 450, 420, 380, 400],
      backgroundColor: 'rgba(2, 132, 199, 0.2)',
      borderColor: 'rgba(2, 132, 199, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true
    }]
  };
  
  const consumptionChart = new Chart(
    document.getElementById('consumption-chart'),
    {
      type: 'line',
      data: consumptionData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  );
  
  // Revenue Chart
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [{
      label: 'Revenue ($)',
      data: [5200, 4800, 6100, 5800, 7200, 6800, 5500],
      backgroundColor: 'rgba(2, 132, 199, 0.7)',
      borderRadius: 4
    }]
  };
  
  const revenueChart = new Chart(
    document.getElementById('revenue-chart'),
    {
      type: 'bar',
      data: revenueData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  );
  
  // Payment Methods Chart
  const paymentMethodsData = {
    labels: ['Credit Card', 'Debit Card', 'Bank Transfer', 'Cash'],
    datasets: [{
      label: 'Number of Payments',
      data: [12, 8, 5, 3],
      backgroundColor: [
        'rgba(2, 132, 199, 0.7)',
        'rgba(16, 185, 129, 0.7)',
        'rgba(139, 92, 246, 0.7)',
        'rgba(245, 158, 11, 0.7)'
      ],
      borderRadius: 4
    }]
  };
  
  const paymentMethodsChart = new Chart(
    document.getElementById('payment-methods-chart'),
    {
      type: 'bar',
      data: paymentMethodsData,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: 'rgba(226, 232, 240, 0.5)'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }
  );
}

// Populate Customers Table
function populateCustomersTable() {
  const tableBody = document.querySelector('#customers-table tbody');
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add customer rows
  customersData.forEach(customer => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${customer.accountNo}</td>
      <td>${customer.name}</td>
      <td class="hide-on-mobile">${customer.address}</td>
      <td class="hide-on-mobile">${customer.phone}</td>
      <td class="hide-on-mobile">${customer.email}</td>
      <td>
        <span class="status-badge ${customer.status === 'active' ? 'status-active' : 'status-inactive'}">
          ${customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editCustomer(${customer.id})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button class="action-btn" onclick="viewCustomerBills(${customer.id})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </button>
          <button class="action-btn delete" onclick="deleteCustomer(${customer.id})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Populate Bills Table
function populateBillsTable() {
  const tableBody = document.querySelector('#bills-table tbody');
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add bill rows
  billsData.forEach(bill => {
    const row = document.createElement('tr');
    
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(bill.amount);
    
    const formattedDueDate = new Date(bill.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const formattedGeneratedDate = new Date(bill.generatedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    row.innerHTML = `
      <td>${bill.billNo}</td>
      <td>${bill.customerName}</td>
      <td>${bill.units} kWh</td>
      <td>${formattedAmount}</td>
      <td class="hide-on-mobile">${formattedGeneratedDate}</td>
      <td class="hide-on-mobile">${formattedDueDate}</td>
      <td>
        <span class="status-badge status-${bill.status}">
          ${bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
        </span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-btn download" onclick="downloadBill(${bill.id})">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </button>
          ${bill.status !== 'paid' ? `
            <button class="action-btn pay" onclick="payBill(${bill.id})">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </button>
          ` : ''}
        </div>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Populate Payments Table
function populatePaymentsTable() {
  const tableBody = document.querySelector('#payments-table tbody');
  
  // Clear existing rows
  tableBody.innerHTML = '';
  
  // Add payment rows
  paymentsData.forEach(payment => {
    const row = document.createElement('tr');
    
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(payment.amount);
    
    const formattedDate = new Date(payment.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const methodClass = payment.method.toLowerCase().replace(' ', '-');
    
    row.innerHTML = `
      <td>${payment.transactionId}</td>
      <td>${payment.billNo}</td>
      <td>${payment.customerName}</td>
      <td>${formattedAmount}</td>
      <td>
        <span class="method-badge method-${methodClass}">
          ${payment.method}
        </span>
      </td>
      <td>${formattedDate}</td>
    `;
    
    tableBody.appendChild(row);
  });
}

// Filter customers
function filterCustomers(searchTerm) {
  const rows = document.querySelectorAll('#customers-table tbody tr');
  
  rows.forEach(row => {
    const accountNo = row.cells[0].textContent.toLowerCase();
    const name = row.cells[1].textContent.toLowerCase();
    const email = row.cells[4].textContent.toLowerCase();
    
    if (accountNo.includes(searchTerm) || name.includes(searchTerm) || email.includes(searchTerm)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Filter bills
function filterBills(searchTerm, status) {
  const rows = document.querySelectorAll('#bills-table tbody tr');
  
  rows.forEach(row => {
    const billNo = row.cells[0].textContent.toLowerCase();
    const customerName = row.cells[1].textContent.toLowerCase();
    const billStatus = row.cells[6].textContent.trim().toLowerCase();
    
    const matchesSearch = billNo.includes(searchTerm) || customerName.includes(searchTerm);
    const matchesStatus = status === 'all' || billStatus === status;
    
    if (matchesSearch && matchesStatus) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Filter payments
function filterPayments(searchTerm, method) {
  const rows = document.querySelectorAll('#payments-table tbody tr');
  
  rows.forEach(row => {
    const transactionId = row.cells[0].textContent.toLowerCase();
    const billNo = row.cells[1].textContent.toLowerCase();
    const customerName = row.cells[2].textContent.toLowerCase();
    const paymentMethod = row.cells[4].textContent.trim().toLowerCase();
    
    const matchesSearch = transactionId.includes(searchTerm) || 
                          billNo.includes(searchTerm) || 
                          customerName.includes(searchTerm);
    
    const matchesMethod = method === 'all' || paymentMethod === method.replace('-', ' ');
    
    if (matchesSearch && matchesMethod) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

// Edit customer
function editCustomer(customerId) {
  const customer = customersData.find(c => c.id === customerId);
  
  if (customer) {
    document.getElementById('edit-customer-id').value = customer.id;
    document.getElementById('edit-customer-name').value = customer.name;
    document.getElementById('edit-customer-address').value = customer.address;
    document.getElementById('edit-customer-phone').value = customer.phone;
    document.getElementById('edit-customer-email').value = customer.email;
    
    showModal('edit-customer-modal');
  }
}

// Delete customer
function deleteCustomer(customerId) {
  document.getElementById('delete-customer-id').value = customerId;
  showModal('delete-customer-modal');
}

// View customer bills
function viewCustomerBills(customerId) {
  // Switch to bills page
  switchPage('bills');
  
  // Update URL hash
  history.pushState(null, null, '#bills');
  
  // Filter bills by customer
  const customer = customersData.find(c => c.id === customerId);
  
  if (customer) {
    document.getElementById('bill-search').value = customer.name;
    filterBills(customer.name.toLowerCase(), 'all');
  }
}

// Pay bill
function payBill(billId) {
  const bill = billsData.find(b => b.id === billId);
  
  if (bill) {
    document.getElementById('pay-bill-id').value = bill.id;
    document.getElementById('pay-bill-number').textContent = bill.billNo;
    document.getElementById('pay-bill-customer').textContent = bill.customerName;
    
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(bill.amount);
    
    document.getElementById('pay-bill-amount').textContent = formattedAmount;
    
    const formattedDueDate = new Date(bill.dueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    document.getElementById('pay-bill-due-date').textContent = formattedDueDate;
    
    document.getElementById('payment-method').value = '';
    
    showModal('pay-bill-modal');
  }
}

// Download bill
function downloadBill(billId) {
  const bill = billsData.find(b => b.id === billId);
  
  if (bill) {
    showToast('Download Started', `Bill ${bill.billNo} is being downloaded.`, 'info');
  }
}

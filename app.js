// ============================================
// 무펭이 대시보드 - Main Application
// ============================================

let dashboardData = null;
let charts = {};

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  initializeTabs();
  renderDashboard();
  updateLastUpdateTime();
});

// ============================================
// Data Loading
// ============================================

async function loadData() {
  try {
    const response = await fetch('data.json');
    dashboardData = await response.json();
    console.log('Dashboard data loaded:', dashboardData);
  } catch (error) {
    console.error('Failed to load data:', error);
    alert('데이터 로딩 실패. data.json 파일을 확인하세요.');
  }
}

// ============================================
// Tab Navigation
// ============================================

function initializeTabs() {
  const tabs = document.querySelectorAll('.tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and sections
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding section
      tab.classList.add('active');
      const sectionId = tab.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
    });
  });
}

// ============================================
// Render Dashboard
// ============================================

function renderDashboard() {
  if (!dashboardData) return;
  
  renderBusinessHealth();
  renderSkillEcosystem();
  renderAgentGrowth();
  renderOperations();
}

// ============================================
// Section 1: Business Health
// ============================================

function renderBusinessHealth() {
  const { businessHealth } = dashboardData;
  
  // KPI Cards
  document.getElementById('arr').textContent = formatCurrency(businessHealth.arr);
  document.getElementById('mrr').textContent = formatCurrency(businessHealth.mrr);
  document.getElementById('customers').textContent = businessHealth.customers.total;
  document.getElementById('churnRate').textContent = businessHealth.customers.churnRate;
  document.getElementById('runway').textContent = businessHealth.runway.months.toFixed(1);
  
  // Runway Progress Bar
  const runwayPercent = Math.min((businessHealth.runway.months / 12) * 100, 100);
  document.getElementById('runwayBar').style.width = `${runwayPercent}%`;
  
  // Revenue Chart
  renderRevenueChart(businessHealth.revenue);
  
  // Pipeline List
  renderPipeline(businessHealth.pipeline);
}

function renderRevenueChart(revenue) {
  const ctx = document.getElementById('revenueChart');
  
  if (charts.revenue) {
    charts.revenue.destroy();
  }
  
  charts.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels: revenue.map(r => r.month),
      datasets: [
        {
          label: 'ARR (만원)',
          data: revenue.map(r => r.arr / 10000),
          borderColor: '#53bf6b',
          backgroundColor: 'rgba(83, 191, 107, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'MRR (만원)',
          data: revenue.map(r => r.mrr / 10000),
          borderColor: '#0f3460',
          backgroundColor: 'rgba(15, 52, 96, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#eee' }
        }
      },
      scales: {
        y: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

function renderPipeline(pipeline) {
  const container = document.getElementById('pipelineList');
  container.innerHTML = '';
  
  pipeline.forEach(item => {
    const div = document.createElement('div');
    div.className = 'pipeline-item';
    div.innerHTML = `
      <div class="pipeline-item-header">
        <span class="pipeline-item-name">${item.name}</span>
        <span class="pipeline-item-stage">${item.stage}</span>
      </div>
      <div class="pipeline-item-info">
        ${item.industry} · 잠재가치 ${formatCurrency(item.potential)}
      </div>
    `;
    container.appendChild(div);
  });
}

// ============================================
// Section 2: Skill Ecosystem
// ============================================

function renderSkillEcosystem() {
  const { skillEcosystem } = dashboardData;
  
  // Stats
  document.getElementById('publishedSkills').textContent = skillEcosystem.total.published;
  document.getElementById('localSkills').textContent = skillEcosystem.total.local;
  document.getElementById('totalDownloads').textContent = skillEcosystem.total.totalDownloads;
  document.getElementById('koreanSkillsPercent').textContent = skillEcosystem.koreanSpecific.percentage;
  document.getElementById('koreanSkillsCount').textContent = skillEcosystem.koreanSpecific.count;
  document.getElementById('totalSkillsCount').textContent = skillEcosystem.total.published + skillEcosystem.total.local;
  
  // Charts
  renderDownloadChart(skillEcosystem.downloadTrend);
  renderCategoryChart(skillEcosystem.categories);
  renderTopSkillsChart(skillEcosystem.topSkills);
}

function renderDownloadChart(trend) {
  const ctx = document.getElementById('downloadChart');
  
  if (charts.download) {
    charts.download.destroy();
  }
  
  charts.download = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: trend.map(t => t.date),
      datasets: [{
        label: '다운로드 수',
        data: trend.map(t => t.downloads),
        backgroundColor: '#0f3460',
        borderColor: '#53bf6b',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#eee' }
        }
      },
      scales: {
        y: {
          ticks: { color: '#aaa', stepSize: 1 },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

function renderCategoryChart(categories) {
  const ctx = document.getElementById('categoryChart');
  
  if (charts.category) {
    charts.category.destroy();
  }
  
  charts.category = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: categories.map(c => c.name),
      datasets: [{
        data: categories.map(c => c.count),
        backgroundColor: [
          '#e94560',
          '#0f3460',
          '#53bf6b',
          '#f0a500',
          '#16213e'
        ],
        borderWidth: 2,
        borderColor: '#1a1a2e'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#eee' }
        }
      }
    }
  });
}

function renderTopSkillsChart(skills) {
  const ctx = document.getElementById('topSkillsChart');
  
  if (charts.topSkills) {
    charts.topSkills.destroy();
  }
  
  charts.topSkills = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: skills.map(s => s.name),
      datasets: [{
        label: '다운로드 수',
        data: skills.map(s => s.downloads),
        backgroundColor: skills.map(s => s.downloads > 0 ? '#53bf6b' : '#16213e'),
        borderColor: '#0f3460',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

// ============================================
// Section 3: Agent Growth
// ============================================

function renderAgentGrowth() {
  const { agentGrowth } = dashboardData;
  
  renderProposalChart(agentGrowth.proposalAcceptance);
  renderErrorChart(agentGrowth.errorFrequency);
  renderSkillDevChart(agentGrowth.skillDevelopment);
  renderActionLog(agentGrowth.autonomousActions);
}

function renderProposalChart(data) {
  const ctx = document.getElementById('proposalChart');
  
  if (charts.proposal) {
    charts.proposal.destroy();
  }
  
  charts.proposal = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.week),
      datasets: [{
        label: '채택률 (%)',
        data: data.map(d => d.rate),
        borderColor: '#53bf6b',
        backgroundColor: 'rgba(83, 191, 107, 0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#eee' }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

function renderErrorChart(data) {
  const ctx = document.getElementById('errorChart');
  
  if (charts.error) {
    charts.error.destroy();
  }
  
  charts.error = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.map(d => d.week),
      datasets: [{
        label: '실수 횟수',
        data: data.map(d => d.errors),
        borderColor: '#e94560',
        backgroundColor: 'rgba(233, 69, 96, 0.2)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#eee' }
        }
      },
      scales: {
        y: {
          ticks: { color: '#aaa', stepSize: 2 },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

function renderSkillDevChart(data) {
  const ctx = document.getElementById('skillDevChart');
  
  if (charts.skillDev) {
    charts.skillDev.destroy();
  }
  
  charts.skillDev = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(d => d.week),
      datasets: [{
        label: '신규 스킬 수',
        data: data.map(d => d.newSkills),
        backgroundColor: '#0f3460',
        borderColor: '#53bf6b',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          labels: { color: '#eee' }
        }
      },
      scales: {
        y: {
          ticks: { color: '#aaa', stepSize: 1 },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          ticks: { color: '#aaa' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    }
  });
}

function renderActionLog(actions) {
  const container = document.getElementById('actionLog');
  container.innerHTML = '';
  
  actions.forEach(action => {
    const div = document.createElement('div');
    div.className = `action-item ${action.result === '성공' ? 'success' : 'warning'}`;
    div.innerHTML = `
      <div class="action-item-header">
        <span class="action-timestamp">${action.timestamp}</span>
        <span class="action-result ${action.result === '성공' ? 'success' : 'warning'}">
          ${action.result}
        </span>
      </div>
      <div class="action-description">${action.action}</div>
      <div class="action-impact">💡 ${action.impact}</div>
    `;
    container.appendChild(div);
  });
}

// ============================================
// Section 4: Operations
// ============================================

function renderOperations() {
  const { operations } = dashboardData;
  
  renderCustomerStatus(operations.customerStatus);
  renderSkillHeatmap(operations.skillUsageHeatmap);
  renderEventFeed(operations.recentEvents);
  renderProposalQueue(operations.proactiveQueue);
}

function renderCustomerStatus(customers) {
  const container = document.getElementById('customerStatus');
  container.innerHTML = '';
  
  customers.forEach(customer => {
    const div = document.createElement('div');
    div.className = `customer-card ${customer.status}`;
    div.innerHTML = `
      <div class="customer-card-header">
        <span class="customer-name">${customer.name}</span>
        <span class="customer-status ${customer.status}"></span>
      </div>
      <div class="customer-info">업종: ${customer.industry}</div>
      <div class="customer-info">Uptime: ${customer.agentUptime}%</div>
      <div class="customer-info">최근 활동: ${customer.lastActivity}</div>
    `;
    container.appendChild(div);
  });
}

function renderSkillHeatmap(heatmapData) {
  const container = document.getElementById('skillHeatmap');
  
  // Collect all unique skills
  const allSkills = new Set();
  heatmapData.forEach(row => {
    Object.keys(row.skills).forEach(skill => allSkills.add(skill));
  });
  const skills = Array.from(allSkills);
  
  // Create table
  let html = '<table class="heatmap-table"><thead><tr><th>고객</th>';
  skills.forEach(skill => {
    html += `<th>${skill}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  heatmapData.forEach(row => {
    html += `<tr><td>${row.customer}</td>`;
    skills.forEach(skill => {
      const value = row.skills[skill] || 0;
      const color = getHeatmapColor(value);
      html += `<td class="heatmap-cell" style="background-color: ${color}">${value}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function getHeatmapColor(value) {
  if (value === 0) return 'rgba(15, 52, 96, 0.1)';
  if (value < 15) return 'rgba(15, 52, 96, 0.3)';
  if (value < 30) return 'rgba(15, 52, 96, 0.5)';
  if (value < 45) return 'rgba(83, 191, 107, 0.5)';
  return 'rgba(83, 191, 107, 0.8)';
}

function renderEventFeed(events) {
  const container = document.getElementById('eventFeed');
  container.innerHTML = '';
  
  events.forEach(event => {
    const div = document.createElement('div');
    div.className = `event-item ${event.type}`;
    div.innerHTML = `
      <span class="event-timestamp">${event.timestamp}</span>
      <span class="event-message">${event.message}</span>
    `;
    container.appendChild(div);
  });
}

function renderProposalQueue(proposals) {
  const container = document.getElementById('proposalQueue');
  container.innerHTML = '';
  
  proposals.forEach(proposal => {
    const div = document.createElement('div');
    div.className = `proposal-item ${proposal.priority}`;
    div.innerHTML = `
      <div class="proposal-header">
        <span class="proposal-id">${proposal.id}</span>
        <span class="proposal-priority ${proposal.priority}">${proposal.priority.toUpperCase()}</span>
      </div>
      <div class="proposal-customer">📍 ${proposal.customer}</div>
      <div class="proposal-description">${proposal.proposal}</div>
      <div class="proposal-created">생성: ${proposal.created}</div>
    `;
    container.appendChild(div);
  });
}

// ============================================
// Utility Functions
// ============================================

function formatCurrency(amount) {
  if (amount >= 100000000) {
    return (amount / 100000000).toFixed(1) + '억';
  } else if (amount >= 10000) {
    return (amount / 10000).toFixed(0) + '만';
  }
  return amount.toLocaleString();
}

function updateLastUpdateTime() {
  const now = new Date();
  const formatted = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  document.getElementById('lastUpdate').textContent = formatted;
}

// ============================================
// Auto Refresh (Optional)
// ============================================

// Uncomment to enable auto-refresh every 5 minutes
// setInterval(async () => {
//   await loadData();
//   renderDashboard();
//   updateLastUpdateTime();
// }, 5 * 60 * 1000);

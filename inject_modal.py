import os

filepath = r'D:\Dropbox\_Documents\Goxprint\backend\templates\jobs.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Add CSS
css_to_add = '''
.job-modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: none; justify-content: center; align-items: center;
    z-index: 10000;
}
.job-modal-content {
    background: #fff; border-radius: 8px; width: 800px; max-width: 95%; max-height: 90vh;
    display: flex; flex-direction: column; overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}
.job-modal-header {
    background: #1a1a24; color: #fff; padding: 15px 20px;
    display: flex; justify-content: space-between; align-items: center;
}
.job-modal-title { font-size: 18px; font-weight: bold; margin: 0; }
.job-modal-close {
    background: transparent; color: #aaa; border: none; font-size: 24px; cursor: pointer; padding: 0; line-height: 1; transition: color 0.2s;
}
.job-modal-close:hover { color: #fff; }
.job-modal-body {
    padding: 20px; overflow-y: auto; flex: 1;
}
.job-modal-section { margin-bottom: 20px; }
.job-modal-section-title { font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center; }
.job-modal-pre { background: #f4f4f4; padding: 10px; border-radius: 6px; font-size: 12px; font-family: monospace; white-space: pre-wrap; word-break: break-all; color: #333; margin: 0; max-height: 300px; overflow-y: auto; border: 1px solid #ddd; }
'''

if '.job-modal-overlay' not in content:
    content = content.replace('</style>', css_to_add + '</style>')

# Add HTML
html_to_add = '''
<div id="job-detail-modal" class="job-modal-overlay" onclick="if(event.target===this) window.closeJobModal()">
  <div class="job-modal-content">
    <div class="job-modal-header">
      <h3 class="job-modal-title" id="job-modal-title">Job Details</h3>
      <button class="job-modal-close" onclick="window.closeJobModal()">&times;</button>
    </div>
    <div class="job-modal-body">
      <div class="job-modal-section">
        <div class="job-modal-section-title">General Info</div>
        <table class="generic-table" style="margin: 0; box-shadow: none;">
          <tbody id="job-modal-info-tbody">
          </tbody>
        </table>
      </div>
      <div class="job-modal-section">
        <div class="job-modal-section-title">
          <span>Command Params</span>
          <button onclick="window.copyModalContent('job-modal-params')" style="background: #e0e0e0; color: #111; border: 1px solid #ccc; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">📋 Copy</button>
        </div>
        <pre class="job-modal-pre" id="job-modal-params"></pre>
      </div>
      <div class="job-modal-section" id="job-modal-result-section">
        <div class="job-modal-section-title">
          <span>Command Result</span>
          <button onclick="window.copyModalContent('job-modal-result')" style="background: #e0e0e0; color: #111; border: 1px solid #ccc; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">📋 Copy</button>
        </div>
        <pre class="job-modal-pre" id="job-modal-result"></pre>
      </div>
      <div class="job-modal-section" id="job-modal-error-section">
        <div class="job-modal-section-title" style="color: #d9534f; border-bottom-color: #f5c6cb;">
          <span>Error / Details Log</span>
          <button onclick="window.copyModalContent('job-modal-error')" style="background: #e0e0e0; color: #111; border: 1px solid #ccc; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-size: 10px; font-weight: bold;">📋 Copy</button>
        </div>
        <pre class="job-modal-pre" id="job-modal-error" style="background: #fff5f5; border-color: #f5c6cb;"></pre>
      </div>
    </div>
  </div>
</div>
'''

if 'id="job-detail-modal"' not in content:
    content = content.replace('<div id="custom-toast" class="toast-msg"></div>', html_to_add + '\n<div id="custom-toast" class="toast-msg"></div>')

# Add JS functions globally
js_to_add_global = '''
window.closeJobModal = function() {
    document.getElementById('job-detail-modal').style.display = 'none';
};

window.copyModalContent = function(elId) {
    const el = document.getElementById(elId);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText).then(() => {
        window.showToast('Đã copy nội dung!');
    }).catch(err => console.error(err));
};
'''
if 'window.closeJobModal =' not in content:
    content = content.replace('window.copyJobError = function(id) {', js_to_add_global + '\nwindow.copyJobError = function(id) {')

# Add JS function inside DOMContentLoaded
js_to_add_local = '''
    window.openJobModal = function(id) {
        const row = jobsData.find(j => String(j.id) === String(id));
        if (!row) return;
        
        document.getElementById('job-modal-title').textContent = `Job #${row.id} - ${row.command_type || 'Unknown'}`;
        
        const tbody = document.getElementById('job-modal-info-tbody');
        tbody.innerHTML = `
            <tr><td style="width: 150px; font-weight: bold; padding: 6px 12px; border: 1px solid #eee;">Agent UID</td><td style="padding: 6px 12px; border: 1px solid #eee;"><code>${escapeHtml(row.agent_uid || 'N/A')}</code></td></tr>
            <tr><td style="font-weight: bold; padding: 6px 12px; border: 1px solid #eee;">Printer</td><td style="padding: 6px 12px; border: 1px solid #eee;">${escapeHtml(row.printer_name || '')} (${escapeHtml(row.ip || 'N/A')})</td></tr>
            <tr><td style="font-weight: bold; padding: 6px 12px; border: 1px solid #eee;">Status</td><td style="padding: 6px 12px; border: 1px solid #eee;">
                <span class="status-badge ${row.status === 'success' ? 'status-success' : (row.status === 'pending' ? 'status-pending' : 'status-failed')}">
                    ${escapeHtml((row.status || 'FAILED').toUpperCase())}
                </span>
            </td></tr>
            <tr><td style="font-weight: bold; padding: 6px 12px; border: 1px solid #eee;">Requested At</td><td style="padding: 6px 12px; border: 1px solid #eee;">${escapeHtml(row.requested_at || '')}</td></tr>
            <tr><td style="font-weight: bold; padding: 6px 12px; border: 1px solid #eee;">Responded At</td><td style="padding: 6px 12px; border: 1px solid #eee;">${escapeHtml(row.responded_at || '')}</td></tr>
        `;
        
        const tryFormatJson = (str) => {
            if (!str) return '';
            try {
                const obj = JSON.parse(str);
                return JSON.stringify(obj, null, 2);
            } catch(e) {
                return str;
            }
        };
        
        document.getElementById('job-modal-params').textContent = tryFormatJson(row.command_params);
        
        const resEl = document.getElementById('job-modal-result');
        const resSec = document.getElementById('job-modal-result-section');
        if (row.command_result) {
            resSec.style.display = 'block';
            resEl.textContent = tryFormatJson(row.command_result);
        } else {
            resSec.style.display = 'none';
            resEl.textContent = '';
        }
        
        const errEl = document.getElementById('job-modal-error');
        const errSec = document.getElementById('job-modal-error-section');
        if (row.error_message) {
            errSec.style.display = 'block';
            errEl.textContent = row.error_message;
        } else {
            errSec.style.display = 'none';
            errEl.textContent = '';
        }
        
        document.getElementById('job-detail-modal').style.display = 'flex';
    };
'''

if 'window.openJobModal =' not in content:
    content = content.replace('    let jobsData = [];', '    let jobsData = [];\n' + js_to_add_local)

# Modify tr onclick
if 'tr.style.cursor =' not in content:
    tr_injection = '''            tr.style.cursor = 'pointer';
            tr.onclick = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
                window.openJobModal(row.id);
            };
            tr.innerHTML = `'''
    content = content.replace('            tr.innerHTML = `', tr_injection)

# Add hover effect
if '.generic-table tbody tr:hover' not in content:
    content = content.replace('</style>', '.generic-table tbody tr:hover { background-color: #f0f0f0; }\n</style>')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated locally")

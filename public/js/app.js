// // Karbi Anglong Autonomous Council (KAAC) Meeting Management System - Pure Vanilla JavaScript
// // No React or frontend frameworks used - Pure DOM API, Fetch API, and Event Listeners
//
// const AppState = {
//   currentUser: null,
//   availableUsers: [],
//   departments: [],
//   users: [],
//   chairpersons: [],
//   meetingRooms: [],
//   meetingSchedules: [],
//   summary: null,
//   activeTab: 'overview',
//   springFiles: [],
//   currentViewingFile: null,
//   editingScheduleId: null,
//   editingDepartmentId: null,
//   editingUserId: null,
//   editingRoomId: null
// };
//
// // --- Initialization ---
// document.addEventListener('DOMContentLoaded', async () => {
//   await initSession();
//   await loadAllData();
//   setupEventListeners();
//   loadSpringFilesList();
//   renderCurrentTab();
// });
//
// // --- Session & Current Actor Management ---
// async function initSession() {
//   try {
//     const res = await fetch('/api/auth/current-user');
//     const data = await res.json();
//     AppState.currentUser = data.user;
//     AppState.availableUsers = data.availableUsers;
//     updateSessionUI();
//   } catch (err) {
//     showToast('Failed to initialize user session', 'error');
//   }
// }
//
// function updateSessionUI() {
//   const u = AppState.currentUser;
//  
//   // Update all session panels across the page
//   const headerContainer = document.querySelector('.header-container');
//   if (headerContainer) {
//     const existingPanels = headerContainer.querySelectorAll('.session-panel');
//     const sessionHTML = u ? `
//       <div class="session-panel" style="display: flex; align-items: center; gap: 14px;">
//         <div class="current-user-info" style="text-align: right;">
//           <div style="font-size: 0.72rem; color: #a7f3d0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Active Officer</div>
//           <div class="user-name" id="current-user-name" style="font-weight: 700; font-size: 0.95rem; color: #ffffff;">${u.fullName || u.full_name}</div>
//           <div id="current-user-designation" style="font-size: 0.75rem; color: #cbd5e1; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${u.designation || ''}</div>
//         </div>
//         <span class="role-badge ${(u.role || '').toLowerCase()}" id="current-user-role" style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px;">${u.role}</span>
//         <a href="/logout" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; padding: 5px 10px; background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; text-decoration: none;" title="End Active Session">🚪 Logout</a>
//       </div>
//     ` : `
//       <div class="session-panel" style="display: flex; align-items: center; gap: 12px;">
//         <div style="text-align: right;">
//           <div style="font-size: 0.72rem; color: #fde68a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Public View Mode</div>
//           <div style="font-size: 0.8rem; color: #cbd5e1;">Read-Only Council Registry</div>
//         </div>
//         <a href="/login" class="btn btn-gold" style="font-size: 0.84rem; padding: 7px 14px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">🔐 Officer Login</a>
//       </div>
//     `;
//
//     if (existingPanels.length > 0) {
//       existingPanels.forEach(p => p.remove());
//       headerContainer.insertAdjacentHTML('beforeend', sessionHTML);
//     }
//   }
//
//   const nameEl = document.getElementById('current-user-name');
//   const roleEl = document.getElementById('current-user-role');
//   const desigEl = document.getElementById('current-user-designation');
//   const selectEl = document.getElementById('role-switcher');
//
//   if (u) {
//     if (nameEl) nameEl.textContent = u.fullName || u.full_name;
//     if (desigEl && u.designation) desigEl.textContent = u.designation;
//     if (roleEl) {
//       roleEl.textContent = u.role;
//       roleEl.className = `role-badge ${(u.role || '').toLowerCase()}`;
//     }
//   }
//
//   if (selectEl && AppState.availableUsers.length > 0 && u) {
//     selectEl.innerHTML = AppState.availableUsers.map(user => `
//       <option value="${user.id}" ${user.id === u.id ? 'selected' : ''}>
//         [${user.role}] ${user.fullName} (${user.designation || user.role})
//       </option>
//     `).join('');
//   }
//
//   // Adjust visible tabs and action buttons based on user role
//   adjustRoleVisibility();
// }
//
// function adjustRoleVisibility() {
//   const role = AppState.currentUser?.role || 'STAFF';
//  
//   // Highlight or badge tabs
//   const adminTabBtn = document.getElementById('tab-btn-admin');
//   const staffTabBtn = document.getElementById('tab-btn-staff');
//   const chairTabBtn = document.getElementById('tab-btn-chairperson');
//
//   // Update badges on tabs
//   if (role === 'ADMIN') {
//     if (adminTabBtn) adminTabBtn.style.display = 'inline-flex';
//   } else {
//     // Non-admin can view admin tab in read-only / restricted mode or with authorization notice
//   }
// }
//
// // Switch active user session for live testing and demonstration
// async function handleUserSwitch(userId) {
//   try {
//     const res = await fetch('/api/auth/switch-user', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId })
//     });
//     const data = await res.json();
//     if (data.success) {
//       AppState.currentUser = data.user;
//       updateSessionUI();
//       showToast(`Switched active user to: ${data.user.fullName} (${data.user.role})`, 'success');
//       await loadAllData();
//       renderCurrentTab();
//     }
//   } catch (err) {
//     showToast('Error switching user session', 'error');
//   }
// }
//
// // --- Data Fetching ---
// async function loadAllData() {
//   try {
//     const [deptRes, userRes, chairRes, roomRes, schedRes, sumRes] = await Promise.all([
//       fetch('/api/departments'),
//       fetch('/api/users'),
//       fetch('/api/chairpersons'),
//       fetch('/api/meeting-rooms'),
//       fetch('/api/meeting-schedules'),
//       fetch('/api/summary')
//     ]);
//
//     AppState.departments = await deptRes.json();
//     AppState.users = await userRes.json();
//     AppState.chairpersons = await chairRes.json();
//     AppState.meetingRooms = await roomRes.json();
//     AppState.meetingSchedules = await schedRes.json();
//     const sumData = await sumRes.json();
//     AppState.summary = sumData.summary;
//
//     updateTabCounters();
//   } catch (err) {
//     console.error('Data load error:', err);
//   }
// }
//
// function updateTabCounters() {
//   const totalMeetings = AppState.meetingSchedules.length;
//   const counterTotal = document.getElementById('cnt-total-meetings');
//   if (counterTotal) counterTotal.textContent = totalMeetings;
//
//   if (AppState.currentUser) {
//     const userId = AppState.currentUser.id;
//     const handled = AppState.meetingSchedules.filter(m => m.createdById === userId).length;
//     const chaired = AppState.meetingSchedules.filter(m => m.chairpersonId === userId).length;
//
//     const cntStaff = document.getElementById('cnt-staff-handling');
//     if (cntStaff) cntStaff.textContent = handled;
//
//     const cntChair = document.getElementById('cnt-chairperson-meetings');
//     if (cntChair) cntChair.textContent = chaired;
//   }
// }
//
// // --- Tab Navigation ---
// function switchTab(tabName) {
//   AppState.activeTab = tabName;
//  
//   document.querySelectorAll('.nav-btn').forEach(btn => {
//     btn.classList.toggle('active', btn.dataset.tab === tabName);
//   });
//
//   document.querySelectorAll('.tab-pane').forEach(pane => {
//     pane.classList.toggle('active', pane.id === `tab-${tabName}`);
//   });
//
//   renderCurrentTab();
// }
//
// function renderCurrentTab() {
//   switch (AppState.activeTab) {
//     case 'overview':
//       renderOverviewTab();
//       break;
//     case 'staff':
//       renderStaffDashboard();
//       break;
//     case 'chairperson':
//       renderChairpersonDashboard();
//       break;
//     case 'admin':
//       renderAdminConsole();
//       break;
//     case 'h2-console':
//       renderH2Console();
//       break;
//     case 'spring-code':
//       renderSpringCodeExplorer();
//       break;
//   }
// }
//
// // --- TAB 1: EXECUTIVE OVERVIEW ---
// function renderOverviewTab() {
//   const container = document.getElementById('overview-meetings-list');
//   if (!container) return;
//
//   // Render Metric Cards
//   if (AppState.summary) {
//     document.getElementById('metric-total-meetings').textContent = AppState.summary.totalMeetings;
//     document.getElementById('metric-active-meetings').textContent = AppState.summary.activeMeetings;
//     document.getElementById('metric-total-rooms').textContent = AppState.summary.totalMeetingRooms;
//     document.getElementById('metric-total-depts').textContent = AppState.summary.totalDepartments;
//   }
//
//   const list = AppState.meetingSchedules;
//   if (list.length === 0) {
//     container.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 30px; color: #64748b;">No scheduled council meetings found. Click "Schedule New Council Meeting" to create one.</td></tr>`;
//     return;
//   }
//
//   container.innerHTML = list.map(m => {
//     const isOwner = AppState.currentUser?.id === m.createdById;
//     const isAdmin = AppState.currentUser?.role === 'ADMIN';
//     const canEdit = isAdmin || isOwner;
//
//     return `
//       <tr>
//         <td>
//           <span class="status-pill ${m.status}">${m.status}</span>
//           ${m.priority === 'URGENT' ? '<span class="priority-tag URGENT" style="margin-left: 4px;">URGENT</span>' : ''}
//         </td>
//         <td>
//           <div class="title-col">${escapeHtml(m.title)}</div>
//           <span class="sub-text">🏛️ ${escapeHtml(m.departmentName || 'General')}</span>
//         </td>
//         <td>
//           <div style="font-weight: 600;">📅 ${formatDate(m.meetingDate)}</div>
//           <span class="sub-text">⏰ ${m.startTime} - ${m.endTime}</span>
//         </td>
//         <td>
//           <div style="font-weight: 600;">📍 ${escapeHtml(m.meetingRoomNumber || '')}</div>
//           <span class="sub-text">${escapeHtml(m.meetingRoomName || '')}</span>
//         </td>
//         <td>
//           <div style="font-weight: 700; color: #b45309;">👑 ${escapeHtml(m.chairpersonName || 'Council Member')}</div>
//           <span class="sub-text">Designated Chairperson</span>
//         </td>
//         <td>
//           <div style="font-weight: 500;">👤 ${escapeHtml(m.createdByName || 'Officer')}</div>
//           <span class="sub-text">[${m.createdByRole || 'STAFF'}]</span>
//         </td>
//         <td style="text-align: right;">
//           <div style="display: inline-flex; gap: 4px;">
//             <button class="btn btn-secondary btn-sm" onclick="viewMeetingDetails(${m.id})" title="View Agenda & Details">👁️ View</button>
//             <button class="btn btn-gold btn-sm" onclick="printMeetingNotice(${m.id})" title="Generate Official Council Notice">📄 Notice</button>
//             ${canEdit ? `
//               <button class="btn btn-secondary btn-sm" onclick="openEditMeetingModal(${m.id})" title="Edit Schedule">✏️</button>
//               <button class="btn btn-danger btn-sm" onclick="deleteMeeting(${m.id})" title="Cancel/Delete Meeting">🗑️</button>
//             ` : `
//               <span style="font-size: 0.75rem; color: #94a3b8; padding: 4px;" title="Only the creator (${m.createdByName}) or Admin can edit this meeting">🔒</span>
//             `}
//           </div>
//         </td>
//       </tr>
//     `;
//   }).join('');
// }
//
// // --- TAB 2: DEDICATED STAFF DASHBOARD ---
// async function renderStaffDashboard() {
//   const u = AppState.currentUser;
//   if (!u) return;
//
//   const targetUserId = u.id;
//   try {
//     const res = await fetch(`/api/staff/dashboard?userId=${targetUserId}`);
//     const data = await res.json();
//
//     document.getElementById('staff-name-title').textContent = u.fullName;
//     document.getElementById('staff-designation-dept').textContent = `${u.designation || 'Staff Officer'} | ${u.departmentName || 'General Administration'}`;
//
//     document.getElementById('staff-stat-handling').textContent = data.totalHandlingCount;
//     document.getElementById('staff-stat-upcoming').textContent = data.upcomingCount;
//     document.getElementById('staff-stat-inprogress').textContent = data.inProgressCount;
//     document.getElementById('staff-stat-completed').textContent = data.completedCount;
//
//     // Render Meetings Handled Table
//     const handledContainer = document.getElementById('staff-handled-meetings-list');
//     if (handledContainer) {
//       if (data.handlingMeetings.length === 0) {
//         handledContainer.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">You are not managing any meetings yet. Click "Schedule New Meeting" to create one.</td></tr>`;
//       } else {
//         handledContainer.innerHTML = data.handlingMeetings.map(m => `
//           <tr>
//             <td><span class="status-pill ${m.status}">${m.status}</span></td>
//             <td>
//               <div class="title-col">${escapeHtml(m.title)}</div>
//               <span class="sub-text">🏛️ ${escapeHtml(m.departmentName)}</span>
//             </td>
//             <td>
//               <div style="font-weight: 600;">📅 ${formatDate(m.meetingDate)}</div>
//               <span class="sub-text">⏰ ${m.startTime} - ${m.endTime}</span>
//             </td>
//             <td>
//               <div style="font-weight: 600;">📍 ${escapeHtml(m.meetingRoomNumber)}</div>
//               <span class="sub-text">${escapeHtml(m.meetingRoomName)}</span>
//             </td>
//             <td>
//               <div style="font-weight: 700; color: #b45309;">👑 ${escapeHtml(m.chairpersonName)}</div>
//             </td>
//             <td style="text-align: right;">
//               <div style="display: inline-flex; gap: 4px;">
//                 <button class="btn btn-secondary btn-sm" onclick="openStatusUpdateModal(${m.id})">⚙️ Manage</button>
//                 <button class="btn btn-gold btn-sm" onclick="printMeetingNotice(${m.id})">📄 Notice</button>
//                 <button class="btn btn-secondary btn-sm" onclick="openEditMeetingModal(${m.id})">✏️</button>
//                 <button class="btn btn-danger btn-sm" onclick="deleteMeeting(${m.id})">🗑️</button>
//               </div>
//             </td>
//           </tr>
//         `).join('');
//       }
//     }
//
//     // Populate selects in Staff Conflict Checker tool
//     populateConflictToolSelects();
//
//   } catch (err) {
//     showToast('Failed to load staff dashboard', 'error');
//   }
// }
//
// function populateConflictToolSelects() {
//   const roomSelect = document.getElementById('check-conflict-room');
//   const chairSelect = document.getElementById('check-conflict-chair');
//
//   if (roomSelect && AppState.meetingRooms.length > 0) {
//     roomSelect.innerHTML = AppState.meetingRooms.map(r => `
//       <option value="${r.id}">${r.roomNumber} - ${r.name} (Cap: ${r.capacity})</option>
//     `).join('');
//   }
//
//   if (chairSelect && AppState.chairpersons.length > 0) {
//     chairSelect.innerHTML = AppState.chairpersons.map(c => `
//       <option value="${c.id}">${c.fullName} (${c.designation})</option>
//     `).join('');
//   }
// }
//
// // Standalone Conflict Check trigger from Staff Dashboard
// async function runStandaloneConflictCheck() {
//   const date = document.getElementById('check-conflict-date').value;
//   const start = document.getElementById('check-conflict-start').value;
//   const end = document.getElementById('check-conflict-end').value;
//   const roomId = document.getElementById('check-conflict-room').value;
//   const chairId = document.getElementById('check-conflict-chair').value;
//
//   if (!date || !start || !end || !roomId || !chairId) {
//     showToast('Please fill in all fields (Date, Start Time, End Time, Room, Chairperson) to check conflict.', 'warning');
//     return;
//   }
//
//   try {
//     const res = await fetch('/api/conflict-check', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         meetingDate: date,
//         startTime: start,
//         endTime: end,
//         meetingRoomId: Number(roomId),
//         chairpersonId: Number(chairId)
//       })
//     });
//     const result = await res.json();
//    
//     const banner = document.getElementById('standalone-conflict-result');
//     if (banner) {
//       banner.style.display = 'flex';
//       if (result.hasConflict) {
//         banner.className = 'conflict-box error';
//         banner.innerHTML = `
//           <div class="conflict-icon">⚠️</div>
//           <div class="conflict-content">
//             <h4 style="color: #b91c1c;">Scheduling Conflict Detected!</h4>
//             <p>${escapeHtml(result.reason)}</p>
//           </div>
//         `;
//       } else {
//         banner.className = 'conflict-box clean';
//         banner.innerHTML = `
//           <div class="conflict-icon">✅</div>
//           <div class="conflict-content">
//             <h4 style="color: #15803d;">Slot is Completely Available</h4>
//             <p>${escapeHtml(result.reason)} You can safely schedule your Council meeting.</p>
//           </div>
//         `;
//       }
//     }
//   } catch (err) {
//     showToast('Conflict check failed', 'error');
//   }
// }
//
// // --- TAB 3: DEDICATED CHAIRPERSON DASHBOARD ---
// async function renderChairpersonDashboard() {
//   const u = AppState.currentUser;
//   if (!u) return;
//
//   try {
//     const res = await fetch(`/api/chairperson/dashboard?userId=${u.id}`);
//     const data = await res.json();
//
//     document.getElementById('chair-name-title').textContent = u.fullName;
//     document.getElementById('chair-designation-dept').textContent = `${u.designation || 'Council Chairperson'} | ${u.departmentName || 'Autonomous Council'}`;
//
//     document.getElementById('chair-stat-total').textContent = data.totalChairingCount;
//     document.getElementById('chair-stat-upcoming').textContent = data.upcomingCount;
//     document.getElementById('chair-stat-completed').textContent = data.completedCount;
//     document.getElementById('chair-stat-created').textContent = data.createdCount;
//
//     const listContainer = document.getElementById('chair-presiding-meetings-list');
//     if (listContainer) {
//       if (data.chairingMeetings.length === 0) {
//         listContainer.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 24px; color: #64748b;">No meetings currently assigned to you as Chairperson.</td></tr>`;
//       } else {
//         listContainer.innerHTML = data.chairingMeetings.map(m => {
//           const isCreator = m.createdById === u.id;
//           const isAdmin = u.role === 'ADMIN';
//           return `
//             <tr>
//               <td><span class="status-pill ${m.status}">${m.status}</span></td>
//               <td>
//                 <div class="title-col">${escapeHtml(m.title)}</div>
//                 <span class="sub-text">🏛️ Dept: ${escapeHtml(m.departmentName)}</span>
//               </td>
//               <td>
//                 <div style="font-weight: 600;">📅 ${formatDate(m.meetingDate)}</div>
//                 <span class="sub-text">⏰ ${m.startTime} - ${m.endTime}</span>
//               </td>
//               <td>
//                 <div style="font-weight: 600;">📍 ${escapeHtml(m.meetingRoomNumber)}</div>
//                 <span class="sub-text">${escapeHtml(m.meetingRoomName)}</span>
//               </td>
//               <td>
//                 <div style="font-weight: 500;">👤 ${escapeHtml(m.createdByName)}</div>
//                 <span class="sub-text">Coordinator</span>
//               </td>
//               <td style="text-align: right;">
//                 <div style="display: inline-flex; gap: 4px;">
//                   <button class="btn btn-secondary btn-sm" onclick="viewMeetingDetails(${m.id})">📋 Review Agenda</button>
//                   <button class="btn btn-gold btn-sm" onclick="printMeetingNotice(${m.id})">📄 Notice</button>
//                   ${(isCreator || isAdmin) ? `
//                     <button class="btn btn-secondary btn-sm" onclick="openEditMeetingModal(${m.id})">✏️</button>
//                     <button class="btn btn-danger btn-sm" onclick="deleteMeeting(${m.id})">🗑️</button>
//                   ` : ''}
//                 </div>
//               </td>
//             </tr>
//           `;
//         }).join('');
//       }
//     }
//   } catch (err) {
//     showToast('Failed to load chairperson portal', 'error');
//   }
// }
//
// // --- TAB 4: ADMIN CONSOLE ---
// function renderAdminConsole() {
//   const role = AppState.currentUser?.role;
//   const adminAlert = document.getElementById('admin-role-warning');
//   if (adminAlert) {
//     if (role !== 'ADMIN') {
//       adminAlert.style.display = 'flex';
//       adminAlert.innerHTML = `
//         <div class="conflict-icon">🔒</div>
//         <div class="conflict-content">
//           <h4 style="color: #c2410c;">Read-Only Mode for ${role}</h4>
//           <p>Only <strong>ADMIN</strong> users can create, update, or delete Departments, Users, and Meeting Rooms. You can switch to an Admin user in the top bar to test modifications.</p>
//         </div>
//       `;
//     } else {
//       adminAlert.style.display = 'none';
//     }
//   }
//
//   renderAdminDepartments();
//   renderAdminUsers();
//   renderAdminRooms();
// }
//
// function renderAdminDepartments() {
//   const container = document.getElementById('admin-dept-list');
//   if (!container) return;
//   const isAdmin = AppState.currentUser?.role === 'ADMIN';
//
//   container.innerHTML = AppState.departments.map(d => `
//     <tr>
//       <td><span style="font-weight: 700; color: #0f5132; background: #e8f5e9; padding: 2px 8px; border-radius: 4px;">${escapeHtml(d.code)}</span></td>
//       <td>
//         <div class="title-col">${escapeHtml(d.name)}</div>
//         <span class="sub-text">${escapeHtml(d.description || '')}</span>
//       </td>
//       <td>${escapeHtml(d.hodName || 'Not Assigned')}</td>
//       <td>
//         <div>📧 ${escapeHtml(d.contactEmail || '-')}</div>
//         <span class="sub-text">📞 ${escapeHtml(d.phone || '-')}</span>
//       </td>
//       <td style="text-align: right;">
//         ${isAdmin ? `
//           <button class="btn btn-secondary btn-sm" onclick="openEditDepartmentModal(${d.id})">✏️ Edit</button>
//           <button class="btn btn-danger btn-sm" onclick="deleteDepartment(${d.id})">🗑️ Delete</button>
//         ` : `<span style="color: #94a3b8; font-size: 0.8rem;">Admin Only</span>`}
//       </td>
//     </tr>
//   `).join('');
// }
//
// function renderAdminUsers() {
//   const container = document.getElementById('admin-user-list');
//   if (!container) return;
//   const isAdmin = AppState.currentUser?.role === 'ADMIN';
//
//   container.innerHTML = AppState.users.map(u => `
//     <tr>
//       <td>
//         <div style="font-weight: 700;">${escapeHtml(u.fullName)}</div>
//         <span class="sub-text">@${escapeHtml(u.username)}</span>
//       </td>
//       <td><span class="role-badge ${u.role.toLowerCase()}">${u.role}</span></td>
//       <td>
//         <div>${escapeHtml(u.designation || '-')}</div>
//         <span class="sub-text">🏛️ ${escapeHtml(u.departmentName || 'General')}</span>
//       </td>
//       <td>
//         <div>📧 ${escapeHtml(u.email)}</div>
//         <span class="sub-text">📞 ${escapeHtml(u.phone || '-')}</span>
//       </td>
//       <td><span style="color: ${u.status === 'ACTIVE' ? '#15803d' : '#991b1b'}; font-weight: 700;">${u.status}</span></td>
//       <td style="text-align: right;">
//         ${isAdmin ? `
//           <button class="btn btn-secondary btn-sm" onclick="openEditUserModal(${u.id})">✏️ Edit</button>
//           <button class="btn btn-danger btn-sm" onclick="deleteUser(${u.id})">🗑️ Delete</button>
//         ` : `<span style="color: #94a3b8; font-size: 0.8rem;">Admin Only</span>`}
//       </td>
//     </tr>
//   `).join('');
// }
//
// function renderAdminRooms() {
//   const container = document.getElementById('admin-room-list');
//   if (!container) return;
//   const isAdmin = AppState.currentUser?.role === 'ADMIN';
//
//   container.innerHTML = AppState.meetingRooms.map(r => `
//     <tr>
//       <td><span style="font-weight: 700; color: #1e40af; background: #dbeafe; padding: 2px 8px; border-radius: 4px;">${escapeHtml(r.roomNumber)}</span></td>
//       <td>
//         <div class="title-col">${escapeHtml(r.name)}</div>
//         <span class="sub-text">📍 ${escapeHtml(r.location)}</span>
//       </td>
//       <td><span style="font-weight: 700; font-size: 1rem;">👥 ${r.capacity}</span></td>
//       <td>
//         <div style="display: flex; flex-wrap: wrap; gap: 4px;">
//           ${(r.facilities || []).map(f => `<span style="background: #f1f5f9; border: 1px solid #cbd5e1; font-size: 0.72rem; padding: 2px 6px; border-radius: 3px;">${escapeHtml(f)}</span>`).join('')}
//         </div>
//       </td>
//       <td><span class="status-pill ${r.status === 'AVAILABLE' ? 'COMPLETED' : 'IN_PROGRESS'}">${r.status}</span></td>
//       <td style="text-align: right;">
//         ${isAdmin ? `
//           <button class="btn btn-secondary btn-sm" onclick="openEditRoomModal(${r.id})">✏️ Edit</button>
//           <button class="btn btn-danger btn-sm" onclick="deleteRoom(${r.id})">🗑️ Delete</button>
//         ` : `<span style="color: #94a3b8; font-size: 0.8rem;">Admin Only</span>`}
//       </td>
//     </tr>
//   `).join('');
// }
//
// // --- TAB 5: H2 DATABASE WEB CONSOLE SIMULATOR ---
// function renderH2Console() {
//   // Setup query presets
//   const editor = document.getElementById('h2-sql-input');
//   if (editor && !editor.value) {
//     editor.value = `SELECT * FROM MEETING_SCHEDULE;`;
//   }
// }
//
// function setSqlSample(query) {
//   const editor = document.getElementById('h2-sql-input');
//   if (editor) {
//     editor.value = query;
//     executeH2Sql();
//   }
// }
//
// async function executeH2Sql() {
//   const editor = document.getElementById('h2-sql-input');
//   const query = editor?.value?.trim();
//   if (!query) {
//     showToast('Please type a SQL query to execute in H2 database.', 'warning');
//     return;
//   }
//
//   const resultBox = document.getElementById('h2-query-results');
//   if (resultBox) {
//     resultBox.innerHTML = '<div style="padding: 20px; color: #64748b;">Executing in H2 In-Memory Database...</div>';
//   }
//
//   try {
//     const res = await fetch('/api/h2-console/execute', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ query })
//     });
//     const data = await res.json();
//
//     if (data.error) {
//       resultBox.innerHTML = `
//         <div class="conflict-box error" style="margin: 16px 0;">
//           <div class="conflict-icon">⚠️</div>
//           <div class="conflict-content">
//             <h4 style="color: #b91c1c;">H2 Database SQL Error</h4>
//             <p>${escapeHtml(data.error)}</p>
//           </div>
//         </div>
//       `;
//       return;
//     }
//
//     // Render SQL Results Table
//     let tableHtml = `
//       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 0.825rem; color: #64748b;">
//         <span><strong>${data.rowCount}</strong> rows returned in <strong>${data.executionTimeMs} ms</strong></span>
//         <span>JDBC URL: <code>jdbc:h2:mem:kaac_meetings_db</code></span>
//       </div>
//       <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
//         <table class="council-table" style="font-family: monospace; font-size: 0.825rem;">
//           <thead>
//             <tr>${data.columns.map(c => `<th>${escapeHtml(c)}</th>`).join('')}</tr>
//           </thead>
//           <tbody>
//             ${data.rows.map(row => `
//               <tr>${row.map(cell => `<td>${escapeHtml(String(cell !== null && cell !== undefined ? cell : 'NULL'))}</td>`).join('')}</tr>
//             `).join('')}
//           </tbody>
//         </table>
//       </div>
//     `;
//
//     resultBox.innerHTML = tableHtml;
//   } catch (err) {
//     showToast('SQL Execution Error', 'error');
//   }
// }
//
// // --- TAB 6: SPRING MVC CODE EXPLORER & PROJECT ZIP ---
// async function loadSpringFilesList() {
//   try {
//     const res = await fetch('/api/spring-project/files');
//     AppState.springFiles = await res.json();
//     if (AppState.springFiles.length > 0) {
//       AppState.currentViewingFile = AppState.springFiles[0];
//     }
//   } catch (err) {
//     console.error('Error loading Spring MVC file tree:', err);
//   }
// }
//
// function renderSpringCodeExplorer() {
//   const treeContainer = document.getElementById('spring-file-tree');
//   if (!treeContainer || AppState.springFiles.length === 0) return;
//
//   const categories = {
//     'config': '⚙️ Configuration & Boot',
//     'entity': '🏛️ JPA Entities & Models',
//     'repository': '🗄️ Spring Data Repositories',
//     'service': '⚡ Business Services',
//     'controller': '🌐 Spring MVC Controllers',
//     'sql': '💾 H2 Database DDL / Seeds'
//   };
//
//   let html = '';
//   for (const [catKey, catLabel] of Object.entries(categories)) {
//     const catFiles = AppState.springFiles.filter(f => f.category === catKey);
//     if (catFiles.length > 0) {
//       html += `<div class="file-tree-category">${catLabel}</div>`;
//       catFiles.forEach(f => {
//         const isAct = AppState.currentViewingFile?.filename === f.filename;
//         html += `
//           <div class="file-tree-item ${isAct ? 'active' : ''}" onclick="selectSpringFile('${f.filename}')">
//             <span>📄</span> ${escapeHtml(f.filename)}
//           </div>
//         `;
//       });
//     }
//   }
//
//   treeContainer.innerHTML = html;
//   displaySelectedSpringFile();
// }
//
// function selectSpringFile(filename) {
//   const file = AppState.springFiles.find(f => f.filename === filename);
//   if (file) {
//     AppState.currentViewingFile = file;
//     renderSpringCodeExplorer();
//   }
// }
//
// function displaySelectedSpringFile() {
//   const f = AppState.currentViewingFile;
//   if (!f) return;
//
//   const titleEl = document.getElementById('spring-code-filename');
//   const descEl = document.getElementById('spring-code-desc');
//   const contentEl = document.getElementById('spring-code-content');
//
//   if (titleEl) titleEl.textContent = f.path;
//   if (descEl) descEl.textContent = f.description;
//   if (contentEl) contentEl.textContent = f.content;
// }
//
// function copySpringCode() {
//   const f = AppState.currentViewingFile;
//   if (!f) return;
//   navigator.clipboard.writeText(f.content).then(() => {
//     showToast(`Copied ${f.filename} to clipboard!`, 'success');
//   });
// }
//
// function downloadSpringZip() {
//   showToast('Preparing Spring Boot Maven project ZIP archive...', 'success');
//   window.location.href = '/api/spring-project/download';
// }
//
// // --- MEETING SCHEDULE MODAL & REAL-TIME CONFLICT ENGINE ---
// function openCreateMeetingModal() {
//   AppState.editingScheduleId = null;
//   document.getElementById('meeting-modal-title').textContent = 'Schedule New Council Meeting';
//   document.getElementById('meeting-form').reset();
//  
//   // Populate dropdowns
//   populateMeetingFormOptions();
//
//   // Set default date to tomorrow and time
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const dateStr = tomorrow.toISOString().split('T')[0];
//   document.getElementById('form-meeting-date').value = dateStr;
//   document.getElementById('form-meeting-start').value = '10:00';
//   document.getElementById('form-meeting-end').value = '12:00';
//
//   hideLiveConflictBanner();
//   openModal('modal-meeting-schedule');
//   triggerLiveMeetingConflictCheck();
// }
//
// function populateMeetingFormOptions() {
//   const deptSelect = document.getElementById('form-meeting-dept');
//   const roomSelect = document.getElementById('form-meeting-room');
//   const chairSelect = document.getElementById('form-meeting-chairperson');
//
//   if (deptSelect) {
//     deptSelect.innerHTML = '<option value="">-- Select Council Department --</option>' + AppState.departments.map(d => `
//       <option value="${d.id}">${escapeHtml(d.name)} (${d.code})</option>
//     `).join('');
//   }
//
//   if (roomSelect) {
//     roomSelect.innerHTML = '<option value="">-- Select Secretariat Conference Hall --</option>' + AppState.meetingRooms.map(r => `
//       <option value="${r.id}">[${r.roomNumber}] ${r.name} (Cap: ${r.capacity})</option>
//     `).join('');
//   }
//
//   if (chairSelect) {
//     // MANDATORY: Any one creating any meeting must select one chair person!
//     chairSelect.innerHTML = '<option value="">-- Select Designated Chairperson (Mandatory) --</option>' + AppState.chairpersons.map(c => `
//       <option value="${c.id}">👑 ${c.fullName} - ${c.designation}</option>
//     `).join('');
//   }
// }
//
// function openEditMeetingModal(id) {
//   const m = AppState.meetingSchedules.find(x => x.id === id);
//   if (!m) return;
//
//   const actor = AppState.currentUser;
//   if (actor.role !== 'ADMIN' && m.createdById !== actor.id) {
//     showToast('Authorization Denied: You can only edit meetings created by you.', 'error');
//     return;
//   }
//
//   AppState.editingScheduleId = id;
//   document.getElementById('meeting-modal-title').textContent = `Edit Meeting: ${m.title}`;
//   populateMeetingFormOptions();
//
//   document.getElementById('form-meeting-title').value = m.title;
//   document.getElementById('form-meeting-agenda').value = m.agenda || '';
//   document.getElementById('form-meeting-date').value = m.meetingDate;
//   document.getElementById('form-meeting-start').value = m.startTime;
//   document.getElementById('form-meeting-end').value = m.endTime;
//   document.getElementById('form-meeting-dept').value = m.departmentId;
//   document.getElementById('form-meeting-room').value = m.meetingRoomId;
//   document.getElementById('form-meeting-chairperson').value = m.chairpersonId;
//   document.getElementById('form-meeting-priority').value = m.priority || 'NORMAL';
//   document.getElementById('form-meeting-attendees').value = m.attendees || '';
//   document.getElementById('form-meeting-minutes').value = m.minutesOfMeeting || '';
//
//   hideLiveConflictBanner();
//   openModal('modal-meeting-schedule');
//   triggerLiveMeetingConflictCheck();
// }
//
// async function triggerLiveMeetingConflictCheck() {
//   const date = document.getElementById('form-meeting-date')?.value;
//   const start = document.getElementById('form-meeting-start')?.value;
//   const end = document.getElementById('form-meeting-end')?.value;
//   const roomId = document.getElementById('form-meeting-room')?.value;
//   const chairId = document.getElementById('form-meeting-chairperson')?.value;
//   const banner = document.getElementById('form-live-conflict-banner');
//
//   if (!date || !start || !end || !roomId || !chairId) {
//     if (banner) banner.style.display = 'none';
//     return;
//   }
//
//   try {
//     const res = await fetch('/api/conflict-check', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         meetingDate: date,
//         startTime: start,
//         endTime: end,
//         meetingRoomId: Number(roomId),
//         chairpersonId: Number(chairId),
//         excludeScheduleId: AppState.editingScheduleId || undefined
//       })
//     });
//     const result = await res.json();
//
//     if (banner) {
//       banner.style.display = 'flex';
//       if (result.hasConflict) {
//         banner.className = 'conflict-box error';
//         banner.innerHTML = `
//           <div class="conflict-icon">⚠️</div>
//           <div class="conflict-content">
//             <h4 style="color: #b91c1c;">Scheduling Conflict Detected!</h4>
//             <p>${escapeHtml(result.reason)}</p>
//           </div>
//         `;
//       } else {
//         banner.className = 'conflict-box clean';
//         banner.innerHTML = `
//           <div class="conflict-icon">✅</div>
//           <div class="conflict-content">
//             <h4 style="color: #15803d;">Slot Available</h4>
//             <p>${escapeHtml(result.reason)}</p>
//           </div>
//         `;
//       }
//     }
//   } catch (err) {
//     console.error('Live conflict check error:', err);
//   }
// }
//
// function hideLiveConflictBanner() {
//   const banner = document.getElementById('form-live-conflict-banner');
//   if (banner) banner.style.display = 'none';
// }
//
// async function saveMeetingSchedule(e) {
//   e.preventDefault();
//
//   const title = document.getElementById('form-meeting-title').value.trim();
//   const agenda = document.getElementById('form-meeting-agenda').value.trim();
//   const meetingDate = document.getElementById('form-meeting-date').value;
//   const startTime = document.getElementById('form-meeting-start').value;
//   const endTime = document.getElementById('form-meeting-end').value;
//   const departmentId = document.getElementById('form-meeting-dept').value;
//   const meetingRoomId = document.getElementById('form-meeting-room').value;
//   const chairpersonId = document.getElementById('form-meeting-chairperson').value;
//   const priority = document.getElementById('form-meeting-priority').value;
//   const attendees = document.getElementById('form-meeting-attendees').value.trim();
//   const minutesOfMeeting = document.getElementById('form-meeting-minutes').value.trim();
//
//   if (!title || !meetingDate || !startTime || !endTime || !departmentId || !meetingRoomId || !chairpersonId) {
//     showToast('Please fill all mandatory fields, including selecting a designated Chairperson.', 'warning');
//     return;
//   }
//
//   const payload = {
//     title,
//     agenda,
//     meetingDate,
//     startTime,
//     endTime,
//     departmentId: Number(departmentId),
//     meetingRoomId: Number(meetingRoomId),
//     chairpersonId: Number(chairpersonId),
//     priority,
//     attendees,
//     minutesOfMeeting
//   };
//
//   try {
//     let res;
//     if (AppState.editingScheduleId) {
//       res = await fetch(`/api/meeting-schedules/${AppState.editingScheduleId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     } else {
//       res = await fetch('/api/meeting-schedules', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     }
//
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to save meeting schedule', 'error');
//       return;
//     }
//
//     showToast(AppState.editingScheduleId ? 'Meeting updated successfully!' : 'Meeting scheduled successfully!', 'success');
//     closeModal('modal-meeting-schedule');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Network error while saving meeting', 'error');
//   }
// }
//
// async function deleteMeeting(id) {
//   const m = AppState.meetingSchedules.find(x => x.id === id);
//   if (!m) return;
//
//   const actor = AppState.currentUser;
//   if (actor.role !== 'ADMIN' && m.createdById !== actor.id) {
//     showToast('Authorization Denied: You can only delete meeting schedules created by you.', 'error');
//     return;
//   }
//
//   if (!confirm(`Are you sure you want to cancel and delete the meeting: "${m.title}"?`)) {
//     return;
//   }
//
//   try {
//     const res = await fetch(`/api/meeting-schedules/${id}`, { method: 'DELETE' });
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to delete meeting', 'error');
//       return;
//     }
//     showToast('Meeting removed successfully.', 'success');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to delete meeting schedule', 'error');
//   }
// }
//
// // --- MEETING STATUS & MINUTES MANAGEMENT MODAL ---
// function openStatusUpdateModal(id) {
//   const m = AppState.meetingSchedules.find(x => x.id === id);
//   if (!m) return;
//
//   AppState.editingScheduleId = id;
//   document.getElementById('status-manage-title').textContent = m.title;
//   document.getElementById('status-manage-status').value = m.status;
//   document.getElementById('status-manage-minutes').value = m.minutesOfMeeting || '';
//   document.getElementById('status-manage-attendees').value = m.attendees || '';
//   openModal('modal-status-manage');
// }
//
// async function saveStatusUpdate(e) {
//   e.preventDefault();
//   if (!AppState.editingScheduleId) return;
//
//   const status = document.getElementById('status-manage-status').value;
//   const minutesOfMeeting = document.getElementById('status-manage-minutes').value.trim();
//   const attendees = document.getElementById('status-manage-attendees').value.trim();
//
//   try {
//     const res = await fetch(`/api/meeting-schedules/${AppState.editingScheduleId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status, minutesOfMeeting, attendees })
//     });
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to update status', 'error');
//       return;
//     }
//     showToast('Meeting status & minutes updated successfully!', 'success');
//     closeModal('modal-status-manage');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to update status', 'error');
//   }
// }
//
// // --- MEETING DETAILS & AGENDA MODAL ---
// function viewMeetingDetails(id) {
//   const m = AppState.meetingSchedules.find(x => x.id === id);
//   if (!m) return;
//
//   document.getElementById('details-title').textContent = m.title;
//   document.getElementById('details-status-badge').innerHTML = `<span class="status-pill ${m.status}">${m.status}</span>`;
//   document.getElementById('details-date-time').textContent = `📅 ${formatDate(m.meetingDate)} | ⏰ ${m.startTime} - ${m.endTime}`;
//   document.getElementById('details-room').textContent = `📍 [${m.meetingRoomNumber}] ${m.meetingRoomName}`;
//   document.getElementById('details-chairperson').textContent = `👑 ${m.chairpersonName} (Designated Chairperson)`;
//   document.getElementById('details-dept').textContent = `🏛️ ${m.departmentName}`;
//   document.getElementById('details-creator').textContent = `👤 ${m.createdByName} [${m.createdByRole}]`;
//   document.getElementById('details-agenda').textContent = m.agenda || 'No detailed agenda provided.';
//   document.getElementById('details-attendees').textContent = m.attendees || 'General council members and invitees.';
//   document.getElementById('details-minutes').textContent = m.minutesOfMeeting || 'Meeting minutes have not been recorded yet.';
//
//   document.getElementById('btn-details-print-notice').onclick = () => {
//     closeModal('modal-meeting-details');
//     printMeetingNotice(id);
//   };
//
//   openModal('modal-meeting-details');
// }
//
// // --- PRINTABLE COUNCIL MEETING NOTICE ---
// function printMeetingNotice(id) {
//   const m = AppState.meetingSchedules.find(x => x.id === id);
//   if (!m) return;
//
//   document.getElementById('notice-ref-no').textContent = `KAAC/CONF/${m.meetingDate.replace(/-/g, '')}/${m.id.toString().padStart(4, '0')}`;
//   document.getElementById('notice-date-gen').textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
//   document.getElementById('notice-meeting-title').textContent = m.title;
//   document.getElementById('notice-td-title').textContent = m.title;
//   document.getElementById('notice-td-date').textContent = formatDate(m.meetingDate);
//   document.getElementById('notice-td-time').textContent = `${m.startTime} to ${m.endTime}`;
//   document.getElementById('notice-td-venue').textContent = `${m.meetingRoomName} (${m.meetingRoomNumber}), Council Complex, Diphu`;
//   document.getElementById('notice-td-chair').textContent = `${m.chairpersonName}`;
//   document.getElementById('notice-td-dept').textContent = `${m.departmentName}`;
//   document.getElementById('notice-td-agenda').textContent = m.agenda || 'General council matters and review.';
//   document.getElementById('notice-td-attendees').textContent = m.attendees || 'Executive Members, Department Head, and relevant Council Officers.';
//   document.getElementById('notice-sign-name').textContent = m.createdByName;
//   document.getElementById('notice-sign-role').textContent = `${m.createdByRole === 'ADMIN' ? 'Council Secretary' : 'Meeting Coordinator / Officer'}, KAAC`;
//
//   openModal('modal-meeting-notice');
// }
//
// function triggerBrowserPrint() {
//   window.print();
// }
//
// // --- ADMIN CRUD: DEPARTMENTS ---
// function openCreateDepartmentModal() {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can create departments.', 'error');
//     return;
//   }
//   AppState.editingDepartmentId = null;
//   document.getElementById('dept-modal-title').textContent = 'Add Council Department';
//   document.getElementById('dept-form').reset();
//   openModal('modal-department');
// }
//
// function openEditDepartmentModal(id) {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can edit departments.', 'error');
//     return;
//   }
//   const d = AppState.departments.find(x => x.id === id);
//   if (!d) return;
//
//   AppState.editingDepartmentId = id;
//   document.getElementById('dept-modal-title').textContent = `Edit Department: ${d.name}`;
//   document.getElementById('form-dept-code').value = d.code;
//   document.getElementById('form-dept-name').value = d.name;
//   document.getElementById('form-dept-hod').value = d.hodName || '';
//   document.getElementById('form-dept-email').value = d.contactEmail || '';
//   document.getElementById('form-dept-phone').value = d.phone || '';
//   document.getElementById('form-dept-desc').value = d.description || '';
//   openModal('modal-department');
// }
//
// async function saveDepartment(e) {
//   e.preventDefault();
//   const code = document.getElementById('form-dept-code').value.trim();
//   const name = document.getElementById('form-dept-name').value.trim();
//   const hodName = document.getElementById('form-dept-hod').value.trim();
//   const contactEmail = document.getElementById('form-dept-email').value.trim();
//   const phone = document.getElementById('form-dept-phone').value.trim();
//   const description = document.getElementById('form-dept-desc').value.trim();
//
//   if (!code || !name) {
//     showToast('Department Code and Name are required.', 'warning');
//     return;
//   }
//
//   const payload = { code, name, hodName, contactEmail, phone, description };
//
//   try {
//     let res;
//     if (AppState.editingDepartmentId) {
//       res = await fetch(`/api/departments/${AppState.editingDepartmentId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     } else {
//       res = await fetch('/api/departments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     }
//
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to save department', 'error');
//       return;
//     }
//
//     showToast('Department saved successfully!', 'success');
//     closeModal('modal-department');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to save department', 'error');
//   }
// }
//
// async function deleteDepartment(id) {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can delete departments.', 'error');
//     return;
//   }
//   const d = AppState.departments.find(x => x.id === id);
//   if (!d) return;
//
//   if (!confirm(`Are you sure you want to delete Department: "${d.name} (${d.code})"?`)) return;
//
//   try {
//     const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to delete department', 'error');
//       return;
//     }
//     showToast('Department deleted successfully.', 'success');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to delete department', 'error');
//   }
// }
//
// // --- ADMIN CRUD: USERS ---
// function openCreateUserModal() {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can create users.', 'error');
//     return;
//   }
//   AppState.editingUserId = null;
//   document.getElementById('user-modal-title').textContent = 'Add Council User';
//   document.getElementById('user-form').reset();
//   populateUserFormDepts();
//   openModal('modal-user');
// }
//
// function populateUserFormDepts() {
//   const sel = document.getElementById('form-user-dept');
//   if (sel) {
//     sel.innerHTML = AppState.departments.map(d => `<option value="${d.id}">${escapeHtml(d.name)} (${d.code})</option>`).join('');
//   }
// }
//
// function openEditUserModal(id) {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can edit users.', 'error');
//     return;
//   }
//   const u = AppState.users.find(x => x.id === id);
//   if (!u) return;
//
//   AppState.editingUserId = id;
//   document.getElementById('user-modal-title').textContent = `Edit User: ${u.fullName}`;
//   populateUserFormDepts();
//
//   document.getElementById('form-user-username').value = u.username;
//   document.getElementById('form-user-fullname').value = u.fullName;
//   document.getElementById('form-user-email').value = u.email;
//   document.getElementById('form-user-phone').value = u.phone || '';
//   document.getElementById('form-user-designation').value = u.designation || '';
//   document.getElementById('form-user-role').value = u.role;
//   document.getElementById('form-user-dept').value = u.departmentId;
//   document.getElementById('form-user-status').value = u.status || 'ACTIVE';
//
//   openModal('modal-user');
// }
//
// async function saveUser(e) {
//   e.preventDefault();
//   const username = document.getElementById('form-user-username').value.trim();
//   const fullName = document.getElementById('form-user-fullname').value.trim();
//   const email = document.getElementById('form-user-email').value.trim();
//   const phone = document.getElementById('form-user-phone').value.trim();
//   const designation = document.getElementById('form-user-designation').value.trim();
//   const role = document.getElementById('form-user-role').value;
//   const departmentId = document.getElementById('form-user-dept').value;
//   const status = document.getElementById('form-user-status').value;
//
//   if (!username || !fullName || !email || !role || !departmentId) {
//     showToast('Username, Full Name, Email, Role and Department are required.', 'warning');
//     return;
//   }
//
//   const payload = { username, fullName, email, phone, designation, role, departmentId: Number(departmentId), status };
//
//   try {
//     let res;
//     if (AppState.editingUserId) {
//       res = await fetch(`/api/users/${AppState.editingUserId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     } else {
//       res = await fetch('/api/users', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     }
//
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to save user', 'error');
//       return;
//     }
//
//     showToast('User saved successfully!', 'success');
//     closeModal('modal-user');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to save user', 'error');
//   }
// }
//
// async function deleteUser(id) {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can delete users.', 'error');
//     return;
//   }
//   const u = AppState.users.find(x => x.id === id);
//   if (!u) return;
//
//   if (!confirm(`Are you sure you want to delete User: "${u.fullName}"?`)) return;
//
//   try {
//     const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to delete user', 'error');
//       return;
//     }
//     showToast('User deleted successfully.', 'success');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to delete user', 'error');
//   }
// }
//
// // --- ADMIN CRUD: MEETING ROOMS ---
// function openCreateRoomModal() {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can create meeting rooms.', 'error');
//     return;
//   }
//   AppState.editingRoomId = null;
//   document.getElementById('room-modal-title').textContent = 'Add Council Meeting Room / Hall';
//   document.getElementById('room-form').reset();
//   openModal('modal-room');
// }
//
// function openEditRoomModal(id) {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can edit meeting rooms.', 'error');
//     return;
//   }
//   const r = AppState.meetingRooms.find(x => x.id === id);
//   if (!r) return;
//
//   AppState.editingRoomId = id;
//   document.getElementById('room-modal-title').textContent = `Edit Room: ${r.name}`;
//   document.getElementById('form-room-number').value = r.roomNumber;
//   document.getElementById('form-room-name').value = r.name;
//   document.getElementById('form-room-location').value = r.location;
//   document.getElementById('form-room-capacity').value = r.capacity;
//   document.getElementById('form-room-facilities').value = (r.facilities || []).join(', ');
//   document.getElementById('form-room-status').value = r.status || 'AVAILABLE';
//   document.getElementById('form-room-desc').value = r.description || '';
//   openModal('modal-room');
// }
//
// async function saveRoom(e) {
//   e.preventDefault();
//   const roomNumber = document.getElementById('form-room-number').value.trim();
//   const name = document.getElementById('form-room-name').value.trim();
//   const location = document.getElementById('form-room-location').value.trim();
//   const capacity = document.getElementById('form-room-capacity').value;
//   const facilitiesRaw = document.getElementById('form-room-facilities').value.trim();
//   const status = document.getElementById('form-room-status').value;
//   const description = document.getElementById('form-room-desc').value.trim();
//
//   if (!roomNumber || !name || !location || !capacity) {
//     showToast('Room Code, Name, Location and Capacity are required.', 'warning');
//     return;
//   }
//
//   const facilities = facilitiesRaw ? facilitiesRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
//   const payload = { roomNumber, name, location, capacity: Number(capacity), facilities, status, description };
//
//   try {
//     let res;
//     if (AppState.editingRoomId) {
//       res = await fetch(`/api/meeting-rooms/${AppState.editingRoomId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     } else {
//       res = await fetch('/api/meeting-rooms', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//     }
//
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to save meeting room', 'error');
//       return;
//     }
//
//     showToast('Meeting room saved successfully!', 'success');
//     closeModal('modal-room');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to save meeting room', 'error');
//   }
// }
//
// async function deleteRoom(id) {
//   if (AppState.currentUser?.role !== 'ADMIN') {
//     showToast('Only ADMIN can delete meeting rooms.', 'error');
//     return;
//   }
//   const r = AppState.meetingRooms.find(x => x.id === id);
//   if (!r) return;
//
//   if (!confirm(`Are you sure you want to delete Meeting Room: "${r.name} (${r.roomNumber})"?`)) return;
//
//   try {
//     const res = await fetch(`/api/meeting-rooms/${id}`, { method: 'DELETE' });
//     const data = await res.json();
//     if (!res.ok || data.error) {
//       showToast(data.error || 'Failed to delete room', 'error');
//       return;
//     }
//     showToast('Meeting room deleted successfully.', 'success');
//     await loadAllData();
//     renderCurrentTab();
//   } catch (err) {
//     showToast('Failed to delete room', 'error');
//   }
// }
//
// // --- Event Listeners Setup ---
// function setupEventListeners() {
//   // Navigation Tabs
//   document.querySelectorAll('.nav-btn').forEach(btn => {
//     btn.addEventListener('click', () => switchTab(btn.dataset.tab));
//   });
//
//   // Role Switcher Select
//   const roleSelect = document.getElementById('role-switcher');
//   if (roleSelect) {
//     roleSelect.addEventListener('change', (e) => handleUserSwitch(e.target.value));
//   }
//
//   // Meeting Form Input listeners for live conflict check
//   ['form-meeting-date', 'form-meeting-start', 'form-meeting-end', 'form-meeting-room', 'form-meeting-chairperson'].forEach(id => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.addEventListener('change', triggerLiveMeetingConflictCheck);
//       el.addEventListener('input', triggerLiveMeetingConflictCheck);
//     }
//   });
//
//   // Forms Submit Handlers
//   document.getElementById('meeting-form')?.addEventListener('submit', saveMeetingSchedule);
//   document.getElementById('status-manage-form')?.addEventListener('submit', saveStatusUpdate);
//   document.getElementById('dept-form')?.addEventListener('submit', saveDepartment);
//   document.getElementById('user-form')?.addEventListener('submit', saveUser);
//   document.getElementById('room-form')?.addEventListener('submit', saveRoom);
//
//   // Close modals on clicking backdrop
//   document.querySelectorAll('.modal-backdrop').forEach(modal => {
//     modal.addEventListener('click', (e) => {
//       if (e.target === modal) {
//         modal.classList.remove('show');
//       }
//     });
//   });
// }
//
// // --- Helper Functions ---
// function openModal(id) {
//   const m = document.getElementById(id);
//   if (m) m.classList.add('show');
// }
//
// function closeModal(id) {
//   const m = document.getElementById(id);
//   if (m) m.classList.remove('show');
// }
//
// function showToast(msg, type = 'info') {
//   const container = document.getElementById('toast-container');
//   if (!container) return;
//
//   const toast = document.createElement('div');
//   toast.className = `toast ${type}`;
//   const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
//   toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(msg)}</span>`;
//   container.appendChild(toast);
//
//   setTimeout(() => {
//     toast.style.opacity = '0';
//     toast.style.transform = 'translateY(10px)';
//     toast.style.transition = 'all 0.3s ease';
//     setTimeout(() => toast.remove(), 300);
//   }, 3500);
// }
//
// function formatDate(dateStr) {
//   if (!dateStr) return '';
//   const d = new Date(dateStr);
//   return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
// }
//
// function escapeHtml(str) {
//   if (!str) return '';
//   return String(str)
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;')
//     .replace(/"/g, '&quot;')
//     .replace(/'/g, '&#039;');
// }
//
// // Expose global methods for inline HTML onclick attributes
// window.switchTab = switchTab;
// window.handleUserSwitch = handleUserSwitch;
// window.openCreateMeetingModal = openCreateMeetingModal;
// window.openEditMeetingModal = openEditMeetingModal;
// window.deleteMeeting = deleteMeeting;
// window.viewMeetingDetails = viewMeetingDetails;
// window.printMeetingNotice = printMeetingNotice;
// window.triggerBrowserPrint = triggerBrowserPrint;
// window.openStatusUpdateModal = openStatusUpdateModal;
// window.runStandaloneConflictCheck = runStandaloneConflictCheck;
// window.openCreateDepartmentModal = openCreateDepartmentModal;
// window.openEditDepartmentModal = openEditDepartmentModal;
// window.deleteDepartment = deleteDepartment;
// window.openCreateUserModal = openCreateUserModal;
// window.openEditUserModal = openEditUserModal;
// window.deleteUser = deleteUser;
// window.openCreateRoomModal = openCreateRoomModal;
// window.openEditRoomModal = openEditRoomModal;
// window.deleteRoom = deleteRoom;
// window.openModal = openModal;
// window.closeModal = closeModal;
// window.setSqlSample = setSqlSample;
// window.executeH2Sql = executeH2Sql;
// window.selectSpringFile = selectSpringFile;
// window.copySpringCode = copySpringCode;
// window.downloadSpringZip = downloadSpringZip;

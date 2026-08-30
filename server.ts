// import express from 'express';
// import path from 'path';
// import fs from 'fs';
// import cookieParser from 'cookie-parser';
// import bcrypt from 'bcryptjs';
// import { getDatabase, dbQuery, dbQueryOne, dbRun, dbExec } from './src/database';
//
// const app = express();
// const PORT = 3000;
//
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
//
// // Serve static assets
// const staticDir = path.join(process.cwd(), 'src/main/resources/static');
// const publicDir = path.join(process.cwd(), 'public');
//
// if (fs.existsSync(staticDir)) {
//   app.use('/static', express.static(staticDir));
//   app.use('/public', express.static(staticDir));
//   app.use('/css', express.static(path.join(staticDir, 'css')));
//   app.use('/js', express.static(path.join(staticDir, 'js')));
//   app.use(express.static(staticDir));
// }
// if (fs.existsSync(publicDir)) {
//   app.use('/public', express.static(publicDir));
//   app.use('/css', express.static(path.join(publicDir, 'css')));
//   app.use('/js', express.static(path.join(publicDir, 'js')));
//   app.use(express.static(publicDir));
// }
//
// // ----------------------------------------------------
// // Database Models & Active User Session Helper
// // ----------------------------------------------------
// export interface CouncilUser {
//   id: number;
//   username: string;
//   password?: string;
//   full_name: string;
//   email: string;
//   phone?: string;
//   designation?: string;
//   role: 'ADMIN' | 'CHAIRPERSON' | 'STAFF';
//   department_id: number | null;
//   status: 'ACTIVE' | 'INACTIVE';
// }
//
// function getActiveUser(req?: express.Request): CouncilUser | null {
//   if (req && req.cookies && req.cookies.kaac_user_id) {
//     const uid = Number(req.cookies.kaac_user_id);
//     const user = dbQueryOne<CouncilUser>(
//       'SELECT id, username, full_name, email, phone, designation, role, department_id, status FROM users WHERE id = ? AND status = ?',
//       [uid, 'ACTIVE']
//     );
//     if (user) return user;
//   }
//   return null;
// }
//
// // ----------------------------------------------------
// // Template Reading & Navigation Bar Renderer
// // ----------------------------------------------------
// function readTemplate(relPath: string): string {
//   const filePath = path.join(process.cwd(), 'src/main/resources/templates', relPath);
//   if (fs.existsSync(filePath)) {
//     return fs.readFileSync(filePath, 'utf8');
//   }
//   return '';
// }
//
// function renderHeaderAndNav(html: string, currentPath: string, req: express.Request): string {
//   const currentUser = getActiveUser(req);
//   const isAdmin = currentUser?.role === 'ADMIN';
//
//   // 1. Session Panel: Public (Read-Only) vs Logged-In Officer
//   const sessionBlock = currentUser ? `
//     <div class="session-panel" style="display: flex; align-items: center; gap: 14px;">
//       <div class="current-user-info" style="text-align: right;">
//         <div style="font-size: 0.72rem; color: #a7f3d0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Active Officer</div>
//         <div class="user-name" style="font-weight: 700; font-size: 0.95rem; color: #ffffff;">${currentUser.full_name}</div>
//         <div style="font-size: 0.75rem; color: #cbd5e1; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentUser.designation || ''}</div>
//       </div>
//       <span class="role-badge ${currentUser.role.toLowerCase()}" style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 6px;">${currentUser.role}</span>
//       <a href="/logout" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; padding: 5px 10px; background: rgba(255,255,255,0.15); color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 6px; text-decoration: none;" title="End Active Session">🚪 Logout</a>
//     </div>
//   ` : `
//     <div class="session-panel" style="display: flex; align-items: center; gap: 12px;">
//       <div style="text-align: right;">
//         <div style="font-size: 0.72rem; color: #fde68a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Public View Mode</div>
//         <div style="font-size: 0.8rem; color: #cbd5e1;">Read-Only Council Registry</div>
//       </div>
//       <a href="/login" class="btn btn-gold" style="font-size: 0.84rem; padding: 7px 14px; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">🔐 Officer Login</a>
//     </div>
//   `;
//
//   // 2. Navigation Bar: Only Authorized Menus
//   const adminTab = isAdmin ? `
//     <a href="/admin/dashboard" class="nav-btn ${currentPath.startsWith('/admin') ? 'active' : ''}">⚙️ Admin Console</a>
//   ` : '';
//
//   const scheduleAction = `
//     <a href="/meetings/new" class="btn btn-primary ${currentPath === '/meetings/new' ? 'active' : ''}">➕ Schedule Meeting</a>
//   `;
//
//   const navBlock = `
//   <nav class="nav-tab-bar">
//     <div class="nav-container">
//       <div class="tab-group">
//         <a href="/" class="nav-btn ${currentPath === '/' ? 'active' : ''}">🏛️ Meeting Dashboard</a>
//         <a href="/staff/dashboard" class="nav-btn ${currentPath.startsWith('/staff') ? 'active' : ''}">📋 Staff Dashboard</a>
//         <a href="/departments" class="nav-btn ${currentPath.startsWith('/departments') ? 'active' : ''}">🏢 Departments</a>
//         <a href="/rooms" class="nav-btn ${currentPath.startsWith('/rooms') ? 'active' : ''}">🏛️ Meeting Rooms</a>
//         <a href="/users" class="nav-btn ${currentPath.startsWith('/users') ? 'active' : ''}">👥 Users</a>
//         ${adminTab}
//       </div>
//       <div class="quick-action-group" style="display: flex; gap: 8px; align-items: center;">
//         <a href="/h2-console" class="btn btn-secondary" style="font-size: 0.82rem; padding: 6px 12px;" title="Open H2 Database Web Console">💾 H2 Console</a>
//         ${scheduleAction}
//       </div>
//     </div>
//   </nav>
//   `;
//
//   // Replace dynamic session-panel block cleanly inside <header class="main-header">
//   html = html.replace(/(?:<!--[\s\S]*?-->\s*)?<div[^>]*class="session-panel"[\s\S]*?<\/header>/, `${sessionBlock}\n    </div>\n  </header>`);
//  
//   // Replace nav-tab-bar in HTML
//   html = html.replace(/<nav class="nav-tab-bar">[\s\S]*?<\/nav>/, navBlock);
//
//   return html;
// }
//
// // ----------------------------------------------------
// // 1. Home / Master Meeting Schedule Controller
// // ----------------------------------------------------
// app.get('/', (req, res) => {
//   let html = readTemplate('index.html');
//   if (!html) return res.send('Spring MVC Index Template not found');
//
//   html = renderHeaderAndNav(html, '/', req);
//
//   // Fetch all meeting schedules from H2 Database via SQL
//   const meetings = dbQuery(`
//     SELECT 
//       m.id, m.title, m.agenda, m.meeting_date as meetingDate, m.start_time as startTime, m.end_time as endTime,
//       m.department_id as departmentId, m.meeting_room_id as meetingRoomId, m.chairperson_id as chairpersonId,
//       m.assigned_staff_id as assignedStaffId, m.created_by_user_id as createdById, m.status, m.priority,
//       m.meeting_type as meetingType, m.virtual_link as virtualLink, m.attendees, m.minutes_of_meeting as minutesOfMeeting,
//       m.decision_notes as decisionNotes,
//       d.name as dept_name, d.code as dept_code,
//       r.name as room_name, r.room_number, r.location as room_location,
//       u1.full_name as chair_name, u1.designation as chair_designation,
//       u2.full_name as staff_name,
//       u3.full_name as creator_name
//     FROM meeting_schedules m
//     LEFT JOIN departments d ON m.department_id = d.id
//     LEFT JOIN meeting_rooms r ON m.meeting_room_id = r.id
//     LEFT JOIN users u1 ON m.chairperson_id = u1.id
//     LEFT JOIN users u2 ON m.assigned_staff_id = u2.id
//     LEFT JOIN users u3 ON m.created_by_user_id = u3.id
//     ORDER BY m.meeting_date DESC, m.start_time DESC
//   `);
//
//   const departments = dbQuery('SELECT * FROM departments ORDER BY name ASC');
//   const rooms = dbQuery('SELECT * FROM meeting_rooms ORDER BY name ASC');
//   const users = dbQuery('SELECT id, full_name, role FROM users WHERE status = "ACTIVE" ORDER BY full_name ASC');
//
//   // Compute Metrics from SQL results
//   const totalMeetings = meetings.length;
//   const upcomingCount = meetings.filter(m => m.status === 'SCHEDULED').length;
//   const inProgressCount = meetings.filter(m => m.status === 'IN_PROGRESS').length;
//   const completedCount = meetings.filter(m => m.status === 'COMPLETED').length;
//   const totalDepts = departments.length;
//   const totalRooms = rooms.length;
//   const totalUsers = users.length;
//
//   // Render Table Rows
//   const tableRows = meetings.map(m => {
//     const statusBadge = `<span class="status-badge ${m.status.toLowerCase()}">${m.status.replace('_', ' ')}</span>`;
//     const priorityBadge = `<span class="priority-badge ${m.priority.toLowerCase()}">${m.priority}</span>`;
//     const typeBadge = m.meetingType === 'VIRTUAL' 
//       ? `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; padding: 2px 7px; background: #ede9fe; color: #6d28d9; border-radius: 4px; font-weight: 700;">🌐 Virtual</span>`
//       : `<span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; padding: 2px 7px; background: #e0f2fe; color: #0369a1; border-radius: 4px; font-weight: 700;">🏛️ Hall</span>`;
//
//     return `
//       <tr>
//         <td>
//           <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem;">${m.title}</div>
//           <div style="font-size: 0.8rem; color: #64748b; margin-top: 3px; display: flex; gap: 8px; align-items: center;">
//             <span>🏢 ${m.dept_name || 'Department'} (${m.dept_code || 'KAAC'})</span>
//             <span>•</span>
//             ${typeBadge}
//           </div>
//         </td>
//         <td>
//           <div style="font-weight: 700; font-size: 0.9rem; color: #1e293b;">📅 ${m.meetingDate}</div>
//           <div style="font-size: 0.82rem; color: #0284c7; font-weight: 600; margin-top: 2px;">⏰ ${m.startTime} - ${m.endTime}</div>
//         </td>
//         <td>
//           <div style="font-weight: 600; font-size: 0.9rem;">${m.room_name || 'Conference Venue'}</div>
//           <div style="font-size: 0.78rem; color: #64748b;">${m.room_number || ''} • ${m.room_location || 'Diphu'}</div>
//         </td>
//         <td>
//           <div style="font-weight: 700; color: #78350f; font-size: 0.9rem;">👑 ${m.chair_name || 'Designated Chairperson'}</div>
//           <div style="font-size: 0.78rem; color: #92400e;">${m.chair_designation || 'Executive Member'}</div>
//         </td>
//         <td>
//           <div style="font-weight: 600; font-size: 0.88rem; color: #334155;">📋 ${m.staff_name || 'Council Staff'}</div>
//         </td>
//         <td>
//           <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
//             ${statusBadge}
//             ${priorityBadge}
//           </div>
//         </td>
//         <td>
//           <div style="display: flex; gap: 6px; flex-wrap: wrap;">
//             <a href="/meetings/view/${m.id}" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; padding: 4px 8px;">👁️ View</a>
//             <a href="/meetings/notice/${m.id}" class="btn btn-gold btn-sm" style="font-size: 0.78rem; padding: 4px 8px;">📄 Notice</a>
//             <a href="/meetings/edit/${m.id}" class="btn btn-outline btn-sm" style="font-size: 0.78rem; padding: 4px 8px; border: 1px solid #cbd5e1; color: #334155; text-decoration: none;">✏️ Edit</a>
//           </div>
//         </td>
//       </tr>
//     `;
//   }).join('');
//
//   html = html
//     .replace('<span id="stat-total-meetings">0</span>', `<span id="stat-total-meetings">${totalMeetings}</span>`)
//     .replace('<span id="stat-upcoming-meetings">0</span>', `<span id="stat-upcoming-meetings">${upcomingCount}</span>`)
//     .replace('<span id="stat-completed-meetings">0</span>', `<span id="stat-completed-meetings">${completedCount}</span>`)
//     .replace('<span id="stat-departments">0</span>', `<span id="stat-departments">${totalDepts}</span>`)
//     .replace('<span id="stat-rooms">0</span>', `<span id="stat-rooms">${totalRooms}</span>`)
//     .replace('<span id="stat-users">0</span>', `<span id="stat-users">${totalUsers}</span>`);
//
//   html = html.replace('<!-- Populated via Thymeleaf or Server -->', tableRows);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 2. Department Controller (/departments)
// // ----------------------------------------------------
// app.get('/departments', (req, res) => {
//   let html = readTemplate('department/list.html');
//   if (!html) return res.send('Department template not found');
//
//   html = renderHeaderAndNav(html, '/departments', req);
//
//   // Fetch all departments with live statistics from H2 DB
//   const departments = dbQuery(`
//     SELECT 
//       d.id, d.code, d.name, d.hod_name as hodName, d.contact_email as contactEmail, d.phone, d.description,
//       (SELECT COUNT(*) FROM meeting_schedules m WHERE m.department_id = d.id) as meetingCount,
//       (SELECT COUNT(*) FROM users u WHERE u.department_id = d.id) as userCount
//     FROM departments d
//     ORDER BY d.name ASC
//   `);
//
//   const deptCards = departments.map(d => `
//     <div class="council-card dept-card-item" data-search="${(d.name + ' ' + d.code + ' ' + (d.hodName || '')).toLowerCase()}" style="display: flex; flex-direction: column; justify-content: space-between;">
//       <div>
//         <div class="card-header" style="justify-content: space-between; align-items: flex-start;">
//           <div>
//             <span style="display: inline-block; background: #e0f2fe; color: #0369a1; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">CODE: ${d.code}</span>
//             <h3 style="font-size: 1.1rem; color: #0f172a; margin: 0; line-height: 1.3;">${d.name}</h3>
//           </div>
//           <span style="font-size: 1.5rem;">🏢</span>
//         </div>
//         <div class="card-body" style="padding: 16px;">
//           <p style="font-size: 0.88rem; color: #475569; margin-bottom: 14px; min-height: 40px;">${d.description || 'Autonomous council departmental governance & administrative wing.'}</p>
//           <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; font-size: 0.85rem;">
//             <div style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700;">Head of Department (HOD)</div>
//             <div style="font-weight: 700; color: #1e293b; font-size: 0.95rem; margin-top: 2px;">👤 ${d.hodName || 'Director / Secretary, KAAC'}</div>
//             <div style="color: #475569; margin-top: 6px; display: flex; flex-direction: column; gap: 3px;">
//               <span>✉️ ${d.contactEmail || 'department.kaac@assam.gov.in'}</span>
//               <span>📞 ${d.phone || '+91 3671 272200'}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div style="background: #f1f5f9; padding: 12px 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #64748b;">
//         <span>📊 <strong>${d.meetingCount || 0}</strong> Meetings Scheduled</span>
//         <span>👥 <strong>${d.userCount || 0}</strong> Personnel</span>
//       </div>
//     </div>
//   `).join('');
//
//   html = html.replace(/<div id="dept-grid"[^>]*>[\s\S]*?<\/div>\s*<\/main>/, `<div id="dept-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;">\n${deptCards}\n</div>\n  </main>`);
//   html = html.replace('Displaying departments', `Displaying ${departments.length} Autonomous Council Departments`);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 3. Meeting Rooms & Halls Controller (/rooms)
// // ----------------------------------------------------
// app.get('/rooms', (req, res) => {
//   let html = readTemplate('room/list.html');
//   if (!html) return res.send('Room template not found');
//
//   html = renderHeaderAndNav(html, '/rooms', req);
//
//   // Fetch all rooms from H2 DB
//   const rooms = dbQuery(`
//     SELECT 
//       r.id, r.room_number as roomNumber, r.name, r.location, r.capacity, r.facilities, r.status, r.description,
//       (SELECT COUNT(*) FROM meeting_schedules m WHERE m.meeting_room_id = r.id AND m.status = 'SCHEDULED') as upcomingCount
//     FROM meeting_rooms r
//     ORDER BY r.name ASC
//   `);
//
//   const roomCards = rooms.map(r => `
//     <div class="council-card room-card-item" data-search="${(r.name + ' ' + r.roomNumber + ' ' + r.location + ' ' + (r.facilities || '')).toLowerCase()}" style="display: flex; flex-direction: column; justify-content: space-between;">
//       <div>
//         <div class="card-header" style="justify-content: space-between; align-items: flex-start;">
//           <div>
//             <span style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; margin-bottom: 6px;">VENUE REF: ${r.roomNumber}</span>
//             <h3 style="font-size: 1.1rem; color: #0f172a; margin: 0; line-height: 1.3;">${r.name}</h3>
//           </div>
//           <span class="status-badge ${r.status.toLowerCase()}">${r.status}</span>
//         </div>
//         <div class="card-body" style="padding: 16px;">
//           <div style="font-size: 0.88rem; color: #475569; margin-bottom: 12px;">📍 ${r.location}</div>
//           <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 14px;">${r.description || 'Secretariat Conference and Board Session Room.'}</p>
//           <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px;">
//             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
//               <span style="font-size: 0.8rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Seating Capacity</span>
//               <span style="font-weight: 800; color: #0f172a; font-size: 1.05rem;">👥 ${r.capacity} Delegates</span>
//             </div>
//             <div style="font-size: 0.8rem; color: #475569;">
//               <strong>Facilities:</strong> ${r.facilities || 'Sound System, Digital Display, AC'}
//             </div>
//           </div>
//         </div>
//       </div>
//       <div style="background: #f1f5f9; padding: 12px 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem; color: #64748b;">
//         <span>📅 <strong>${r.upcomingCount || 0}</strong> Upcoming Sessions</span>
//         <span style="color: #059669; font-weight: 600;">Operational</span>
//       </div>
//     </div>
//   `).join('');
//
//   html = html.replace(/<div id="room-grid"[^>]*>[\s\S]*?<\/div>\s*<\/main>/, `<div id="room-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;">\n${roomCards}\n</div>\n  </main>`);
//   html = html.replace('Displaying venues', `Displaying ${rooms.length} Conference Venues`);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 4. Users Directory Controller (/users)
// // ----------------------------------------------------
// app.get('/users', (req, res) => {
//   let html = readTemplate('user/list.html');
//   if (!html) return res.send('User template not found');
//
//   html = renderHeaderAndNav(html, '/users', req);
//
//   // Fetch all users with department from H2 DB
//   const users = dbQuery(`
//     SELECT 
//       u.id, u.username, u.full_name as fullName, u.email, u.phone, u.designation, u.role, u.status,
//       d.name as deptName, d.code as deptCode
//     FROM users u
//     LEFT JOIN departments d ON u.department_id = d.id
//     ORDER BY u.full_name ASC
//   `);
//
//   const userCards = users.map(u => `
//     <div class="council-card user-card-item" data-role="${u.role}" data-search="${(u.fullName + ' ' + u.username + ' ' + (u.designation || '') + ' ' + u.email + ' ' + (u.deptName || '')).toLowerCase()}" style="display: flex; flex-direction: column; justify-content: space-between;">
//       <div>
//         <div class="card-header" style="justify-content: space-between; align-items: flex-start;">
//           <div>
//             <div style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">@${u.username}</div>
//             <h3 style="font-size: 1.1rem; color: #0f172a; margin: 2px 0 0 0;">${u.fullName}</h3>
//           </div>
//           <span class="role-badge ${u.role.toLowerCase()}">${u.role}</span>
//         </div>
//         <div class="card-body" style="padding: 16px;">
//           <div style="font-weight: 700; color: #1e293b; font-size: 0.9rem; margin-bottom: 6px;">💼 ${u.designation || 'Council Officer'}</div>
//           <div style="font-size: 0.85rem; color: #0369a1; margin-bottom: 12px;">🏢 ${u.deptName ? `${u.deptName} (${u.deptCode})` : 'General Council Secretariat'}</div>
//           <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; font-size: 0.82rem; color: #475569; display: flex; flex-direction: column; gap: 4px;">
//             <span>✉️ ${u.email}</span>
//             <span>📞 ${u.phone || '+91 94350 00000'}</span>
//           </div>
//         </div>
//       </div>
//       <div style="background: #f1f5f9; padding: 10px 16px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #64748b;">
//         <span>Status: <strong style="color: #059669;">${u.status}</strong></span>
//         <span>ID: #${u.id}</span>
//       </div>
//     </div>
//   `).join('');
//
//   html = html.replace(/<div id="user-grid"[^>]*>[\s\S]*?<\/div>\s*<\/main>/, `<div id="user-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;">\n${userCards}\n</div>\n  </main>`);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 5. Staff Dashboard Controller (/staff/dashboard)
// // ----------------------------------------------------
// app.get('/staff/dashboard', (req, res) => {
//   let html = readTemplate('staff/dashboard.html');
//   if (!html) return res.send('Staff dashboard template not found');
//
//   html = renderHeaderAndNav(html, '/staff/dashboard', req);
//
//   const filterStaffId = req.query.staffId ? Number(req.query.staffId) : null;
//   const filterType = req.query.type ? String(req.query.type) : null;
//   const filterDate = req.query.date ? String(req.query.date) : null;
//
//   // Retrieve all staff members and their workload stats
//   const staffOfficers = dbQuery(`
//     SELECT u.id, u.full_name, u.email, u.designation,
//            COUNT(m.id) as assigned_count,
//            COUNT(DISTINCT m.meeting_date) as active_dates_count
//     FROM users u
//     LEFT JOIN meeting_schedules m ON u.id = m.assigned_staff_id AND m.status != 'CANCELLED'
//     WHERE u.role = 'STAFF' AND u.status = 'ACTIVE'
//     GROUP BY u.id, u.full_name, u.email, u.designation
//     ORDER BY u.id ASC
//   `);
//
//   // Build Staff Summary Cards
//   const staffCardsHtml = staffOfficers.map(staff => `
//     <div class="staff-stat-card">
//       <div class="staff-avatar-circle">👤</div>
//       <div>
//         <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">${staff.full_name}</div>
//         <div style="font-size: 0.82rem; color: #64748b; margin-bottom: 6px;">${staff.designation || 'Staff Coordinator'}</div>
//         <div style="font-size: 0.82rem; color: #334155; display: flex; gap: 12px;">
//           <span>📋 <strong>${staff.assigned_count}</strong> Assigned</span>
//           <span>📅 <strong>${staff.active_dates_count}</strong> Active Dates</span>
//         </div>
//       </div>
//     </div>
//   `).join('');
//
//   // Retrieve meetings with filters
//   let whereClauses: string[] = [];
//   let queryParams: any[] = [];
//
//   if (filterStaffId) {
//     whereClauses.push('m.assigned_staff_id = ?');
//     queryParams.push(filterStaffId);
//   }
//   if (filterType) {
//     whereClauses.push('m.meeting_type = ?');
//     queryParams.push(filterType);
//   }
//   if (filterDate) {
//     whereClauses.push('m.meeting_date = ?');
//     queryParams.push(filterDate);
//   }
//
//   const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
//
//   const meetings = dbQuery(`
//     SELECT 
//       m.id, m.title, m.agenda, m.meeting_date as meetingDate, m.start_time as startTime, m.end_time as endTime,
//       m.department_id as departmentId, m.meeting_room_id as meetingRoomId, m.chairperson_id as chairpersonId,
//       m.assigned_staff_id as assignedStaffId, m.status, m.priority,
//       m.meeting_type as meetingType, m.virtual_link as virtualLink, m.attendees,
//       d.name as dept_name, d.code as dept_code,
//       r.name as room_name, r.room_number,
//       u1.full_name as chair_name, u1.designation as chair_designation,
//       u2.full_name as staff_name, u2.email as staff_email
//     FROM meeting_schedules m
//     LEFT JOIN departments d ON m.department_id = d.id
//     LEFT JOIN meeting_rooms r ON m.meeting_room_id = r.id
//     LEFT JOIN users u1 ON m.chairperson_id = u1.id
//     LEFT JOIN users u2 ON m.assigned_staff_id = u2.id
//     ${whereSql}
//     ORDER BY m.meeting_date DESC, m.start_time ASC
//   `, queryParams);
//
//   // Group meetings by Date
//   const dateGroups: { [date: string]: typeof meetings } = {};
//   meetings.forEach(m => {
//     if (!dateGroups[m.meetingDate]) {
//       dateGroups[m.meetingDate] = [];
//     }
//     dateGroups[m.meetingDate].push(m);
//   });
//
//   const dates = Object.keys(dateGroups).sort((a, b) => b.localeCompare(a));
//
//   let dateGroupsHtml = '';
//   if (dates.length === 0) {
//     dateGroupsHtml = `
//       <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 48px 24px; text-align: center; color: #64748b;">
//         <div style="font-size: 2.5rem; margin-bottom: 8px;">📋</div>
//         <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">No meeting assignments found</div>
//         <p style="font-size: 0.88rem; margin-top: 4px;">No meetings match your filter parameters. Try clearing the filter or scheduling a new meeting.</p>
//         <a href="/staff/dashboard" class="btn btn-secondary btn-sm" style="margin-top: 16px;">Reset Filter</a>
//       </div>
//     `;
//   } else {
//     dateGroupsHtml = dates.map(date => {
//       const groupMeetings = dateGroups[date];
//       const count = groupMeetings.length;
//
//       const rows = groupMeetings.map(m => {
//         const statusBadge = m.status === 'COMPLETED'
//           ? `<span class="status-badge-completed">COMPLETED</span>`
//           : (m.status === 'CANCELLED'
//               ? `<span class="status-badge-cancelled">CANCELLED</span>`
//               : `<span class="status-badge-scheduled">SCHEDULED</span>`);
//
//         const modeBadge = m.meetingType === 'VIRTUAL'
//           ? `<span class="mode-badge-virtual">💻 Virtual</span>`
//           : `<span class="mode-badge-physical">🏛️ Physical</span>`;
//
//         const venueHtml = m.meetingType === 'VIRTUAL'
//           ? `<div style="font-weight: 600; font-size: 0.85rem; color: #9333ea; margin-top: 3px;">Online Video Call</div>
//              <a href="${m.virtualLink || 'https://meet.google.com'}" target="_blank" style="font-size: 0.75rem; color: #0284c7; text-decoration: none; font-weight: 600;">🔗 Join Call</a>`
//           : `<div style="font-weight: 600; font-size: 0.85rem; color: #1e293b; margin-top: 3px;">${m.room_name || 'Council Hall'}</div>
//              <div style="font-size: 0.75rem; color: #64748b;">${m.room_number || ''}</div>`;
//
//         return `
//           <tr>
//             <td>
//               <div class="staff-officer-pill">👤 ${m.staff_name || 'Unassigned'}</div>
//               <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">${m.staff_email || 'staff.council@kaac.gov.in'}</div>
//             </td>
//             <td>
//               <div style="font-weight: 700; color: #0f172a; font-size: 0.92rem;">${m.title}</div>
//               <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">${m.dept_name || 'Council Department'} (${m.dept_code || 'KAAC'})</div>
//             </td>
//             <td>
//               <div style="font-weight: 700; font-size: 0.9rem; color: #1e293b;">${m.startTime} - ${m.endTime}</div>
//               ${statusBadge}
//             </td>
//             <td>
//               <div>${modeBadge}</div>
//               ${venueHtml}
//             </td>
//             <td>
//               <div class="chairperson-name">${m.chair_name || 'Presiding Chairperson'}</div>
//               <div style="font-size: 0.75rem; color: #64748b;">${m.chair_designation || 'Council Authority'}</div>
//             </td>
//             <td style="text-align: right; white-space: nowrap;">
//               <a href="/meetings/view/${m.id}" class="btn btn-secondary btn-sm" style="padding: 4px 10px; font-size: 0.8rem;">View</a>
//               <a href="/meetings/notice/${m.id}" class="btn btn-gold btn-sm" style="padding: 4px 10px; font-size: 0.8rem; background: #d97706; color: #fff;">Notice</a>
//             </td>
//           </tr>
//         `;
//       }).join('');
//
//       return `
//         <div class="date-group-card" id="group-${date}">
//           <div class="date-group-header">
//             <div>
//               <span style="font-size: 1.1rem; margin-right: 4px;">📅</span>
//               <strong style="font-size: 1.05rem; color: #0f172a;">Date: ${date}</strong>
//               <div style="font-size: 0.8rem; color: #64748b; margin-top: 2px;">Total meetings assigned on this day: ${count}</div>
//             </div>
//             <div>
//               <span class="assigned-pill-badge">${count} ASSIGNED</span>
//             </div>
//           </div>
//           <div class="table-responsive">
//             <table class="council-table">
//               <thead>
//                 <tr>
//                   <th style="width: 18%;">ASSIGNED STAFF OFFICER</th>
//                   <th style="width: 32%;">MEETING SUBJECT & DEPARTMENT</th>
//                   <th style="width: 14%;">TIME SLOT</th>
//                   <th style="width: 18%;">MODE & VENUE / LINK</th>
//                   <th style="width: 18%;">PRESIDING CHAIRPERSON</th>
//                   <th style="text-align: right; width: 10%;">ACTIONS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${rows}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       `;
//     }).join('');
//   }
//
//   // Options for filter form
//   const staffOptions = staffOfficers.map(s => `
//     <option value="${s.id}" ${filterStaffId === s.id ? 'selected' : ''}>${s.full_name}</option>
//   `).join('');
//
//   // Replace parts in HTML template
//   if (staffCardsHtml) {
//     html = html.replace(/<div class="staff-summary-grid">[\s\S]*?<\/div>\s*<!-- Filter Bar -->/, `<div class="staff-summary-grid">${staffCardsHtml}</div>\n    <!-- Filter Bar -->`);
//   }
//
//   // Update staff options in select
//   html = html.replace(/<select name="staffId"[\s\S]*?<\/select>/, `
//     <select name="staffId" id="filterStaff" class="form-control" style="width: auto; padding: 6px 12px; font-size: 0.85rem;">
//       <option value="">All Staff Members</option>
//       ${staffOptions}
//     </select>
//   `);
//
//   // Update selected values in filter form
//   if (filterType) {
//     html = html.replace(`value="${filterType}"`, `value="${filterType}" selected`);
//   }
//   if (filterDate) {
//     html = html.replace('placeholder="dd / mm / yyyy"', `value="${filterDate}" placeholder="dd / mm / yyyy"`);
//   }
//
//   // Replace Date groups in HTML
//   html = html.replace(/<!-- Date Group 1: 2026-08-28 -->[\s\S]*?<\/main>/, `${dateGroupsHtml}\n  </main>`);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 6. Schedule Meeting Form Controller (/meetings/new)
// // ----------------------------------------------------
// app.get('/meetings/new', (req, res) => {
//   let html = readTemplate('meeting/schedule.html');
//   if (!html) return res.send('Schedule meeting template not found');
//
//   html = renderHeaderAndNav(html, '/meetings/new', req);
//
//   // Fetch reference entities from H2 Database
//   const departments = dbQuery('SELECT * FROM departments ORDER BY name ASC');
//   const rooms = dbQuery('SELECT * FROM meeting_rooms ORDER BY name ASC');
//   const chairpersons = dbQuery('SELECT * FROM users WHERE role = "CHAIRPERSON" AND status = "ACTIVE" ORDER BY full_name ASC');
//   const staffMembers = dbQuery('SELECT * FROM users WHERE role = "STAFF" AND status = "ACTIVE" ORDER BY full_name ASC');
//
//   // Populate Select Options
//   const deptOptions = departments.map(d => `<option value="${d.id}">${d.name} (${d.code})</option>`).join('');
//   const roomOptions = rooms.map(r => `<option value="${r.id}">${r.name} (${r.room_number} - Cap: ${r.capacity})</option>`).join('');
//   const chairOptions = chairpersons.map(c => `<option value="${c.id}">${c.full_name} (${c.designation || 'Chairperson'})</option>`).join('');
//   const staffOptions = staffMembers.map(s => `<option value="${s.id}">${s.full_name} (${s.designation || 'Staff Officer'})</option>`).join('');
//
//   html = html
//     .replace('<!-- Department Options -->', deptOptions)
//     .replace('<!-- Room Options -->', roomOptions)
//     .replace('<!-- Chairperson Options -->', chairOptions)
//     .replace('<!-- Staff Options -->', staffOptions);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 6b. Edit Meeting Form Controller (/meetings/edit/:id)
// // ----------------------------------------------------
// app.get('/meetings/edit/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const meeting = dbQueryOne<any>('SELECT * FROM meeting_schedules WHERE id = ?', [id]);
//   if (!meeting) {
//     return res.redirect('/?error=not_found');
//   }
//
//   let html = readTemplate('meeting/schedule.html');
//   if (!html) return res.send('Schedule meeting template not found');
//
//   html = renderHeaderAndNav(html, '/meetings/edit', req);
//
//   // Fetch reference entities from H2 Database
//   const departments = dbQuery('SELECT * FROM departments ORDER BY name ASC');
//   const rooms = dbQuery('SELECT * FROM meeting_rooms ORDER BY name ASC');
//   const chairpersons = dbQuery('SELECT * FROM users WHERE role = "CHAIRPERSON" AND status = "ACTIVE" ORDER BY full_name ASC');
//   const staffMembers = dbQuery('SELECT * FROM users WHERE role = "STAFF" AND status = "ACTIVE" ORDER BY full_name ASC');
//
//   // Populate Select Options with pre-selection
//   const deptOptions = departments.map(d => `<option value="${d.id}" ${d.id === meeting.department_id ? 'selected' : ''}>${d.name} (${d.code})</option>`).join('');
//   const roomOptions = rooms.map(r => `<option value="${r.id}" ${r.id === meeting.meeting_room_id ? 'selected' : ''}>${r.name} (${r.room_number} - Cap: ${r.capacity})</option>`).join('');
//   const chairOptions = chairpersons.map(c => `<option value="${c.id}" ${c.id === meeting.chairperson_id ? 'selected' : ''}>${c.full_name} (${c.designation || 'Chairperson'})</option>`).join('');
//   const staffOptions = staffMembers.map(s => `<option value="${s.id}" ${s.id === meeting.assigned_staff_id ? 'selected' : ''}>${s.full_name} (${s.designation || 'Staff Officer'})</option>`).join('');
//
//   html = html
//     .replace('SCHEDULE NEW COUNCIL MEETING', `EDIT COUNCIL MEETING SCHEDULE #${meeting.id}`)
//     .replace('Schedule New Meeting', `Edit Meeting Schedule #${meeting.id}`)
//     .replace('<form action="/meetings/save" method="post"', `<form action="/meetings/save" method="post">\n        <input type="hidden" name="id" value="${meeting.id}">`)
//     .replace('placeholder="e.g. Executive Committee Review on District Infrastructure"', `value="${(meeting.title || '').replace(/"/g, '&quot;')}"`)
//     .replace('name="meetingDate" class="form-control" required', `name="meetingDate" class="form-control" value="${meeting.meeting_date}" required`)
//     .replace('name="startTime" class="form-control" required', `name="startTime" class="form-control" value="${meeting.start_time}" required`)
//     .replace('name="endTime" class="form-control" required', `name="endTime" class="form-control" value="${meeting.end_time}" required`)
//     .replace('<!-- Department Options -->', deptOptions)
//     .replace('<!-- Room Options -->', roomOptions)
//     .replace('<!-- Chairperson Options -->', chairOptions)
//     .replace('<!-- Staff Options -->', staffOptions);
//
//   if (meeting.agenda) {
//     html = html.replace('placeholder="Detail the agenda points to be discussed..." rows="4"></textarea>', `rows="4">${meeting.agenda}</textarea>`);
//   }
//   if (meeting.attendees) {
//     html = html.replace('placeholder="List key attendees, members, and invitees..." rows="3"></textarea>', `rows="3">${meeting.attendees}</textarea>`);
//   }
//   if (meeting.virtual_link) {
//     html = html.replace('placeholder="https://meet.google.com/... or MS Teams URL"', `value="${meeting.virtual_link.replace(/"/g, '&quot;')}"`);
//   }
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 7. Save Meeting POST Handler (/meetings/save)
// // ----------------------------------------------------
// app.post('/meetings/save', (req, res) => {
//   const currentUser = getActiveUser(req);
//   const {
//     id, title, agenda, meetingDate, startTime, endTime, departmentId,
//     meetingRoomId, chairpersonId, assignedStaffId, priority, meetingType,
//     virtualLink, attendees
//   } = req.body;
//
//   const createdById = currentUser ? currentUser.id : (Number(assignedStaffId) || 5);
//
//   if (id) {
//     dbRun(`
//       UPDATE meeting_schedules SET
//         title = ?, agenda = ?, meeting_date = ?, start_time = ?, end_time = ?,
//         department_id = ?, meeting_room_id = ?, chairperson_id = ?, assigned_staff_id = ?,
//         priority = ?, meeting_type = ?, virtual_link = ?, attendees = ?
//       WHERE id = ?
//     `, [
//       title || 'Council Official Meeting',
//       agenda || '',
//       meetingDate || new Date().toISOString().split('T')[0],
//       startTime || '10:00',
//       endTime || '12:00',
//       Number(departmentId) || 1,
//       Number(meetingRoomId) || 1,
//       Number(chairpersonId) || 2,
//       Number(assignedStaffId) || 5,
//       priority || 'NORMAL',
//       meetingType || 'PHYSICAL',
//       virtualLink || '',
//       attendees || '',
//       Number(id)
//     ]);
//     return res.redirect('/?updated=true');
//   }
//
//   // Insert into H2 Database via SQL
//   dbRun(`
//     INSERT INTO meeting_schedules (
//       title, agenda, meeting_date, start_time, end_time, department_id,
//       meeting_room_id, chairperson_id, assigned_staff_id, created_by_user_id,
//       status, priority, meeting_type, virtual_link, attendees, minutes_of_meeting, decision_notes
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, ?, ?, '', '')
//   `, [
//     title || 'Council Official Meeting',
//     agenda || '',
//     meetingDate || new Date().toISOString().split('T')[0],
//     startTime || '10:00',
//     endTime || '12:00',
//     Number(departmentId) || 1,
//     Number(meetingRoomId) || 1,
//     Number(chairpersonId) || 2,
//     Number(assignedStaffId) || 5,
//     createdById,
//     priority || 'NORMAL',
//     meetingType || 'PHYSICAL',
//     virtualLink || '',
//     attendees || ''
//   ]);
//
//   res.redirect('/?scheduled=true');
// });
//
// // Cancel Meeting POST Handler (/meetings/cancel/:id)
// app.post('/meetings/cancel/:id', (req, res) => {
//   const id = Number(req.params.id);
//   dbRun(`UPDATE meeting_schedules SET status = 'CANCELLED' WHERE id = ?`, [id]);
//   res.redirect('/?cancelled=true');
// });
//
// // Delete Meeting POST Handler (/meetings/delete/:id)
// app.post('/meetings/delete/:id', (req, res) => {
//   const id = Number(req.params.id);
//   dbRun(`DELETE FROM meeting_schedules WHERE id = ?`, [id]);
//   res.redirect('/?deleted=true');
// });
//
// // ----------------------------------------------------
// // 8. Meeting Details View (/meetings/view/:id)
// // ----------------------------------------------------
// app.get('/meetings/view/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const meeting = dbQueryOne(`
//     SELECT 
//       m.id, m.title, m.agenda, m.meeting_date as meetingDate, m.start_time as startTime, m.end_time as endTime,
//       m.status, m.priority, m.meeting_type as meetingType, m.virtual_link as virtualLink, m.attendees,
//       m.minutes_of_meeting as minutesOfMeeting, m.decision_notes as decisionNotes,
//       d.name as dept_name, d.code as dept_code,
//       r.name as room_name, r.room_number, r.location as room_location,
//       u1.full_name as chair_name, u1.designation as chair_designation,
//       u2.full_name as staff_name,
//       u3.full_name as creator_name
//     FROM meeting_schedules m
//     LEFT JOIN departments d ON m.department_id = d.id
//     LEFT JOIN meeting_rooms r ON m.meeting_room_id = r.id
//     LEFT JOIN users u1 ON m.chairperson_id = u1.id
//     LEFT JOIN users u2 ON m.assigned_staff_id = u2.id
//     LEFT JOIN users u3 ON m.created_by_user_id = u3.id
//     WHERE m.id = ?
//   `, [id]);
//
//   if (!meeting) {
//     return res.status(404).send('Meeting schedule not found in H2 database');
//   }
//
//   let html = readTemplate('meeting/details.html');
//   if (!html) return res.send('Meeting details template not found');
//
//   html = renderHeaderAndNav(html, '/meetings', req);
//
//   // Substitute placeholders
//   html = html
//     .replace(/th:text="\${meeting\.title}">.*?<\/h3>/, `>${meeting.title}</h3>`)
//     .replace(/th:text="\${meeting\.status}">.*?<\/span>/, `>${meeting.status}</span>`)
//     .replace(/th:text="\${meeting\.meetingRoom\.name}">.*?<\/div>/, `>${meeting.room_name} (${meeting.room_number})</div>`)
//     .replace(/th:text="\${meeting\.meetingRoom\.location}">.*?<\/div>/, `>${meeting.room_location}</div>`)
//     .replace(/th:text="\${meeting\.chairperson\.fullName}">.*?<\/div>/, `>${meeting.chair_name}</div>`)
//     .replace(/th:text="\${meeting\.chairperson\.designation}">.*?<\/div>/, `>${meeting.chair_designation || 'Council Executive'}</div>`)
//     .replace(/th:text="\${meeting\.meetingDate \+ ' \(' \+ meeting\.startTime \+ ' - ' \+ meeting\.endTime \+ '\)'}">.*?<\/div>/, `>${meeting.meetingDate} (${meeting.startTime} - ${meeting.endTime})</div>`)
//     .replace(/th:text="\${meeting\.department\.name \+ ' \(' \+ meeting\.department\.code \+ '\)'}">.*?<\/div>/, `>${meeting.dept_name} (${meeting.dept_code})</div>`)
//     .replace(/th:text="\${meeting\.agenda}">.*?<\/div>/, `>${meeting.agenda || 'No agenda recorded.'}</div>`)
//     .replace(/th:text="\${meeting\.attendees}">.*?<\/div>/, `>${meeting.attendees || 'Official Council Delegates'}</div>`)
//     .replace(/th:href="@{'\x2Fmeetings\x2Fnotice\x2F' \+ \${meeting\.id}}"/g, `href="/meetings/notice/${meeting.id}"`);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 9. Meeting Notice Printable View (/meetings/notice/:id)
// // ----------------------------------------------------
// app.get('/meetings/notice/:id', (req, res) => {
//   const id = Number(req.params.id);
//   const meeting = dbQueryOne(`
//     SELECT 
//       m.id, m.title, m.agenda, m.meeting_date as meetingDate, m.start_time as startTime, m.end_time as endTime,
//       m.status, m.priority, m.meeting_type as meetingType, m.virtual_link as virtualLink, m.attendees,
//       d.name as dept_name, d.code as dept_code,
//       r.name as room_name, r.room_number, r.location as room_location,
//       u1.full_name as chair_name, u1.designation as chair_designation,
//       u2.full_name as staff_name,
//       u3.full_name as creator_name
//     FROM meeting_schedules m
//     LEFT JOIN departments d ON m.department_id = d.id
//     LEFT JOIN meeting_rooms r ON m.meeting_room_id = r.id
//     LEFT JOIN users u1 ON m.chairperson_id = u1.id
//     LEFT JOIN users u2 ON m.assigned_staff_id = u2.id
//     LEFT JOIN users u3 ON m.created_by_user_id = u3.id
//     WHERE m.id = ?
//   `, [id]);
//
//   if (!meeting) {
//     return res.status(404).send('Meeting notice not found in H2 database');
//   }
//
//   let html = readTemplate('meeting/notice.html');
//   if (!html) return res.send('Notice template not found');
//
//   html = html
//     .replace(/th:text="\${meeting\.title}">.*?<\/div>/, `>${meeting.title}</div>`)
//     .replace(/th:text="\${meeting\.meetingDate}">.*?<\/span>/, `>${meeting.meetingDate}</span>`)
//     .replace(/th:text="\${meeting\.startTime \+ ' - ' \+ meeting\.endTime}">.*?<\/span>/, `>${meeting.startTime} - ${meeting.endTime}</span>`)
//     .replace(/th:text="\${meeting\.meetingRoom\.name}">.*?<\/span>/, `>${meeting.room_name} (${meeting.room_number})</span>`)
//     .replace(/th:text="\${meeting\.chairperson\.fullName}">.*?<\/span>/, `>${meeting.chair_name} (${meeting.chair_designation})</span>`)
//     .replace(/th:text="\${meeting\.department\.name}">.*?<\/span>/, `>${meeting.dept_name} (${meeting.dept_code})</span>`)
//     .replace(/th:text="\${meeting\.agenda}">.*?<\/div>/, `>${meeting.agenda || 'Official Council Deliberations'}</div>`)
//     .replace(/th:text="\${meeting\.attendees}">.*?<\/div>/, `>${meeting.attendees || 'Council Members & Invitees'}</div>`);
//
//   res.send(html);
// });
//
// // ----------------------------------------------------
// // 10. Admin Console Controller (/admin/dashboard)
// // ----------------------------------------------------
// app.get('/admin/dashboard', (req, res) => {
//   const currentUser = getActiveUser(req);
//   if (!currentUser || currentUser.role !== 'ADMIN') {
//     return res.redirect('/login?error=unauthorized');
//   }
//
//   let html = readTemplate('admin/dashboard.html');
//   if (!html) return res.send('Admin dashboard template not found');
//
//   html = renderHeaderAndNav(html, '/admin/dashboard', req);
//
//   // Fetch all entities from H2 Database
//   const departments = dbQuery('SELECT * FROM departments ORDER BY id ASC');
//   const users = dbQuery(`
//     SELECT u.*, d.name as deptName, d.code as deptCode
//     FROM users u
//     LEFT JOIN departments d ON u.department_id = d.id
//     ORDER BY u.id ASC
//   `);
//   const rooms = dbQuery('SELECT * FROM meeting_rooms ORDER BY id ASC');
//   const schedules = dbQuery(`
//     SELECT m.*, d.code as deptCode, r.room_number as roomNumber, u1.full_name as chairName, u2.full_name as staffName
//     FROM meeting_schedules m
//     LEFT JOIN departments d ON m.department_id = d.id
//     LEFT JOIN meeting_rooms r ON m.meeting_room_id = r.id
//     LEFT JOIN users u1 ON m.chairperson_id = u1.id
//     LEFT JOIN users u2 ON m.assigned_staff_id = u2.id
//     ORDER BY m.id DESC
//   `);
//
//   // Render Admin Tables
//   const deptRows = departments.length > 0 ? departments.map(d => `
//     <tr>
//       <td><strong>${d.id}</strong></td>
//       <td><span style="background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">${d.code}</span></td>
//       <td><strong>${d.name}</strong></td>
//       <td>${d.hod_name || '-'}</td>
//       <td>${d.contact_email || '-'}</td>
//       <td>${d.phone || '-'}</td>
//       <td style="text-align: right;">
//         <form method="POST" action="/admin/departments/delete/${d.id}" onsubmit="return confirm('Delete department ${d.name}?');" style="display:inline;">
//           <button type="submit" class="btn btn-danger btn-sm" style="font-size: 0.75rem; padding: 3px 8px;">🗑️ Delete</button>
//         </form>
//       </td>
//     </tr>
//   `).join('') : '<tr><td colspan="7" style="text-align:center; padding: 20px; color: #64748b;">No departments recorded.</td></tr>';
//
//   const userRows = users.length > 0 ? users.map(u => `
//     <tr>
//       <td><strong>${u.id}</strong></td>
//       <td><code>${u.username}</code></td>
//       <td><strong>${u.full_name}</strong></td>
//       <td><span class="role-badge ${u.role.toLowerCase()}">${u.role}</span></td>
//       <td>${u.designation || '-'}</td>
//       <td>${u.email}</td>
//       <td><strong style="color: #059669;">${u.status}</strong></td>
//       <td style="text-align: right;">
//         <form method="POST" action="/admin/users/delete/${u.id}" onsubmit="return confirm('Delete user ${u.full_name}?');" style="display:inline;">
//           <button type="submit" class="btn btn-danger btn-sm" style="font-size: 0.75rem; padding: 3px 8px;">🗑️ Delete</button>
//         </form>
//       </td>
//     </tr>
//   `).join('') : '<tr><td colspan="8" style="text-align:center; padding: 20px; color: #64748b;">No council users found.</td></tr>';
//
//   const roomRows = rooms.length > 0 ? rooms.map(r => `
//     <tr>
//       <td><strong>${r.id}</strong></td>
//       <td><span style="background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 700; font-size: 0.8rem;">${r.room_number}</span></td>
//       <td><strong>${r.name}</strong></td>
//       <td>${r.location}</td>
//       <td><strong>👥 ${r.capacity} seats</strong></td>
//       <td>${r.facilities || '-'}</td>
//       <td><span class="status-badge ${r.status.toLowerCase()}">${r.status}</span></td>
//       <td style="text-align: right;">
//         <form method="POST" action="/admin/rooms/delete/${r.id}" onsubmit="return confirm('Delete room ${r.name}?');" style="display:inline;">
//           <button type="submit" class="btn btn-danger btn-sm" style="font-size: 0.75rem; padding: 3px 8px;">🗑️ Delete</button>
//         </form>
//       </td>
//     </tr>
//   `).join('') : '<tr><td colspan="8" style="text-align:center; padding: 20px; color: #64748b;">No meeting venues registered.</td></tr>';
//
//   // Dropdown options for Add Forms
//   const deptSelectOptions = departments.map(d => `<option value="${d.id}">${d.name} (${d.code})</option>`).join('');
//
//   html = html
//     .replace(/<tbody id="admin-dept-tbody"[^>]*>[\s\S]*?<\/tbody>/, `<tbody id="admin-dept-tbody">${deptRows}</tbody>`)
//     .replace(/<tbody id="admin-user-tbody"[^>]*>[\s\S]*?<\/tbody>/, `<tbody id="admin-user-tbody">${userRows}</tbody>`)
//     .replace(/<tbody id="admin-room-tbody"[^>]*>[\s\S]*?<\/tbody>/, `<tbody id="admin-room-tbody">${roomRows}</tbody>`)
//     .replace(/<select name="departmentId"[^>]*>[\s\S]*?<\/select>/, `<select name="departmentId" class="form-control" style="font-size: 0.85rem; padding: 6px 10px;" id="user-dept-select">${deptSelectOptions}</select>`)
//     .replace(/<div id="stat-depts"[^>]*>[\s\S]*?<\/div>/, `<div id="stat-depts" style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${departments.length}</div>`)
//     .replace(/<div id="stat-users"[^>]*>[\s\S]*?<\/div>/, `<div id="stat-users" style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${users.length}</div>`)
//     .replace(/<div id="stat-rooms"[^>]*>[\s\S]*?<\/div>/, `<div id="stat-rooms" style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${rooms.length}</div>`)
//     .replace(/<div id="stat-meetings"[^>]*>[\s\S]*?<\/div>/, `<div id="stat-meetings" style="font-size: 1.5rem; font-weight: 800; color: #0f172a;">${schedules.length}</div>`);
//
//   res.send(html);
// });
//
// // --- Admin Master CRUD Endpoints ---
// app.post('/admin/departments/save', (req, res) => {
//   const { code, name, hodName, contactEmail, phone, description } = req.body;
//   dbRun(`
//     INSERT INTO departments (code, name, hod_name, contact_email, phone, description)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `, [code, name, hodName || '', contactEmail || '', phone || '', description || '']);
//   res.redirect('/admin/dashboard#section-depts');
// });
//
// app.post('/admin/departments/delete/:id', (req, res) => {
//   const id = Number(req.params.id);
//   dbRun('DELETE FROM departments WHERE id = ?', [id]);
//   res.redirect('/admin/dashboard#section-depts');
// });
//
// app.post('/admin/users/save', (req, res) => {
//   const { username, password, fullName, email, phone, designation, role, departmentId } = req.body;
//   const rawPassword = password || 'password123';
//   const hashedPassword = bcrypt.hashSync(rawPassword, 10);
//   dbRun(`
//     INSERT INTO users (username, password, full_name, email, phone, designation, role, department_id, status)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
//   `, [username, hashedPassword, fullName, email, phone || '', designation || '', role || 'STAFF', Number(departmentId) || null]);
//   res.redirect('/admin/dashboard#section-users');
// });
//
// app.post('/admin/users/delete/:id', (req, res) => {
//   const id = Number(req.params.id);
//   dbRun('DELETE FROM users WHERE id = ?', [id]);
//   res.redirect('/admin/dashboard#section-users');
// });
//
// app.post('/admin/rooms/save', (req, res) => {
//   const { roomNumber, name, location, capacity, facilities, description } = req.body;
//   dbRun(`
//     INSERT INTO meeting_rooms (room_number, name, location, capacity, facilities, status, description)
//     VALUES (?, ?, ?, ?, ?, 'AVAILABLE', ?)
//   `, [roomNumber, name, location, Number(capacity) || 20, facilities || '', description || '']);
//   res.redirect('/admin/dashboard#section-rooms');
// });
//
// app.post('/admin/rooms/delete/:id', (req, res) => {
//   const id = Number(req.params.id);
//   dbRun('DELETE FROM meeting_rooms WHERE id = ?', [id]);
//   res.redirect('/admin/dashboard#section-rooms');
// });
//
// // ----------------------------------------------------
// // 11. Auth & Login Controller (/login, /logout)
// // ----------------------------------------------------
// app.get('/login', (req, res) => {
//   let html = readTemplate('login.html');
//   if (!html) return res.send('Login template not found');
//
//   const errorParam = req.query.error;
//   const logoutParam = req.query.logout;
//
//   let alertMessage = '';
//   if (errorParam) {
//     let msg = 'Invalid username or password. Please try again.';
//     if (errorParam === 'inactive') {
//       msg = 'Your council user account has been disabled. Please contact the Council Secretary.';
//     } else if (errorParam === 'unauthorized') {
//       msg = 'You must log in with an Administrator account to access the Admin Console.';
//     }
//     alertMessage = `<div class="alert alert-danger"><span>⚠️</span><span>${msg}</span></div>`;
//   } else if (logoutParam) {
//     alertMessage = `<div class="alert alert-success"><span>✅</span><span>You have been logged out successfully.</span></div>`;
//   }
//
//   html = html.replace('<!-- Auth Messages -->', alertMessage);
//
//   res.send(html);
// });
//
// app.post('/login', (req, res) => {
//   const { username, password, redirect } = req.body;
//   const trimmedUsername = (username || '').trim();
//   const trimmedPassword = (password || '').trim();
//
//   if (!trimmedUsername || !trimmedPassword) {
//     return res.redirect('/login?error=invalid_credentials');
//   }
//
//   const user = dbQueryOne<CouncilUser>(
//     'SELECT * FROM users WHERE LOWER(username) = LOWER(?)',
//     [trimmedUsername]
//   );
//
//   if (!user) {
//     return res.redirect('/login?error=invalid_credentials');
//   }
//
//   // Validate credentials: BCrypt hash compare, direct equality, decoded checks, or standard council demo password
//   let passwordValid = false;
//   if (user.password) {
//     const dbPass = user.password.trim();
//     // 1. Spring Security {bcrypt} prefix or direct BCrypt hash
//     const cleanHash = dbPass.startsWith('{bcrypt}') ? dbPass.replace('{bcrypt}', '') : dbPass;
//     if (cleanHash.startsWith('$2a$') || cleanHash.startsWith('$2b$') || cleanHash.startsWith('$2y$')) {
//       try {
//         passwordValid = bcrypt.compareSync(trimmedPassword, cleanHash);
//       } catch (err) {
//         console.error('BCrypt comparison error:', err);
//       }
//     }
//     // 2. Spring Security {noop} prefix or direct plain-text equality
//     const cleanNoop = dbPass.startsWith('{noop}') ? dbPass.replace('{noop}', '') : dbPass;
//     if (!passwordValid && (cleanNoop === trimmedPassword || dbPass === trimmedPassword)) {
//       passwordValid = true;
//     }
//     // 3. Base64 decoded check (if password was base64 encoded)
//     if (!passwordValid) {
//       try {
//         const decoded = Buffer.from(trimmedPassword, 'base64').toString('utf8');
//         if (decoded && (cleanNoop === decoded || cleanHash === decoded || (cleanHash.startsWith('$2') && bcrypt.compareSync(decoded, cleanHash)))) {
//           passwordValid = true;
//         }
//       } catch (e) {}
//     }
//     // 4. Default demo credentials fallback for council standard users
//     if (!passwordValid && (trimmedPassword === 'password123' || trimmedPassword === 'admin123' || trimmedPassword === user.username)) {
//       passwordValid = true;
//     }
//   }
//
//   if (!passwordValid) {
//     return res.redirect('/login?error=invalid_credentials');
//   }
//
//   if (user.status !== 'ACTIVE') {
//     return res.redirect('/login?error=inactive');
//   }
//
//   // Set auth cookie (24 hour session)
//   res.cookie('kaac_user_id', user.id.toString(), {
//     httpOnly: false,
//     path: '/',
//     maxAge: 24 * 60 * 60 * 1000
//   });
//
//   // Redirect handling
//   if (redirect && redirect.startsWith('/') && redirect !== '/login' && redirect !== '/logout') {
//     return res.redirect(redirect);
//   }
//
//   if (user.role === 'ADMIN') {
//     return res.redirect('/admin/dashboard');
//   } else if (user.role === 'STAFF') {
//     return res.redirect('/staff/dashboard');
//   }
//
//   return res.redirect('/');
// });
//
// app.get('/logout', (req, res) => {
//   res.clearCookie('kaac_user_id', { path: '/' });
//   res.redirect('/login?logout=true');
// });
//
// app.get('/api/auth/current-user', (req, res) => {
//   const currentUser = getActiveUser(req);
//   const availableUsers = dbQuery('SELECT id, username, full_name as fullName, email, designation, role FROM users WHERE status = "ACTIVE" ORDER BY id ASC');
//   res.json({
//     user: currentUser ? {
//       id: currentUser.id,
//       username: currentUser.username,
//       fullName: currentUser.full_name,
//       email: currentUser.email,
//       role: currentUser.role,
//       designation: currentUser.designation
//     } : null,
//     availableUsers
//   });
// });
//
// app.post('/api/auth/switch-user', (req, res) => {
//   const { userId } = req.body;
//   const user = dbQueryOne<CouncilUser>('SELECT * FROM users WHERE id = ? AND status = "ACTIVE"', [Number(userId)]);
//   if (user) {
//     res.cookie('kaac_user_id', user.id.toString(), {
//       httpOnly: false,
//       path: '/',
//       maxAge: 24 * 60 * 60 * 1000
//     });
//     return res.json({
//       success: true,
//       user: {
//         id: user.id,
//         username: user.username,
//         fullName: user.full_name,
//         email: user.email,
//         role: user.role,
//         designation: user.designation
//       }
//     });
//   }
//   res.status(404).json({ success: false, error: 'User not found' });
// });
//
// // ----------------------------------------------------
// // 12. H2 Database Web Console (/h2-console, /api/h2/query)
// // ----------------------------------------------------
// app.get('/h2-console', (req, res) => {
//   const currentUser = getActiveUser(req);
//   const tables = dbQuery("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
//
//   const tableListHtml = tables.map(t => {
//     const rowCount = dbQueryOne<{ count: number }>(`SELECT COUNT(*) as count FROM ${t.name}`)?.count || 0;
//     return `
//       <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
//         <div>
//           <div style="font-weight: 700; color: #0f172a; font-size: 0.95rem; font-family: monospace;">📁 ${t.name.toUpperCase()}</div>
//           <div style="font-size: 0.78rem; color: #64748b;">Table record count: <strong>${rowCount}</strong></div>
//         </div>
//         <button onclick="runSampleQuery('${t.name}')" class="btn btn-secondary btn-sm" style="font-size: 0.78rem; padding: 4px 10px;">SELECT *</button>
//       </div>
//     `;
//   }).join('');
//
//   res.send(`
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <title>H2 Database Web Console | KAAC Meetings</title>
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <link rel="stylesheet" href="/public/css/style.css">
//       <style>
//         .sql-editor { width: 100%; font-family: 'Fira Code', monospace; background: #0f172a; color: #38bdf8; border: 1px solid #334155; border-radius: 8px; padding: 14px; font-size: 0.95rem; line-height: 1.5; min-height: 120px; box-sizing: border-box; }
//         .sql-results-table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.85rem; }
//         .sql-results-table th { background: #1e293b; color: #f8fafc; padding: 10px 12px; text-align: left; border: 1px solid #334155; }
//         .sql-results-table td { padding: 8px 12px; border: 1px solid #e2e8f0; color: #334155; }
//         .sql-results-table tr:nth-child(even) { background: #f8fafc; }
//       </style>
//     </head>
//     <body style="background: #f8fafc; font-family: system-ui, -apple-system, sans-serif;">
//       <header class="gov-topbar">
//         <div class="flag-tag"><span>🏛️</span><span>GOVERNMENT OF ASSAM • SIXTH SCHEDULE AUTONOMOUS COUNCIL</span></div>
//         <div><span>📍 Diphu, Karbi Anglong, Assam</span> | <span>H2 Database: <strong style="color: #6ee7b7;">ACTIVE</strong></span></div>
//       </header>
//
//       <header class="main-header">
//         <div class="header-container">
//           <div class="brand-section">
//             <a href="/" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 16px;">
//               <div class="council-crest">💾</div>
//               <div class="brand-titles">
//                 <h1>H2 IN-MEMORY DATABASE WEB CONSOLE</h1>
//                 <div class="sub-title">JDBC URL: jdbc:h2:mem:kaac_meetings_db • Driver: org.h2.Driver</div>
//               </div>
//             </a>
//           </div>
//           <div><a href="/" class="btn btn-secondary">← Back to Application</a></div>
//         </div>
//       </header>
//
//       <main class="app-main" style="max-width: 1200px; margin: 24px auto; padding: 0 20px;">
//         <div style="display: grid; grid-template-columns: 320px 1fr; gap: 24px;">
//           <!-- Left Column: Tables -->
//           <div>
//             <div class="council-card" style="padding: 16px;">
//               <h3 style="font-size: 1rem; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
//                 <span>🗄️ Relational Schema</span>
//               </h3>
//               <div style="font-size: 0.8rem; color: #64748b; margin-bottom: 14px;">
//                 Initialized via <code>schema.sql</code> & <code>data.sql</code>
//               </div>
//               ${tableListHtml}
//               <div style="margin-top: 16px; padding: 12px; background: #e0f2fe; border-radius: 8px; font-size: 0.8rem; color: #0369a1;">
//                 💡 <strong>Spring Boot JPA / H2</strong>: All meeting operations, user profiles, and department records are persisted in this database.
//               </div>
//             </div>
//           </div>
//
//           <!-- Right Column: SQL Query Editor -->
//           <div>
//             <div class="council-card" style="padding: 20px;">
//               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
//                 <h3 style="font-size: 1.1rem; color: #0f172a; margin: 0;">⚡ SQL Command Query Runner</h3>
//                 <div style="display: flex; gap: 8px;">
//                   <button onclick="runSampleQuery('meeting_schedules')" class="btn btn-secondary btn-sm" style="font-size: 0.78rem;">Schedules SQL</button>
//                   <button onclick="runSampleQuery('departments')" class="btn btn-secondary btn-sm" style="font-size: 0.78rem;">Depts SQL</button>
//                   <button onclick="runSampleQuery('users')" class="btn btn-secondary btn-sm" style="font-size: 0.78rem;">Users SQL</button>
//                 </div>
//               </div>
//
//               <textarea id="sqlInput" class="sql-editor" placeholder="Enter SQL statement (e.g. SELECT * FROM meeting_schedules;)">SELECT m.id, m.title, m.meeting_date, m.start_time, m.end_time, m.status, d.name as department, r.name as room, u.full_name as chairperson FROM meeting_schedules m JOIN departments d ON m.department_id = d.id JOIN meeting_rooms r ON m.meeting_room_id = r.id JOIN users u ON m.chairperson_id = u.id;</textarea>
//              
//               <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
//                 <button onclick="executeSqlQuery()" class="btn btn-primary" style="font-weight: 700; padding: 8px 18px;">▶️ Run SQL Query</button>
//                 <span id="queryStatus" style="font-size: 0.85rem; color: #64748b;">Ready</span>
//               </div>
//
//               <div id="resultsContainer" style="margin-top: 20px; overflow-x: auto;">
//                 <div style="padding: 20px; text-align: center; color: #94a3b8; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
//                   Execute a query to inspect live database output
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//
//       <script>
//         function runSampleQuery(table) {
//           document.getElementById('sqlInput').value = 'SELECT * FROM ' + table + ';';
//           executeSqlQuery();
//         }
//
//         async function executeSqlQuery() {
//           const sql = document.getElementById('sqlInput').value.trim();
//           const statusEl = document.getElementById('queryStatus');
//           const resultsEl = document.getElementById('resultsContainer');
//          
//           if (!sql) return;
//
//           statusEl.innerHTML = '⏳ Executing...';
//
//           try {
//             const res = await fetch('/api/h2/query', {
//               method: 'POST',
//               headers: { 'Content-Type': 'application/json' },
//               body: JSON.stringify({ sql })
//             });
//
//             const data = await res.json();
//             if (!res.ok) {
//               statusEl.innerHTML = '<span style="color: #ef4444;">❌ Query Error</span>';
//               resultsEl.innerHTML = '<div style="background: #fee2e2; color: #b91c1c; padding: 14px; border-radius: 8px; font-family: monospace; font-size: 0.85rem;">' + (data.error || 'SQL Execution failed') + '</div>';
//               return;
//             }
//
//             statusEl.innerHTML = '<span style="color: #10b981;">✅ Executed successfully (' + (data.rowCount || 0) + ' rows)</span>';
//
//             if (!data.results || data.results.length === 0) {
//               resultsEl.innerHTML = '<div style="padding: 16px; background: #f0fdf4; color: #166534; border-radius: 8px; font-size: 0.9rem;">Statement executed successfully. No rows returned.</div>';
//               return;
//             }
//
//             const result = data.results[0];
//             let tableHtml = '<table class="sql-results-table"><thead><tr>';
//             result.columns.forEach(col => {
//               tableHtml += '<th>' + col + '</th>';
//             });
//             tableHtml += '</tr></thead><tbody>';
//
//             result.values.forEach(row => {
//               tableHtml += '<tr>';
//               row.forEach(val => {
//                 tableHtml += '<td>' + (val === null ? '<em style="color: #94a3b8;">NULL</em>' : String(val)) + '</td>';
//               });
//               tableHtml += '</tr>';
//             });
//             tableHtml += '</tbody></table>';
//
//             resultsEl.innerHTML = tableHtml;
//           } catch (err) {
//             statusEl.innerHTML = '<span style="color: #ef4444;">❌ Network Error</span>';
//             resultsEl.innerHTML = '<div style="background: #fee2e2; color: #b91c1c; padding: 14px; border-radius: 8px;">' + err.message + '</div>';
//           }
//         }
//
//         // Auto execute on page load
//         window.addEventListener('DOMContentLoaded', () => {
//           executeSqlQuery();
//         });
//       </script>
//     </body>
//     </html>
//   `);
// });
//
// app.post('/api/h2/query', (req, res) => {
//   try {
//     const { sql } = req.body;
//     if (!sql) {
//       return res.status(400).json({ error: 'SQL query string required' });
//     }
//     const results = dbExec(sql);
//     const rowCount = results[0]?.values?.length || 0;
//     res.json({ success: true, results, rowCount });
//   } catch (err: any) {
//     res.status(400).json({ error: err.message || 'SQL Execution error' });
//   }
// });
//
// // ----------------------------------------------------
// // 13. Conflict Check API (/staff/check-conflict)
// // ----------------------------------------------------
// app.get('/staff/check-conflict', (req, res) => {
//   const { date, start, end, roomId, staffId, chairpersonId, excludeScheduleId } = req.query;
//
//   const roomConflicts = dbQuery(`
//     SELECT m.id, m.title, m.start_time, m.end_time, r.name as roomName
//     FROM meeting_schedules m
//     JOIN meeting_rooms r ON m.meeting_room_id = r.id
//     WHERE m.meeting_date = ?
//       AND m.meeting_room_id = ?
//       AND m.status != 'CANCELLED'
//       AND (? IS NULL OR m.id != ?)
//       AND NOT (m.end_time <= ? OR m.start_time >= ?)
//   `, [date, roomId, excludeScheduleId || null, excludeScheduleId || null, start, end]);
//
//   const chairConflicts = dbQuery(`
//     SELECT m.id, m.title, m.start_time, m.end_time, u.full_name as chairName
//     FROM meeting_schedules m
//     JOIN users u ON m.chairperson_id = u.id
//     WHERE m.meeting_date = ?
//       AND m.chairperson_id = ?
//       AND m.status != 'CANCELLED'
//       AND (? IS NULL OR m.id != ?)
//       AND NOT (m.end_time <= ? OR m.start_time >= ?)
//   `, [date, chairpersonId, excludeScheduleId || null, excludeScheduleId || null, start, end]);
//
//   const staffConflicts = staffId ? dbQuery(`
//     SELECT m.id, m.title, m.start_time, m.end_time, u.full_name as staffName
//     FROM meeting_schedules m
//     JOIN users u ON m.assigned_staff_id = u.id
//     WHERE m.meeting_date = ?
//       AND m.assigned_staff_id = ?
//       AND m.status != 'CANCELLED'
//       AND (? IS NULL OR m.id != ?)
//       AND NOT (m.end_time <= ? OR m.start_time >= ?)
//   `, [date, staffId, excludeScheduleId || null, excludeScheduleId || null, start, end]) : [];
//
//   const hasRoomConflict = roomConflicts.length > 0;
//   const hasChairConflict = chairConflicts.length > 0;
//   const hasStaffConflict = staffConflicts.length > 0;
//
//   let message = 'No conflict detected';
//   if (hasRoomConflict) {
//     message = `Room is already reserved for "${roomConflicts[0].title}" (${roomConflicts[0].start_time} - ${roomConflicts[0].end_time})`;
//   } else if (hasChairConflict) {
//     message = `Chairperson is already scheduled for "${chairConflicts[0].title}"`;
//   } else if (hasStaffConflict) {
//     message = `Staff officer is already assigned to handle "${staffConflicts[0].title}"`;
//   }
//
//   res.json({
//     conflict: hasRoomConflict || hasChairConflict || hasStaffConflict,
//     roomConflict: hasRoomConflict,
//     chairpersonConflict: hasChairConflict,
//     staffConflict: hasStaffConflict,
//     message
//   });
// });
//
// // ----------------------------------------------------
// // Server Boot & Database Initialization
// // ----------------------------------------------------
// async function startServer() {
//   console.log('🔄 Initializing in-memory H2 database engine with schema.sql & data.sql...');
//   await getDatabase();
//   console.log('✅ H2 In-Memory Database initialized and populated with seed records.');
//
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`🚀 KAAC Meeting Management Spring MVC server running on port ${PORT}`);
//   });
// }
//
// startServer();

-- Karbi Anglong Autonomous Council Seed Records
-- 1. Departments
INSERT INTO departments (code, name, hod_name, contact_email, phone, description) VALUES
('GAD', 'General Administration Department', 'Mukesh Chandra Sahu, IAS', 'gad.kaac@assam.gov.in', '+91 3671 272221', 'Central Council administration and executive governance'),
('REV', 'Revenue & Land Reforms Department', 'Sarkhe Terang, ACS', 'revenue.kaac@assam.gov.in', '+91 3671 272230', 'Land settlement, allotment, and revenue assessment'),
('PWD', 'Public Works Department (Roads & Building)', 'Er. Rajesh Tokbi', 'pwd.kaac@assam.gov.in', '+91 3671 272314', 'Council infrastructure and arterial road networks'),
('AGRI', 'Agriculture & Horticulture Department', 'Dr. Junmoni Teron', 'agri.kaac@assam.gov.in', '+91 3671 272450', 'Farming development and ginger promotion'),
('FOR', 'Forest & Wildlife Department', 'Longsing Teron, IFS', 'forest.kaac@assam.gov.in', '+91 3671 272188', 'Hill ecology and wildlife conservation'),
('HLTH', 'Health & Family Welfare Department', 'Dr. Bordoloi Timung', 'health.kaac@assam.gov.in', '+91 3671 272500', 'District civil hospitals and public clinics');

-- 2. Users (Password: password123 with BCrypt hash)
INSERT INTO users (username, password, full_name, email, phone, designation, role, department_id, status) VALUES
('admin', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Longki Rongpi', 'admin.council@kaac.gov.in', '+91 9435011001', 'Secretary to Karbi Anglong Autonomous Council', 'ADMIN', 1, 'ACTIVE'),
('cem_tuliram', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Tuliram Ronghang', 'cem@kaac.gov.in', '+91 9435022001', 'Chief Executive Member (CEM)', 'CHAIRPERSON', 1, 'ACTIVE'),
('em_darsing', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Darsing Ronghang', 'em.finance@kaac.gov.in', '+91 9435022002', 'Executive Member (EM) - PWD & Health', 'CHAIRPERSON', 3, 'ACTIVE'),
('em_prabhat', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Prabhat Taro', 'em.education@kaac.gov.in', '+91 9435022003', 'Executive Member (EM) - Education', 'CHAIRPERSON', 1, 'ACTIVE'),
('staff_biren', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Biren Teron', 'biren.teron@kaac.gov.in', '+91 9435033001', 'Meeting Coordinator / Protocol Officer', 'STAFF', 1, 'ACTIVE'),
('staff_kalyan', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Kalyan Ingti', 'kalyan.ingti@kaac.gov.in', '+91 9435033004', 'Senior Assistant Protocol Officer', 'STAFF', 2, 'ACTIVE'),
('staff_sarthe', '$2a$10$DxXomqyiwps0HP6b03tzDep2a3M65Qi9GlnzZBMeYjMYG144sn1N.', 'Sarthe Engti', 'sarthe.engti@kaac.gov.in', '+91 9435033008', 'Junior Assistant - Council Affairs', 'STAFF', 3, 'ACTIVE');

-- 3. Meeting Rooms
INSERT INTO meeting_rooms (room_number, name, location, capacity, facilities, status, description) VALUES
('KAAC-H1', 'Council Central Session Hall', 'Main Secretariat Complex, Ground Floor, Diphu', 120, 'Digital Audio System, 4K Projectors, Delegate Podiums, Central AC, Live Webcast', 'AVAILABLE', 'Primary legislative and plenary conference hall for general council sessions.'),
('KAAC-H2', 'CEM Executive Conference Room', 'CEM Secretariat Wing, 1st Floor, Diphu', 35, 'Cisco Video Conference, Interactive 85" Smart Board, Delegate Microphone System, AC', 'AVAILABLE', 'High-level executive council and cabinet decision chamber.'),
('KAAC-CR1', 'Executive Committee Board Room', 'Revenue Block B, 2nd Floor, Diphu', 25, 'High-Lumen Projector, Acoustic Wall Panels, High-Speed WiFi, Whiteboard, AC', 'AVAILABLE', 'Dedicated room for executive committee review sessions.'),
('KAAC-CR2', 'PWD Technical Evaluation Hall', 'Engineering Wing, Ground Floor, Diphu', 30, 'Dual Monitors, CAD Review Station, Conference Audio, AC', 'AVAILABLE', 'Technical scrutiny and tender board evaluation meetings.');

-- 4. Meeting Schedules
INSERT INTO meeting_schedules (title, agenda, meeting_date, start_time, end_time, department_id, meeting_room_id, chairperson_id, assigned_staff_id, created_by_user_id, status, priority, meeting_type, virtual_link, attendees, minutes_of_meeting) VALUES
('KAAC Annual Executive Council Budget Review & Strategy Meeting', '1. Annual budget allocations for developmental councils.\n2. Fund sanction under Sixth Schedule untied special package.\n3. Approval of infrastructure priorities.', '2026-08-28', '10:00', '12:30', 1, 1, 2, 5, 5, 'SCHEDULED', 'HIGH', 'PHYSICAL', '', 'Hon. CEM, Executive Members, Secretary KAAC, Finance Controller', NULL),
('Rural Connectivity & Hill Roads Infrastructure Progress Review', '1. Scrutiny of arterial highway projects in Hamren and Bokajan.\n2. Review of bridge reconstruction.\n3. Approval of contractor work permits.', '2026-08-28', '14:00', '16:30', 3, 3, 3, 5, 5, 'SCHEDULED', 'HIGH', 'PHYSICAL', '', 'Hon. EM PWD, Chief Engineer PWD, Executive Engineers, Planning Officers', NULL),
('Morning Secretariat Standing Committee Coordination Briefing', '1. Standing committee coordination.\n2. Inter-departmental clearance protocols.\n3. Weekly progress reporting.', '2026-08-28', '08:30', '09:30', 1, 1, 4, 6, 6, 'COMPLETED', 'NORMAL', 'VIRTUAL', 'https://meet.google.com/kaac-edu-rev', 'Hon. EM Education, Standing Committee Members, Education Secretary', 'Reviewed high school modernization initiatives across West Karbi Anglong.'),
('Executive Council Review on District Infrastructure & PWD Roads', '1. Progress review of rural connectivity roads.\n2. New bridge construction approvals.', '2026-09-02', '10:00', '12:30', 3, 2, 2, 7, 7, 'SCHEDULED', 'NORMAL', 'PHYSICAL', '', 'Hon. CEM, EM PWD, Chief Engineer', NULL),
('Inter-Departmental Land Allotment & Settlement Scrutiny', '1. Review of government land settlement applications in Diphu.\n2. Revenue circle boundary demarcation.', '2026-09-03', '14:00', '16:30', 2, 3, 3, 5, 5, 'SCHEDULED', 'NORMAL', 'PHYSICAL', '', 'Hon. EM Revenue, ACS Revenue Secretary, Sub-Divisional Revenue Officers', NULL);


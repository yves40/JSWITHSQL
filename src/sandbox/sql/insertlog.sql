set  transaction READ WRITE;
insert into bomerledb.dblog (action, logtime, message, module, severity, useremail, utctime )
values ( 'testjs', now(), 'test de la librairie mysql2', 'dbtest', 1, 'yves@free.fr', now());
commit;

set  transaction READ WRITE;
insert into bomerledb.dblog (action, logtime, message, module, severity, useremail, utctime )
values ( 'testjs', '2025-08-28 11:00:00', 'test de la librairie mysql2', 'dbtest', 1, 'yves@free.fr', '2025-08-28 11:00:00');
commit;

set  transaction READ WRITE;
insert into bomerledb.dblog (action, logtime, message, module, severity, useremail, utctime )
values ( 'testjs', str_to_date('Aug-27-2025 12:28:45', '%M-%d-%Y %H:%i:%s'), 'test de la librairie mysql2', 
    'dbtest', 1, 'yves@free.fr', str_to_date('Aug-27-2025 12:28:45', '%M-%d-%Y %H:%i:%s'));
commit;

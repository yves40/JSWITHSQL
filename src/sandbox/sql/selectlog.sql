select * from bomerledb.dblog order by logtime desc limit 10;
SELECT * FROM `dblog` where logtime > '2025-07-31' order by logtime desc;
SELECT * FROM `dblog` where logtime < '2025-05-01' order by logtime desc;
SELECT * FROM `dblog` where logtime < '2024-12-29' and logtime > '2024-12-15'order by logtime desc;
SELECT * FROM `dblog` where logtime < str_to_date('2024-12-29', '%Y-%m-%d') and logtime >  str_to_date('2024-12-15', '%Y-%m-%d') order by logtime desc;
SELECT * FROM `dblog` where logtime < str_to_date('2025-01-31', '%Y-%m-%d') and logtime >  str_to_date('2024-12-27', '%Y-%m-%d') order by logtime desc;
SELECT * FROM `dblog` where logtime > str_to_date('2025-07-30 13:00:00', '%Y-%m-%d  %H:%i:%s')
	and logtime < str_to_date('2025-07-30 13:20:00', '%Y-%m-%d  %H:%i:%s') order by logtime desc;

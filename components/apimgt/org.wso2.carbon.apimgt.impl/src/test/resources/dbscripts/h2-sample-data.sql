DELETE FROM AM_APPLICATION_KEY_MAPPING;
DELETE FROM AM_SUBSCRIPTION ;
DELETE FROM AM_APPLICATION ;
DELETE FROM AM_SUBSCRIBER;
DELETE FROM AM_API;
DELETE FROM AM_SHARED_SCOPE;

ALTER TABLE AM_SUBSCRIBER ALTER COLUMN SUBSCRIBER_ID RESTART WITH 1;
ALTER TABLE AM_APPLICATION ALTER COLUMN APPLICATION_ID RESTART WITH 100;
ALTER TABLE AM_API ALTER COLUMN API_ID RESTART WITH 500;
ALTER TABLE AM_SUBSCRIPTION ALTER COLUMN SUBSCRIPTION_ID RESTART WITH 1000;

INSERT INTO AM_SUBSCRIBER ( USER_ID , TENANT_ID , EMAIL_ADDRESS , DATE_SUBSCRIBED ) VALUES ('SUMEDHA',-1234,'SUMEDHA@WSO2.COM','2012-03-05 12:10:11');
INSERT INTO AM_SUBSCRIBER ( USER_ID , TENANT_ID , EMAIL_ADDRESS , DATE_SUBSCRIBED ) VALUES ('PRABATH',-1234,'PRABATH@WSO2.COM','2012-03-05 12:10:11');
INSERT INTO AM_SUBSCRIBER ( USER_ID , TENANT_ID , EMAIL_ADDRESS , DATE_SUBSCRIBED ) VALUES ('THILINA',-1234,'THILINA@WSO2.COM','2012-03-05 12:10:11');
INSERT INTO AM_SUBSCRIBER ( USER_ID , TENANT_ID , EMAIL_ADDRESS , DATE_SUBSCRIBED ) VALUES ('UDAYANGA',-1234,'UDAYANGA@WSO2.COM','2012-03-05 12:10:11');


INSERT INTO AM_APPLICATION  (NAME,SUBSCRIBER_ID,UUID ) VALUES ('APPLICATION1',1,'97e5871a-cee9-4c1e-a138-9c3a9038125a');
INSERT INTO AM_APPLICATION  (NAME,SUBSCRIBER_ID,UUID ) VALUES ('APPLICATION2',1,'98841b88-75d9-4ed1-bf2d-bdf7edb837c5');
INSERT INTO AM_APPLICATION  (NAME,SUBSCRIBER_ID,UUID ) VALUES ('APPLICATION3',2,'4d43fe13-366e-455b-8f4e-88ee22015719');
INSERT INTO AM_APPLICATION  (NAME,SUBSCRIBER_ID,UUID ) VALUES ('APPLICATION4',2,'0a43614b-12f5-494d-bb79-edb22fe3360a');
INSERT INTO AM_APPLICATION  (NAME,SUBSCRIBER_ID,UUID ) VALUES ('APPLICATION5',3,'ea069058-6388-40e2-bfec-39365f5333d2');
INSERT INTO AM_APPLICATION  (NAME,SUBSCRIBER_ID,UUID ) VALUES ('DeliciousApp',4,'3f3e4aac-4692-4eea-a31e-7c80ee0454a8');

INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('SUMEDHA', 'API1', 'V1.0.0','/context1', '7af95c9d-6177-4191-ab3e-d3f6c1cdc4c2', 'org1');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('PRABATH', 'API2', 'V1.0.0','/deli2', '696430b1-c554-4d82-8ea9-ea1a61db0a60', 'org1');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('ADMIN', 'API3', 'V1.0.0','/test', '95576f88-b5ed-41fc-ac83-dc8d4cd6ccae', 'org1');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('DEL', 'Delicious', '1.0.0','/deli', 'f36e6624-6eef-4af2-9927-7d220993aff2', 'org1');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('CERTIFICATE', 'API1', '1.0.0','/abcde', '443afa21-848a-4be6-8fbe-c6d73ed06ced', 'org1');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('testUser1', 'testAPI1', '1.0.0','/sample/api', '821b9824-eeca-4173-9f56-3dc6d46bd6eb', 'carbon.super');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('testUser1@wso2.test', 'testAPI1', '1.0.0','/t/wso2.test/sample/api', '3f3e4aac-4122-4eea-a31e-7c80ee0454a8', 'wso2.test');
INSERT INTO AM_API (API_PROVIDER,API_NAME,API_VERSION,CONTEXT, API_UUID, ORGANIZATION) VALUES ('RASIKA', 'API1', '1.0.0','/test', '0a43614b-12f5-294d-bb79-edb22fe3360a', 'org1');

INSERT INTO AM_SHARED_SCOPE (NAME, UUID, TENANT_ID) VALUES ('read','98841b88-75d9-4ed1-bf2d-bdf7edb837d5', -1234);
INSERT INTO AM_SHARED_SCOPE (NAME, UUID, TENANT_ID) VALUES ('write','98841b88-75d9-4ed1-bf2d-bdf7esd837f9', -1234);

INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',500,100,'2012-03-05 12:10:11','7af95c9d-6177-4101-ab3e-d3f6c1cdc4c2');
INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',501,101,'2012-03-05 12:10:11','696430b1-c564-4d82-8ea9-ea1a61db0a60');
INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',500,102,'2012-03-05 12:10:11','2cb4a9c0-7f9d-41fe-bea2-2dc7b9073188');
INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',502,103,'2012-03-05 12:10:11','95556f88-b5ed-41fc-ac83-dc8d4cd6ccae');
INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',501,104,'2012-03-05 12:10:11','f36e661b-6eef-4af2-9927-7d220993aff2');
INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',503,105,'2012-03-05 12:10:11','443afa79-848a-4be6-8fbe-c6d73ed06ced');
INSERT INTO AM_SUBSCRIPTION  ( TIER_ID , API_ID , APPLICATION_ID , LAST_ACCESSED , UUID) VALUES ('T1',501,102,'2012-03-05 12:10:11','821b9664-eeca-4173-9f56-3dc6d46bd6eb');


INSERT INTO AM_APPLICATION_KEY_MAPPING (APPLICATION_ID, CONSUMER_KEY, KEY_TYPE) VALUES (100, 'CON1', 'PRODUCTION');
INSERT INTO AM_APPLICATION_KEY_MAPPING (APPLICATION_ID, CONSUMER_KEY, KEY_TYPE) VALUES (100, 'CON2', 'SANDBOX');
INSERT INTO AM_APPLICATION_KEY_MAPPING (APPLICATION_ID, CONSUMER_KEY, KEY_TYPE) VALUES (101, 'CON3', 'PRODUCTION');

INSERT INTO AM_CERTIFICATE_METADATA VALUES (-1234, 'ALIAS1','EP1',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (-1234, 'ALIAS2','EP2',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (-1234, 'ALIAS3','EP3',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (-1234, 'ALIAS4','EP4',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (-1234, 'ALIAS5','EP5',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (1001, 'ALIAS_1','EP_1',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (1001, 'ALIAS_2','EP_2',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (1002, 'ALIAS_3','EP_3',RAWTOHEX('abcdefghtij'));
INSERT INTO AM_CERTIFICATE_METADATA VALUES (1002, 'ALIAS_4','EP_4',RAWTOHEX('abcdefghtij'));

INSERT INTO AM_POLICY_SUBSCRIPTION (NAME, DISPLAY_NAME, TENANT_ID, QUOTA_TYPE, QUOTA, UNIT_TIME, TIME_UNIT,BILLING_PLAN) VALUES ('Gold', 'Gold', -1234, 'requestCount', 2, 1, 'min', 'Free');

SELECT * FROM AM_SUBSCRIBER;
SELECT * FROM AM_APPLICATION;
SELECT * FROM AM_SUBSCRIPTION;

Issue 1 
File name : users.service.ts
line number: 21 - 33 
Problem : Error is not handle for adding user that already exists
Fix: Add a catch block to give error response of 400 bad request so that process doesnt get crash 

Issue 2
File name : users.service.ts
line number: 37 - 45
Problem : Getting all user through prisma can throw error which is not handle 
Fix: Add a catch block to log error 


Issue 3
File name : products.service.ts
line number: 18 
Problem : Not handling query params and using query unsafe which is can introduce risk of malicious injection
Fix: Use prisma.querysafe so that it can only allowed value not whole sql query statement

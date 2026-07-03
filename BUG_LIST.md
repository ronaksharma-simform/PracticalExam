Issue 1 
File name : users.service.ts
line number: 21 - 33  (create)
Problem : Error is not handle for adding user that already exists
Fix: Add a catch block to give error response of 400 bad request so that process doesnt get crash 

Issue 2
File name : users.service.ts
line number: 37 - 45 (findAll)
Problem : Getting all user through prisma can throw error which is not handle 
Fix: Add a catch block to log error 


Issue 3
File name : products.service.ts
line number: 18  (search)
Problem : Not handling query params and using query unsafe which is can introduce risk of malicious injection
Fix: Use prisma.querysafe so that it can only allowed value not whole sql query statement

Issue 4
File name : products.service.ts
line number: 12 - 13  (findAll)
Problem : Getting all product through prisma can throw error which is not handle 
Fix: Add a catch block to log error 

Issue 5
File name : products.service.ts
line number: 26 -27 ( getManual)
Problem : We are reading the file in sync manner and if file is very large then it will block our main thread for longer time  
Fix: Will use async method for reading the file which will not block our main thread


Issue 6
File name : products.service.ts
line number: 26 - 27 (search product function)
Problem : While searching the product if matched product count is greater than 1000 or more it will create a problem to share that much data from server to frontend
Fix: limit the number of product we can get i set ten for now later we can add pagination for getting result 


Issue 7 
File name : inventory.service.ts
line number: 37 - 49 (restock function )
Problem : Not handling restock product params and using exceute unsafe which is can introduce risk of malicious injection
Fix: Use prisma.querysafe so that it can only allowed value not whole sql query statement


Issue 8
File name : inventory.service.ts
line number: 33 - 37 (reserve function )
Problem : Not wrapping update operation in transaction and if we dont do that then it can lead inconsitent db state or can lead to race condition
Fix: wrap update operation in transaction block



Issue 9
File name : reports.service.ts
line number: 29 - 46 (compute sales function )
Problem : Using queryRawunsafe which can lead to mailcious sql injeaction issues
Fix:Use queryRaw instead 


Issue 10 
File name : reports.service.ts
line number 47 - 52 ( computeSalesByUser)
Problem : Using two for loop to create delay in excute of the computesales function and also include delay of notifyReportGenerated 
Fix: Remove that for loop and can introduce queue management system for notfification of report generation 

Issue 11 
File name : inventory.controller.ts
Line number : (restock func)
Problem : Anyone can restock the product 
Fix: Addition of roleguard will only allow admin to restock the product

Issue 12
File name : reports.controller.ts
Line number : (salesbyuser func)
Problem : Sales report of user should be visisble to admin only
Fix: Addition of roleguard will only allow admin to see the sales of the  product


Issue 13 : 
File name : All controllers
Line number : All controller with user req data 
Problem : No validation is applied to any of the req body params and query
Fix: Use of validation pipe with zodSchema will ensure only proper valdiated data reach to service


Issue 14 : 
File name : Request-logger.interceptor.ts
Line Number: RequestLoggerInterceptor
Problem : We are waiting for long time till request get completed , some operation can take longer time than expected
Fix: Introduce rxjs timeout operator to limit the time to excute the request
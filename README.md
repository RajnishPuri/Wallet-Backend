### ** Backend Routes **

-- userAuth

-> createUser - http://localhost:3000/api/v1/auth/register

-> verify-user - http://localhost:3000/api/v1/auth/verify-user

-> login - http://localhost:3000/api/v1/auth/login

-> logout - http://localhost:3000/api/v1/auth/logout

authMiddleware -> user user token

user can check their Account Number -> http://localhost:3000/api/v1/getAccountNumber

user can charge their wallet balance -> http://localhost:3000/api/v1/addMoney

user can send money to other user with email - http://localhost:3000/api/v1/sendMoney

user can check their wallet amount - http://localhost:3000/api/v1/getBalance

user can request for money to friend -> http://localhost:3000/api/v1/sendRequestMoney

user can complete the request -> http://localhost:3000/api/v1/completeRequestMoney

get account number - http://localhost:3000/api/v1/getAccountNumber

get user all request money -> http://localhost:3000/api/v1/allRequestMoney

get user all transaction -> http://localhost:3000/api/v1/allTransactins

get user all details -> http://localhost:3000/api/v1/getUserDetails

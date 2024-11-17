### ** Backend Routes **

-- userAuth
-> createUser - http://localhost:3000/api/v1/auth/register
-> verify-user - http://localhost:3000/api/v1/auth/verify-user
-> login - http://localhost:3000/api/v1/auth/login
-> logout - http://localhost:3000/api/v1/auth/logout

authMiddleware -> user user token

user can charge their wallet balance -> http://localhost:3000/api/v1/addMoney


user can send money to other user with email - http://localhost:3000/api/v1/sendMoney

user can check their wallet amount - http://localhost:3000/api/v1/getBalance

user can request for money to friend - 

get account number - http://localhost:3000/api/v1/getAccountNumber


place to charge the wallet

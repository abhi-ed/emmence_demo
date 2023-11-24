There are 4 apis as mentioned in the task,for the validation i have used joi and for token used jwt 

1 - SIGNUP
curl --location 'localhost:3000/signUp' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user_name":"user-1",
    "password":"Abhi@#123"
}'
2- Login
curl --location 'localhost:3000/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user_name":"user-1",
    "password":"Abhi@#123"
}'
3- logout 
curl --location --request PATCH 'localhost:3000/logOut' \
--header 'Content-Type: application/json' \
--data '{
    "id":"df101e69-ee84-4f22-b492-d1537a351c80"
}'
4 -products
curl --location 'localhost:3000/products' \
--header 'token: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTlkNjNlYmQtZmZiMS00MGRkLTlmMmYtMDJjMjQzYTIxY2JmIiwiaWF0IjoxNzAwNzYxMjM5fQ.zqswf9Sqk3kyqr2WMT-MiubsXadkV-2j15MJi-o8zVo' \
--header 'id: a9d63ebd-ffb1-40dd-9f2f-02c243a21cbf'

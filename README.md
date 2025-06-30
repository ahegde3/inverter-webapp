

## Tech Stack

Frontend and Backend: NextJS(Typescript)
Database: DynamoDB (AWS)
Hosting of website: Vercel


## Env file

```
#used for Dynamo Db setup
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=


#Used for password encryption
SECRET_KEY=  

#Used for Reset password link
EMAIL_FROM= 'vkpengineering07@gmail.com'
EMAIL_APP_PASSWORD = 'waei bxzn gnyk ophn'

```


## Running the project on local

Install all dependencies

```
npm i
```

Running the project on local

```
npm run dev
```


## DynamoDB table structures

User
```

{
  "PK": {
    "S": "USER#79003601-06af-4c3e-b40d-0cde0b778f9d"
  },
  "SK": {
    "S": "PROFILE"
  },
  "city": {
    "S": "Mumbai"
  },
  "createdAt": {
    "S": "1749441341"
  },
  "emailId": {
    "S": "director@hjtindia.com"
  },
  "firstName": {
    "S": "Hardik"
  },
  "lastName": {
    "S": "Gohil"
  },
  "password": {
    "S": "FQYWPQcYAg=="
  },
  "role": {
    "S": "SUPER_ADMIN"
  },
  "state": {
    "S": "maharashtra"
  },
  "updatedAt": {
    "S": "1749441341"
  },
  "userId": {
    "S": "79003601-06af-4c3e-b40d-0cde0b778f9d"
  }
}
```
Ticket

```
{
  "PK": {
    "S": "TICKET#TKTMBIIRF6JY5UYXF"
  },
  "SK": {
    "S": "DETAILS"
  },
  "assignedTo": {
    "S": "123454"
  },
  "createdAt": {
    "S": "2025-06-04T22:28:39.451Z"
  },
  "customerId": {
    "S": "sds"
  },
  "deviceId": {
    "S": "sdfws"
  },
  "message": {
    "S": "hello thi"
  },
  "note": {
    "S": "You have to get the information"
  },
  "status": {
    "S": "COMPLETED"
  },
  "ticketId": {
    "S": "TKTMBIIRF6JY5UYXF"
  },
  "updatedAt": {
    "S": "2025-06-08T20:37:07.665Z"
  }
}

```

Device

```
{
  "PK": {
    "S": "DEVICE#AMBE3IQ1MMW88C9"
  },
  "SK": {
    "S": "METADATA"
  },
  "createdAt": {
    "S": "1748808654"
  },
  "customerId": {
    "S": "6931a14b-52c9-4e67-8ea2-61011617ef7b"
  },
  "deviceId": {
    "S": "AMBE3IQ1MMW88C9"
  },
  "deviceType": {
    "S": "Solar Panel"
  },
  "manufacturingDate": {
    "S": "20 Aug 2024"
  },
  "serialNo": {
    "S": "B475673"
  },
  "updatedAt": {
    "S": "1748808654"
  },
  "warrantyEndDate": {
    "S": "20 Aug 2025"
  },
  "warrantyStartDate": {
    "S": "21 Aug 2025"
  }
}
```

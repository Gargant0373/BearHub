All API requests all start with */api/v2***

### People API
All requests for People start with */person*

    Person {
    	password: string (encrypted password in SHA256) 
    	admin: boolean (will most likely not exist unless set)
    	small_beers, big_beers, beef_jerky: number (consumption)
    }

- GET /
Gets all people in the database.

- GET /{name}
Gets the person with the name from parameter

- POST /{name}
Creates a person with the name from parameter.

- GET /{name}/password
Parameter *password*, unencrypted string.
Returns code 200 for success.

- POST /{name}/password
Parameter *password*, new unencrypted string.
Parameter *oldPassword*, old password if there is one.
Returns 200 for success.
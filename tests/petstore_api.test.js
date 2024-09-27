const request = require("supertest");
const url = "https://petstore.swagger.io/v2";


describe('Swagger PetStore API Functional Testing', () => {
    
    //GET endpoint
    test('It should return pet details for a valid pet ID', async () => {
        const petId = 5; 
        const response = await request(url).get(`/pet/${petId}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', petId);
      });

      //POST endpoint
      test('It should add a new pet to the store', async () => {
        const pet = {
          "id": 34162,
          "category": {
            "id": 0,
            "name": "Dogs"
          },
          "name": "Archi",
          "photoUrls": [
            "string"
          ],
          "tags": [
            {
              "id": 0,
              "name": "string"
            }
          ],
          "status": "available"
        };

        const response = await request(url).post('/pet').send(pet);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', pet.id);
        expect(response.body).toHaveProperty('name', "Archi");
      });

      //PUT endpoint
      test('It should update an existing pet by Its Id', async () =>{
        const updatedPet ={
          "id": 23,
          "category": {
            "id": 0,
            "name": "Cats"
          },
          "name": "Justin",
          "photoUrls": [
            "string"
          ],
          "tags": [
            {
              "id": 0,
              "name": "string"
            }
          ],
          "status": "available"
        };

        const response = await request(url).put('/pet').send(updatedPet);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', updatedPet.id);
        expect(response.body).toHaveProperty('name', "Justin");
      });

      //DELETE endpoint
      test('It should delete a pet by its Id', async () =>{
        const deletePetID = 23;

        const response = await request(url).delete(`/pet/${deletePetID}`);

        expect(response.status).toBe(200);
      });

      //GET/STORE/ORDER endpoint
      test('It should return order by its Id', async () =>{
        const orderId = 3;

        const response = await request(url).get(`/store/order/${orderId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "placed");
      });
     
});


describe('Swagger PetStore API Negative Testing', () => {
    
  //GET endpoint
  test('It should return error for invalid pet Id', async () => {
      const petId = -1; 
      const response = await request(url).get(`/pet/${petId}`);
  
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Pet not found');
    });

    //DELETE endpoint
    test('It should return error for deleting a pet wIth invalid ID', async () => {
      const invalidPetId = -1;
      const response = await request(url).delete(`/pet/${invalidPetId}`);
  
      expect(response.status).toBe(404);
      expect(response).toHaveProperty("error");
    }); 

    //GET/STORE/ORDER endpoint
    test('It should return error for invalid Id', async () =>{
      const orderId = -1;

      const response = await request(url).get(`/store/order/${orderId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
   
});


describe('Swagger Petstore API Edge Case Testing', () => {
    //GET endpoint
    test("It should return status code 404 for large petId", async () =>{
      const largePetId = 999999999999999;
      const response = await request(url).get(`/pet/${largePetId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Pet not found');
    });

    //POST endpoint 
    test('It should return status code 415 for wrongly formated json', async () => {
      const newPet = `{"id":123, "name": "Fluffy",`; 
    
      const response = await request(url).post('/pet').send(newPet);
        
      
      expect(response.status).toBe(415);
      expect(response).toHaveProperty("error");
    });

    //PUT endpoint
    test('It should return status code 500 for a pet wIth an excessively long Id', async () => {
      const newPutPet = {
        id: 555555555554356334543543545,
        name: 'Archi',
        status: 'available',
      };
    
      const response = await request(url).post('/pet').send(newPutPet);
        
      expect(response.status).toBe(500);
      expect(response).toHaveProperty("error");
    });

    //DELETE endpoint
    test('It should return error for deleting a pet an excessively long Id', async () => {
      const invalidPetId = 4837327532;
      const response = await request(url).delete(`/pet/${invalidPetId}`);

      expect(response.status).toBe(404);
      expect(response).toHaveProperty("error");
    });

    //GET/STORE/ORDER endpoint
    test('It should return error for an excessively long Id', async () =>{
      const orderId = 9843754322325;

      const response = await request(url).get(`/store/order/${orderId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('type', 'error');
      expect(response.body).toHaveProperty('message', 'Order not found');
    });
})



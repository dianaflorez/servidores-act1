const request = require('supertest');
const app = require('./app'); 

describe('Pruebas unitarias para la ruta GET /employees', () => {
    it('Debería devolver un código de estado 200 y una lista de empleados', async () => {
        const response = await request(app)
        .get('/employees');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
    });
});

describe('Pruebas unitarias para la ruta POST /employees', () => {
    it('Debería devolver un código de estado 200 y el empleado agregado', async () => {
        const newEmployee = {
            name: 'New',
            age: 30,
            phone: {
                personal: '333-333-321',
                work: '333-333-321',
                ext: '333'
            },
            privileges: 'user',
            favorites: {
                artist: 'LeoDaVinci',
                food: 'Pasta'
            },
            finished: [7, 14],
            badges: ['gold', 'silver'],
            points: [{ points: 80, bonus: 20 }]
        };

        const response = await request(app)
            .post('/employees')
            .send(newEmployee);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(newEmployee);
    });

    it('Debería devolver un código de estado 400 si el cuerpo de la solicitud no cumple con el formato requerido', async () => {
        const invalidEmployee = {
          lastname: 'Florez',
          age: 33,
        };

        const response = await request(app)
            .post('/employees')
            .send(invalidEmployee);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ code: 'bad_request' });
    });

});

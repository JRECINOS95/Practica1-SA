import { Servidor } from '../src/Servidor';
import { PORT_TEST } from '../src/utils/config'

const request = require('supertest')
const app = new Servidor(PORT_TEST);
// jest.setTimeout(80000);

// Se inicia el servidor para comenzar a escuchar peticiones
beforeEach( async done => {
    await app.listen();
    done()
})

// despues de cada prueba se cierra el servidor iniciado en beforeEach
afterEach(done => {
    return app.server && app.server.close(done)
})

// Server
describe('Pruebas para Api Impuestos', function () {
  
    test('get api funcionando /',  function (done) {
     request(app.app)
      .get('/status')
      .expect(200)
      .end(function (err: any, res: any) {
        if (err) return fail(err)
        done()
      })
  })
})

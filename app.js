const express = require("express");
const app = express();

// support json body
app.use(express.json());

const data = require('./employees.json')

app.get("/employees", (req, res) => {
    const page = parseInt(req.query.page); // Página solicitada (por defecto es 1)
    const perPage = 2; // Número de empleados por página
    const isUser = req.query.user === 'true';
    const blackBadge = req.query.badges === 'black';

    // const startIndex = (page - 1) * perPage;
    // const endIndex = page * perPage;

    const startIndex = 2 * (page - 1);
    const endIndex = startIndex + perPage;

    let employees = [];

    if (isUser) {
      employees = data.filter(item => item.privileges === 'user');
    } else if(page) {
      employees = data.slice(startIndex, endIndex);
    } else if(blackBadge){
      employees = data.filter(item => item.badges.includes('black'));
    } else {
      employees = data;
    }

    res.json(employees);
});

// Ruta GET para obtener el empleado más viejo
app.get('/employees/oldest', (req, res) => {
    let oldestEmployee = data[0]; 
    
    for (let i = 1; i < data.length; i++) {
        if (data[i].age > oldestEmployee.age) {
            oldestEmployee = data[i];
        }
    }

    return res.json(oldestEmployee);
});

app.post('/employees', (req, res) => {
  const newEmployee = req.body;

  console.log(newEmployee)

  // Validar el formato del objeto de empleado
  if (!validateEmployee(newEmployee)) {
      return res.status(400).json({ code: 'bad_request' });
  }

  // Añadir el nuevo empleado al array en memoria
  data.push(newEmployee);

  return res.json(data);
  
});

// Función para validar el formato del objeto de empleado
// Función para validar el formato del objeto de empleado
function validateEmployee(employee) {
  return (
      employee.hasOwnProperty('name') &&
      typeof employee.name === 'string' &&
      employee.hasOwnProperty('age') &&
      typeof employee.age === 'number' &&
      employee.hasOwnProperty('phone') &&
      typeof employee.phone === 'object' &&
      employee.phone.hasOwnProperty('personal') &&
      typeof employee.phone.personal === 'string' &&
      employee.phone.hasOwnProperty('work') &&
      typeof employee.phone.work === 'string' &&
      employee.phone.hasOwnProperty('ext') &&
      typeof employee.phone.ext === 'string' &&
      employee.hasOwnProperty('privileges') &&
      typeof employee.privileges === 'string' &&
      employee.hasOwnProperty('favorites') &&
      typeof employee.favorites === 'object' &&
      employee.favorites.hasOwnProperty('artist') &&
      typeof employee.favorites.artist === 'string' &&
      employee.favorites.hasOwnProperty('food') &&
      typeof employee.favorites.food === 'string' &&
      employee.hasOwnProperty('finished') &&
      Array.isArray(employee.finished) &&
      employee.finished.length === 2 &&
      employee.finished.every(item => typeof item === 'number') &&
      employee.hasOwnProperty('badges') &&
      Array.isArray(employee.badges) &&
      employee.badges.every(item => typeof item === 'string') &&
      employee.hasOwnProperty('points') &&
      Array.isArray(employee.points) &&
      employee.points.every(
          point =>
              typeof point === 'object' &&
              point.hasOwnProperty('points') &&
              typeof point.points === 'number' &&
              point.hasOwnProperty('bonus') &&
              typeof point.bonus === 'number'
      )
  );
}


app.listen(8000, () => {
  console.log("Server is running")
})
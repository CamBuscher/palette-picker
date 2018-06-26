const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send('P-p-p-p-PALETTE PICKER')
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})
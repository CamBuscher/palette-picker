exports.seed = function (knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del()
    .then(() => knex('projects').del())

    // Now that we have a clean slate, we can re-insert our paper data
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('projects').insert({
          name: 'Fooo'
        }, 'id')
          .then(project => {
            return knex('palettes').insert([
              { 
                name: 'Lorem', 
                project_id: project[0],
                color1: '#2A0AAD',
                color2: '#BB229D',
                color3: '#A769A7',
                color4: '#FD5783',
                color5: '#D04318'
              },
              {
                name: 'Dolor', 
                project_id: project[0],
                color1: '#52452C',
                color2: '#420483',
                color3: '#53C2E5',
                color4: '#D208D2',
                color5: '#D50E39' }
            ])
          })
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
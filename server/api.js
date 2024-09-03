import { JsonRoutes } from 'meteor/simple:json-routes';
import { Meteor } from 'meteor/meteor';

// Contoh data untuk API
const items = [
  { id: 1, name: 'Item 1', description: 'Description 1' },
  { id: 2, name: 'Item 2', description: 'Description 2' }
];

// Rute GET untuk mendapatkan semua items
JsonRoutes.add('GET', '/api/items', function (req, res) {
  JsonRoutes.sendResult(res, {
    code: 200,
    data: items
  });
});

// Rute GET untuk mendapatkan item berdasarkan ID
JsonRoutes.add('GET', '/api/items/:id', function (req, res) {
  const itemId = parseInt(req.params.id, 10);
  const item = items.find(item => item.id === itemId);
  if (item) {
    JsonRoutes.sendResult(res, {
      code: 200,
      data: item
    });
  } else {
    JsonRoutes.sendResult(res, {
      code: 404,
      data: { error: 'Item not found' }
    });
  }
});

// Rute POST untuk menambahkan item baru
JsonRoutes.add('POST', '/api/items', function (req, res) {
  const newItem = req.body;
  newItem.id = items.length + 1;
  items.push(newItem);
  JsonRoutes.sendResult(res, {
    code: 201,
    data: newItem
  });
});

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true },
  phone:         { type: String, required: true },
  address:       { type: String, required: true },
  material:      { type: String, required: true },
  color:         { type: String, required: true },
  infillDensity: { type: String, required: true },
  infillPattern: { type: String, required: true },
  quantity:      { type: Number, required: true, default: 1 },
  comments:      { type: String, default: '' },
  stlFileName:   { type: String, required: true },         // original filename for display
  stlFileId:     { type: mongoose.Schema.Types.ObjectId, default: null }, // GridFS file ref (null = deleted)
  status:        { type: String, default: 'Pending' },
  createdAt:     { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);

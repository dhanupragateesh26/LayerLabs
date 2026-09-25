const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  type:                 { type: String, enum: ['catalog', 'custom_print'], required: true },
  title:                { type: String, required: true },
  productId:            { type: String },
  price:                { type: String },
  numericPrice:         { type: Number, default: 0 },
  quantity:             { type: Number, default: 1 },
  options: {
    sizeName:           { type: String },
    sizeDimension:      { type: String },
    color:              { type: String },
    design:             { type: String },
    uploadedImageName:  { type: String },
    customNote:         { type: String },
  },
  // Custom print specific fields
  material:             { type: String },
  color:                { type: String },
  infillDensity:        { type: String },
  infillPattern:        { type: String },
  volumeMm3:            { type: Number },
  comments:             { type: String },
  fileName:             { type: String },
  fileId:               { type: mongoose.Schema.Types.ObjectId, default: null }, // GridFS file reference for STL
  imageFileId:          { type: mongoose.Schema.Types.ObjectId, default: null }, // GridFS file reference for Lithophane photo
});

const OrderSchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  email:                { type: String, required: true },
  phone:                { type: String, required: true },
  address:              { type: String, required: true },
  comments:             { type: String, default: '' },
  orderType:            { type: String, enum: ['single', 'cart'], default: 'cart' },
  items:                [OrderItemSchema],
  totalAmount:          { type: Number, default: 0 },

  // Backwards compatibility fields for single STL orders
  material:             { type: String },
  color:                { type: String },
  infillDensity:        { type: String },
  infillPattern:        { type: String },
  quantity:             { type: Number, default: 1 },
  stlFileName:          { type: String },
  stlFileId:            { type: mongoose.Schema.Types.ObjectId, default: null },

  status:               { type: String, default: 'Pending' },
  createdAt:            { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);

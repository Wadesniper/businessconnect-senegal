const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transaction_id: { type: String, required: true, unique: true },
  type: { type: String, required: true }, // etudiant, annonceur, employeur
  amount: { type: Number, required: true },
  customer_email: { type: String, required: true },
  customer_name: { type: String },
  customer_surname: { type: String },
  customer_phone_number: { type: String },
  status: { type: String, default: 'PENDING' }, // PENDING, ACCEPTED, REFUSED
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 
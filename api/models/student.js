const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    batch: String
})

module.exports = mongoose.model('student', studentSchema);

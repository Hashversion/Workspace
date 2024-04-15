const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const processSchema = new Schema({
    processData: [{
        name: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: String,
            required: true
        },
        processList: [{
            type: Array,
            required: true
        }],
        imagePath:{
            type: String,
            reqiured: true
        }
    }]
},
{
    timestamps: true
}
);

const Process = mongoose.model('Process', processSchema);
module.exports = Process;
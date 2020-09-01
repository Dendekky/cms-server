// /* eslint-disable linebreak-style */
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const subscriberSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
},
{
  timestamps: true,
});

subscriberSchema.plugin(uniqueValidator);

const Subscriber = mongoose.model('Subscribers', subscriberSchema);

module.exports = Subscriber;

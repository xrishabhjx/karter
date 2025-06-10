import mongoose from 'mongoose';

const enterpriseFormSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const EnterpriseForm = mongoose.model('EnterpriseForm', enterpriseFormSchema);

export default EnterpriseForm;
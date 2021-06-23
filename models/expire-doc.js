const TestSchema = new mongoose.Schema({
    name: String,
    createdAt: { type: Date, expires: '2m', default: Date.now }
  })
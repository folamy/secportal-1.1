const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId
    Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

const studentSchema = new Schema({
  id: ObjectId,
  studId: String,
  lastname: String,
  firstname: String,
  othername: String,
  password: String,
  gender:  String,
  dob:  String,
  passport: String,
  stateOrigin:  Number,
  localGov:  String,
  classLevel:  Number,
  subClass:  String,
  guardian:  String,
  homeAddress:  String,
  phoneNumber:  String,
  email: String,
  newIntake: Boolean,
  returning: Boolean,
  sch_fees: Boolean
},

{
  timestamps: true
})


// subjects Schema
const JSsubjectSchema = new Schema({
  id: ObjectId,
  groupID: Number,
  subID: Number,
  name: String,
  status: String,
  school: String
})

const purchaseItem = new Schema({
  id: ObjectId,
  Books: {
    price: Number,
    name: String,
    class: String
  },
  uniforms: Array,
  id_card: Array
})

const SSsubjectSchema = new Schema({
  id: ObjectId,
  groupID: Number,
  subID: Number,
  name: String,
  status: String,
  school: String
})
const tsubSchema = new Schema({
  id: ObjectId,
  teacherID: String,
  name: String,
  class: String
},
{
  timestamps: true
})

const stateSchema = new Schema({
  id: ObjectId,
  stateID: Number,
  name: String
})

const localGovSchema = new Schema({
  id: ObjectId,
  stateID: Number,
  name: String
})

const allClassesSchema = new Schema({
  id: ObjectId,
  classID: Number,
  name: String
})

const ssClassesSchema = new Schema({
  id: ObjectId,
  clasID: Number,
  name: String
})

const registeredSubSchema = new Schema({
  id: ObjectId,
  studId: String,
  subjects: [],
  class: Number
})

const studentResult = new Schema({
  class: Schema.Types.Mixed,
  term: String,
  studId: String,
  subjects: []
})

const testResult = new Schema({
  class: Schema.Types.Mixed,
  term: String,
  ca: String,
  studId: String,
  subjects: []
})

const roleSchema = new Schema({
  id: ObjectId,
  roleID: Number,
  name: String,
  Subject: String
})

const currentTermSchema = new Schema({
  id: ObjectId,
  term: Schema.Types.Mixed
})

const allTermSchema = new Schema({
  id: ObjectId,
  term: Schema.Types.Mixed,
  current: Boolean,
  ends: String
})

const teacherSchema = new Schema({
  id: ObjectId,
  ttitle: String,
  teacherID: String,
  lastname: String,
  firstname: String,
  othername: String,
  password: String,
  gender:  String,
  dob:  String,
  passport: String,
  // portfolio:  String,
  // tclass:  String,
  stateOrigin:  String,
  localGov:  String,
  // role:  String,
  homeAddress:  String,
  phoneNumber:  String,
  email: String,
  nextOfKinPhone: String,
  nextOfKin: String,
  nextOfKinHome: String

})
const adminSchema = new Schema({
  id: ObjectId,
  aid: String,
  superUser:Boolean,
  lastname: String,
  othername: String,
  password: String,
  email: String
  // passport: String
})
const paymentSchema = new Schema({
  id: ObjectId,
  studId: String,
  class: Number,
  term: String,
  reference: String,
  purpose: String //e.g newIntake, returning and other
})

// mongoos middlewares
studentSchema.pre('save', function(next) {
  const salt = bcrypt.genSaltSync(10)
  if (!this.password) {
    this.password  = bcrypt.hashSync(this.studId.toLowerCase(), salt)
  }
  this.sch_fees = false
  this.returning = false
  this.newIntake = true
  next()
})

teacherSchema.pre('save', function(next) {
  const salt = bcrypt.genSaltSync(10)
  if (!this.password) {
    this.password  = bcrypt.hashSync(this.teacherID.toLowerCase(), salt)
  }
  next()
})

const schemas = {
  student: mongoose.model("student", studentSchema),
  JSsubjects: mongoose.model("subjectjs", JSsubjectSchema),
  SSsubjects: mongoose.model("subjects", SSsubjectSchema),
  state: mongoose.model("state", stateSchema),
  localGov: mongoose.model("lgas", localGovSchema),
  allClasses: mongoose.model("all_classes", allClassesSchema),
  ssClasses: mongoose.model("ss_classes", ssClassesSchema),
  payment: mongoose.model("payment", paymentSchema),
  registeredSub: mongoose.model("registeredSubject", registeredSubSchema),
  role: mongoose.model("roles", roleSchema),
  teacher: mongoose.model("teachers", teacherSchema),
  teacherSub: mongoose.model("tsubject", tsubSchema),
  studResult: mongoose.model("result", studentResult),
  testResult: mongoose.model("test_results", testResult),
  curentTerm: mongoose.model("terms", currentTermSchema),
  allterm: mongoose.model("allTerm", allTermSchema),
  adminUser: mongoose.model("admin", adminSchema),
  purchaseItems: mongoose.model("schoolItems", purchaseItem)
};

module.exports = function(mongoose) {
  const models = {
    student: mongoose.model('student'),
    JSsubjects: mongoose.model('subjectjs'),
    SSsubjects: mongoose.model('subjects'),
    state: mongoose.model('state'),
    localGov: mongoose.model('lgas'),
    allClasses: mongoose.model('all_classes'),
    ssClasses: mongoose.model('ss_classes'),
    payment: mongoose.model('payment'),
    regsub: mongoose.model('registeredSubject'),
    role: mongoose.model('roles'),
    teacher: mongoose.model('teachers'),
    teacherSub: mongoose.model('tsubject'),
    studResult: mongoose.model('result'),
    testResult: mongoose.model('test_results'),
    curentTerm: mongoose.model('terms'),
    allterm: mongoose.model('allTerm'),
    purchaseItems: mongoose.model('schoolItems'),
    adminUser: mongoose.model('admin')
  }
  return models
}

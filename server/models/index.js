//  const mongoose = require('mongoose'),
//     Schema = mongoose.Schema,
//     ObjectId = Schema.ObjectId,
//     path = require('path'),
//     Promise = require('bluebird'),
//     bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
//
//     // schemas = require( path.resolve( __dirname, "./schemas.js" ) )(mongoose)
//
//
// module.exports = function(mongoose) {
//
//   var studentSchema = new Schema({
//     // id: ObjectId,
//     studId: String,
//     lastname: String,
//     firstname: String,
//     othername: String,
//     password: String,
//     gender:  String,
//     dob:  String,
//     passport: String,
//     // nationality:  String,
//     stateOrigin:  Number,
//     localGov:  String,
//     classLevel:  Number,
//     subClass:  String,
//     guardian:  String,
//     homeAddress:  String,
//     phoneNumber:  String,
//     email: String
//
//   });
//
//
//   // subjects Schema
//   var JSsubjectSchema = new Schema({
//     // id: ObjectId,
//     groupID: Number,
//     subID: Number,
//     name: String,
//     status: String,
//     school: String
//   });
//
//   var SSsubjectSchema = new Schema({
//     // id: ObjectId,
//     groupID: Number,
//     subID: Number,
//     name: String,
//     status: String,
//     school: String
//   });
//   var tsubSchema = new Schema({
//     // id: ObjectId,
//     teacherID: String,
//     name: String,
//     class: String
//   });
//
//   var stateSchema = new Schema({
//     // id: ObjectId,
//     stateID: Number,
//     name: String
//   });
//
//   var localGovSchema = new Schema({
//     // id: ObjectId,
//     stateID: Number,
//     name: String
//   });
//
//   var allClassesSchema = new Schema({
//     // id: ObjectId,
//     classId: Number,
//     name: String
//   });
//
//   var ssClassesSchema = new Schema({
//     // id: ObjectId,
//     classId: Number,
//     name: String
//   });
//
//   var subRegSchema = new Schema({
//     // id: ObjectId,
//     studId: String,
//     subjects: [],
//     class: String
//   });
//
//   var studentResult = new Schema({
//     class: Schema.Types.Mixed,
//     term: String,
//     studId: String,
//     subjects: []
//   })
//
//   var roleSchema = new Schema({
//     // id: ObjectId,
//     roleID: Number,
//     name: String,
//     Subject: String
//   });
//
//   var currentTermSchema = new Schema({
//     // id: ObjectId,
//     term: Schema.Types.Mixed
//   });
//   var allTermSchema = new Schema({
//     // id: ObjectId,
//     term: Schema.Types.Mixed
//   });
//
//   var teacherSchema = new Schema({
//     // id: ObjectId,
//     ttitle: String,
//     teacherID: String,
//     lastname: String,
//     // firstname: String,
//     othername: String,
//     password: String,
//     gender:  String,
//     dob:  String,
//     passport: String,
//     // portfolio:  String,
//     // tclass:  String,
//     stateOrigin:  String,
//     localGov:  String,
//     role:  String,
//     homeAddress:  String,
//     phoneNumber:  String,
//     email: String
//
//   });
//   var adminSchema = new Schema({
//     // id: ObjectId,
//     aid: String,
//     adminType:String,
//     lastname: String,
//     othername: String,
//     password: String,
//     email: String
//     // passport: String
//   });
//
// // mongoos middlewares
//   studentSchema.pre('save', function(next) {
//     var salt = bcrypt.genSaltSync(10)
//     this.password  = bcrypt.hashSync(this.studId, salt)
//     console.log(this);
//     next()
//   })
//
//     var models = {
//        student : mongoose.model('students', studentSchema),
//        JSsubjects : mongoose.model('subjectjs', JSsubjectSchema),
//        SSsubjects : mongoose.model('subjects', SSsubjectSchema),
//        state : mongoose.model('state', stateSchema),
//        localGov : mongoose.model('lgas', localGovSchema),
//        allClasses : mongoose.model('all_classes', allClassesSchema),
//        ssClasses : mongoose.model('ss_classes', ssClassesSchema),
//        regsub : mongoose.model('registeredSubject', subRegSchema),
//        role : mongoose.model('roles', roleSchema),
//        teacher : mongoose.model('teachers', teacherSchema),
//        teacherSub: mongoose.model('tsubject', tsubSchema ),
//        studResult: mongoose.model('result', studentResult ),
//        curentTerm: mongoose.model('terms', currentTermSchema),
//        allterm: mongoose.model('allTerms', allTermSchema),
//        adminUser: mongoose.model('admin', adminSchema)
//     }
//
//     return models;
// }

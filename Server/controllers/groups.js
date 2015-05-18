var Group = require('../models/group');
var ObjectId = require('mongoose').Types.ObjectId;

var exp = module.exports;


exp.findById = function (req, res, next) {

  var getGroup = Group.findOne(
    { '_id': new ObjectId(req.params.groupId) }
  ).exec();

  getGroup.addBack( function (err, group) {
    if (err) return next(err);
    res.json(group);
  });

};


exp.findAll = function (req, res, next) {

  var getGroups = Group.find().exec();

  getGroups.addBack( function (err, groups) {
    if (err) return next(err);
    res.json(groups);
  })

};


exp.addGroup = function (req, res, next) {

  // TODO check if group exists and un-delete it

  var group = new Group();
  
  group.name = req.body.name;

  var topics = req.body.topics;

  for(i in topics) {
    group.topics.push(ObjectId(topics[i]))
  }
  
  group.save( function (err, group) {
    if (err) return next(err);
    res.json(group)
  });

};


exp.updateTopics = function (req, res, next) {
  
  // TODO add auth info ensure only mods and admin can update

  var updateTopics = Group.findOne(
    { '_id': req.params.groupId }
  ).exec();

  updateGroup.addBack( function (err, group) {
    if (err) return next(err);

    var group = group;

    group.topics.push();

    group.save();

    res.json(group);
  });
  
};


exp.deleteGroup = function (req, res, next) {
  
  // TODO add auth info ensure only mods and admin can delete

  var deleteGroup = Group.update(
    { '_id': req.params.groupId },
    { $set: { 'deleted': true } }
  ).exec();

  deleteGroup.addBack( function (err, updated, raw) {
    if (err) return next(err);
    res.json(raw);
  });

};

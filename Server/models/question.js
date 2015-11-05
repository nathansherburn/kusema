'use strict';

var mongoose        = require('mongoose');
var objectId        = mongoose.Schema.Types.ObjectId;
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');

var Comment         = require('./comment.js');

var autoPopulate 	= require('mongoose-autopopulate');

// Schema definition
var questionSchema = new contentMethods.BaseContentSchema({
    title:          { type: String, required: true },
    topics:         [{ type: String, ref: 'Topic' }],
    group:          { type: String, required: true }, //TODO: SET REQUIRED TO TRUE!!
    answers:        {
    					type: Array,
    					schema: objectId, ref: 'Answer',
    					autopopulate: true
    				},
    stats:          {
        numAnswers:   { type: Number, default: 0},
        numComments:  { type: Number, default: 0},
        dateLastReply: {type: Date, default: Date.now }
    }
});


// Indexes
questionSchema.index({ topics: 1, dateCreated: -1 });
questionSchema.index({ author: 1, dateCreated: -1 });
questionSchema.index({ group: 1, dateCreated: -1 });
questionSchema.index({ upVotes: 1 });
questionSchema.index({ downVotes: 1 });
questionSchema.path('title').index({text : true});
questionSchema.path('message').index({text : true});

questionSchema.methods.setFromJSON = function(data, userId) {
	this.__proto__.__proto__.setFromJSON.call(this, data, userId);
	if (data.title)  this.title		= data.title;
	if (data.topics) this.topics	= data.topics;
	if (data.group)  this.group		= data.group;
}

questionSchema.methods.setStats = function() {
  if (!this.stats) {
    this.stats = {};
  }
  return Promise.all([
    this.setNumAnswers(),
    this.setNumComments(),
    this.setDateLastReply()
  ]).then(function() { return this }.bind(this));
}

questionSchema.methods.setNumAnswers = function() {
  return contentMethods.BaseContent.count({
    __t: 'Answer',
    question: this._id,
    deleted: false,
  })
  .then( function(count) {
    this.stats.numAnswers = count;
    return this;
  }.bind(this));
}

questionSchema.methods.setNumComments = function() {
  return Comment.count({
    parent: {$in: this.answers.concat([this._id])},
    deleted: false
  })
  .then( function(count) {
    console.log('setting count to '+count)
    this.stats.numComments = count
    return this;
  }.bind(this));
}

questionSchema.methods.setDateLastReply = function() {
  return contentMethods.BaseContent.aggregate([
    {$match: {
      $or: [
          {question: this._id},
          {parent: this._id},
          {_id: this._id} // cbf writing a null check later
      ],
      deleted: false
    } },

    {$sort:
      {dateCreated: -1}
    },

    {$limit: 1}
  ]).exec()
  .then( function(aggregation) {
    this.stats.dateLastReply = aggregation[0].dateCreated;
    return this;
  }.bind(this))
}


module.exports = contentMethods.BaseContent.discriminator('Question', questionSchema);
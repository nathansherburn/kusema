var mongoose        = require('mongoose');
var ObjectId        = mongoose.Schema.Types.ObjectId;
var Question        = require('./question');
var media           = require('./common/media');
var contentMethods  = require('./common/contentMethods');
var socketio        = require('../config/socketio');
// Schema definition
var answerSchema = new contentMethods.BaseContentSchema({
    question:     { type: ObjectId, ref: 'Question', required: true },
    isAccepted:     { type: Boolean, ref: 'Answer', default: false}
})

var emitChanged = function(answer) {
    console.log('EMITTIED');
    Question.findById(this.question)
       .then( function(question) {
            console.log('emitting yay!');
            socketio.io.emit('contentChanged', {'_id': question._id, 'answers':question.answers});
       })
       .catch( function(error) {
            console.log('emitting fail :(');
            console.log(error);
       })
}

// Indexes
answerSchema.index({ question: 1, dateCreated: -1 });
answerSchema.index({ author: 1, dateCreated: -1 });
answerSchema.index({ upVotes: 1 });
answerSchema.index({ downVotes: 1 });
answerSchema.path('message').index({text : true});

answerSchema.pre('save', function(next) {
    Question.update(
        { _id: this.question },

        { $addToSet:
                {'answers': this._id}
        },
        
        next
    );
});

answerSchema.pre('remove', function(next) {
    Question.update({_id: this.question},{$pull:{'answers': this._id}}, next);
});

answerSchema.post('save', function() {

    //TODO if slow, uncomment the above 
    // manual inc instead of searching for every match in
    // the answers collection
    Question.findById(this.question)
    .then( function(question) {
        return question.setNumAnswers();
    })
    .then( function(question) {
        return question.save();
    })
    //TODO end stuff to delete

});

answerSchema.post('save', emitChanged);

answerSchema.methods.setFromJSON = function(data, userId) {
    this.__proto__.__proto__.setFromJSON.call(this, data, userId);
    this.question = data.question;
}

// Validation
answerSchema.path('question').validate(function (value, respond) {
    Question.count({_id: value}, function (err, doc) {
        if (err || !doc) {
            console.error(err);
            console.error(doc);
            console.error(value);
            respond(false);
        } else {
            respond(true);
        }
    });

}, 'Question does not exist');


module.exports = contentMethods.BaseContent.discriminator('Answer', answerSchema);
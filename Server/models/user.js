var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var bcrypt   = require('bcrypt');

// Schema definition
var userSchema = mongoose.Schema({
    username:       String,
    password:       String,
    authcate:       String,
    email:          String,
    dateCreated:    { type: Date, default: Date.now },
    dateModified:   { type: Date, default: null },
    subscriptions:  [{ type: objectId, active: Boolean }],
    enrollments:    [{ type: objectId, active: Boolean }],
    isAdmin:        { type: Boolean, default: false },
    moderatorOf:    [{ type: objectId, ref: 'Group' }]
})

// Indexes
userSchema.index({ subscriptions: 1 });
userSchema.path('username').index({text : true});
userSchema.path('authcate').index({text : true});

//TODO Make the following methods asynch
// generating a hash
userSchema.methods.generateHash = function(password) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    return hash;
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


module.exports = mongoose.model('User', userSchema);
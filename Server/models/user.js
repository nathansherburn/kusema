var mongoose = require('mongoose');
var objectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
var bcrypt   = require('bcrypt');
var Group   = require('./group');

// Schema definition
var userSchema = mongoose.Schema({
    username:           String,
    password:           String,
    authcate:           String,
    email:              String,
    type:               String,
    personalTitleFull:  String,
    givenNames:         [String],
    surname:            String,
    displayName:        String,
    dateCreated:        { type: Date, default: Date.now },
    dateModified:       { type: Date, default: null },
    manualSubscriptions: {
        groups:         [{ type: String, ref: 'Group'}], 
        topics:         [{ type: String, ref: 'Topic'}],
    },
    authcateSubscriptions: {
        groups:         [{ type: String, ref: 'Group'}], 
        topics:         [{ type: String, ref: 'Topic'}],
    },
    isAdmin:            { type: Boolean, default: false },
    moderatorOf:        [{ type: objectId, ref: 'Group' }],
    stats:              {
        topicScores:    { type: Mixed, default: {} }
    }
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
    if (!this.password) {
        return false;
    }
    return bcrypt.compareSync(password, this.password);
};


userSchema.virtual('firstName').get(function() { try { return this.givenNames[0] } catch (e) { return '' } });

userSchema.path('displayName').get(function(displayName) {
    return displayName ? displayName : this.username;
});

// in theory this might be a virtual, however that means we can't do lean queries and such without pulling
// in half the user object anyway, and as we'll be using this all the time it's probably worth just saving it.
userSchema.methods.generateDisplayName = function() {
    try {
        switch (this.type) {
            case 'staff':
                return this.personalTitle+'.'
                        +' '+this.firstName
                        +' '+this.surname;
                break;
            case 'student':
                return this.firstName
                        +' '+this.surname.substring(0,1);
                break;
            default:
                var e =  new Error('old account with no type!');
                throw e;
                break;
        }
    } catch (e) {
        return this.username;
    }
};

userSchema.virtual('personalTitle').get(function() {
    switch (this.personalTitleFull) {
        case 'Professor':
            return 'Prof';
        case 'Associate Professor':
            return 'A.Prof';
        default:
            return this.personalTitleFull;
    }
});


userSchema.virtual('subscriptions.groups').get(function() {
    return this.manualSubscriptions.groups.concat(
                this.authcateSubscriptions.groups
            );
});
userSchema.virtual('subscriptions.topics').get(function() {
    return this.manualSubscriptions.topics.concat(
                this.authcateSubscriptions.topics
            );
});


userSchema.methods.configureFromAuthcate = function(authcateUserName) {
    var ldap = require('../services/ldapClient.js');

    this.authcate = authcateUserName;
    var user = this;
    return ldap.getUser(authcateUserName)
        .then( function(ldapUser) {
            console.log('got ldap result');
            user.email = ldapUser.mail;
            user.authcate = ldapUser.uid;

            if (ldapUser.ou.indexOf('Staff') != -1) {
                user.type = 'staff';
            } else if (ldapUser.ou.indexOf('Student') != -1) {
                user.type = 'student';
            }

            user.personalTitleFull = ldapUser.personalTitle;
            user.givenNames = ldapUser.givenName.split(' ');
            user.surname = ldapUser.sn;
            user.username = user.authcate;

            user.displayName = user.generateDisplayName();

            user.ldapUser = ldapUser;

            var userP = Promise.resolve(user);

            if (ldapUser.monashEnrolledSubject) {
                userP = userP
                    .then(function() {
                        return Group.find({
                            '_id': { '$in': ldapUser.monashEnrolledSubject }
                        })
                        .then(function(groups) {
                            console.log(groups);
                            user.authcateSubscriptions.groups = groups.map(function(group) {return group._id});
                            return user;
                        });
                    });
            }

            if (ldapUser.monashTeachingCommitment) {
                userP = userP
                    .then( function() {
                        Group.find({
                            '_id': { '$in': ldapUser.monashTechingCommitment.map(function(u) { return u.toLower() }) }
                        })
                        .then(function(groups) {
                            user.authcateSubscriptions.groups = groups.map(function(group) { return group._id});
                            return user;
                        });
                    });
            }

            return userP;
        })
        .catch( function(error) {
            console.error('error initializing '+authcateUserName+' from ldap');
            console.error(error.stack);
            return error;
        });
}


userSchema.set('toJSON', {virtuals: true, getters: true});


module.exports = mongoose.model('User', userSchema);
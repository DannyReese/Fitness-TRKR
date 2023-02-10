const requireUser = ((req, res, next) => {
    if (!req.user) {
        next({
            name: 'NoUserError',
            message: 'User is required'
        });
    }
});

module.exports = {
    requireUser
};
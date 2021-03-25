module.exports = {
    usersOnly: function(req, res, next) {
        const {user} = req.session;

        if (!user) {
            return res.status(401).send("Please log in first.")
        }
        next();
    },
    adminsOnly: function(req, res, next) {
        const {is_admin} = req.session.user;
        if (!is_admin) {
            return res.status(403).send("You are not an admin.");
        }
        next();
    }
}
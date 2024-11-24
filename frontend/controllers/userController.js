export const getUserData = (req, res) => {
    if (req.session && req.session.loggedIn) {
        res.json({ user: req.session.data });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

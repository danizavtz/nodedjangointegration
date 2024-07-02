exports.fallback = (req, res) => {
    res.status(404).json({ errors: [{ location: req.path, msg: 'Not found', param: null }] });
};

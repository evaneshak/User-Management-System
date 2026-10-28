const service = require('../services/userService');
const { username } = require('../utils/validation');
const { HttpError } = require('../utils/errors');
module.exports.login = async (req, res, next) => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new HttpError(400, 'A JSON sign-in object is required.');
    const userid = username(req.body.userid);
    if (typeof req.body.password !== 'string' || !req.body.password) throw new HttpError(400, 'Password is required.');
    res.json(await service.login(userid, req.body.password));
  } catch (error) { next(error); }
};

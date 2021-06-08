const router = require('express').Router();
const {
  updateProfile, getMyUser,
} = require('../controllers/users');
const { validateUserInfo } = require('../middlewares/validation');

router.get('/users/me', getMyUser);
router.patch('/users/me', validateUserInfo, updateProfile);

module.exports = router;

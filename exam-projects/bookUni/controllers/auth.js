const router = require('express').Router();
const { isUser, isGuest } = require('../middleware/guards');
const { register, login } = require('../services/user');
const mapErrors = require('../util/mappers');

const PASSWORD_PATTERN = /^[a-zA-Z0-9]+$/;

// # register
router.get('/register', isGuest(), (req, res) => {
   res.render('register');
});
// TODO check form action, method, field names
router.post('/register', isGuest(), async (req, res) => {
   try {
      if (req.body.password.trim() < 5) {
         throw new Error('Password must be at least 5 characters');
      }

      if (req.body.password != req.body.repass) {
         throw new Error('Passwords don\'t match');
      }
      const user = await register(req.body.email, req.body.username, req.body.password);
      req.session.user = user;
      res.redirect('/'); // [x] TODO check redirect requirements
   } catch (err) {
      console.error(err);
      // [x] TODO send error messages
      const errors = mapErrors(err);
      res.render('register', { data: { username: req.body.username, email: req.body.email }, errors });
   }

})


// # login
router.get('/login', isGuest(), (req, res) => {
   res.render('login');
});
//[x] TODO check form action, method, field names
router.post('/login', isGuest(), async (req, res) => {
   try {
      const user = await login(req.body.username, req.body.password);
      req.session.user = user;
      res.redirect('/'); //[x] TODO check redirect requirements
   } catch (err) {
      console.error(err);
      //[x] TODO send error messages
      const errors = mapErrors(err);
      res.render('login', { data: { username: req.body.username }, errors });
   }
})

// # logout
router.get('/logout', isUser(), (req, res) => {
   delete req.session.user;
   res.redirect('/');
});


module.exports = router;
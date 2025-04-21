const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth.authenticate());

router.get('/', customerController.getAll);
router.post('/add', customerController.add);
router.post('/update', customerController.update);
router.post('/delete', customerController.remove);
router.get('/slug/:slug', customerController.getBySlug); // Chatbot sayfası
router.get('/:id', customerController.getById); // Form içinde kullanılmak üzere

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const transactionController = require('../Controllers/transactionController');

// router.use(auth);

router.post('/', protect, transactionController.addTransaction);
router.get('/getData', protect, transactionController.getTransactions);
router.get('/summary', protect, transactionController.getSummary);
router.get('/:id', protect, transactionController.getTransaction);
router.put('/:id', protect, transactionController.updateTransaction);
router.delete('/:id', protect, transactionController.deleteTransaction);

module.exports = router;
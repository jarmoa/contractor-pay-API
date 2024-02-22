const express = require('express');
const contractRoutes = require( './contractRoutes');
const jobRoutes = require( './jobRoutes');
const balanceRoutes = require( './balanceRoutes');
const adminRoutes = require( './adminRoutes');

const router = express.Router();

router.use("/contracts", contractRoutes);
router.use('/jobs', jobRoutes);
router.use('/balances', balanceRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
/**
 * @fileoverview Search routes for global search.
 */
const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const { requireAuth } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/search?q=<term>
 * @desc    Global search across users, submissions, comments.
 * @access  Private
 */
router.get("/", requireAuth, searchController.searchAll);

module.exports = router;

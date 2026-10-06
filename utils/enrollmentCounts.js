const Enrollment = require('../models/Enrollment');

async function countBy(field) {
  const rows = await Enrollment.aggregate([
    { $match: { status: 'enrolled' } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } }
  ]);

  const map = {};
  rows.forEach(r => { map[String(r._id)] = r.count; });
  return map;
}

module.exports = { countBy };

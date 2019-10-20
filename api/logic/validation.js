const responses = require("../responses");

module.exports = req => {
  try {
    const b = req.body;
    if (
      !b.firstName ||
      !b.lastName ||
      !b.phoneNum ||
      !b.goals ||
      !b.checkedSMS ||
      !b.checkedTOS
    ) {
      return responses.submission.errors.missingData;
    }
    if (b.phoneNum.length !== 10) {
      return responses.submission.errors.phoneNum;
    }
    if (b.goals.length === 0) {
      return responses.submission.errors.missingGoals;
    }
    return { valid: true };
  } catch (err) {
    return responses.submission.errors.generic;
  }
};

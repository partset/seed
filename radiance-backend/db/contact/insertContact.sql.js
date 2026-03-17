module.exports = {
  insertContact: `
    INSERT INTO contacts (first_name, last_name, email, phone, message, created_at)
    VALUES ($1, $2, $3, $4, $5, NOW())
  `,
};

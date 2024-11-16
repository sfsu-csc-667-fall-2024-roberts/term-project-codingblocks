export const REGISTER_SQL = `
INSERT INTO users (username, email, password, gravatar)
VALUES ($1, $2, $3, $4)
RETURNING id, username, email, gravatar
`;

export const FIND_BY_EMAIL_SQL = `
SELECT * FROM users WHERE email = $1
`;

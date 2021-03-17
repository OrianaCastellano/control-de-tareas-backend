const queries = {

    getUsers: `SELECT * FROM users;`,
    getUsersById: `SELECT * FROM users WHERE id = ?;`,
    getUsersByEmail: `SELECT * FROM users WHERE email = ?;`,
    getUsersByEmailDistinctId: `SELECT * FROM users WHERE email = ? AND id != ?;`,

    insertUser: `
        INSERT INTO users(
            email, 
            password, 
            name
        )
        VALUES(?, ?, ?)`,
    
    updateUser: `
        UPDATE users SET
            email = ?,
            name = ?
        WHERE id = ?
    `,

    getUsersStats: `
            SELECT * FROM task 
            WHERE user_id = ?
            GROUP BY id 
    `


}

module.exports = queries;
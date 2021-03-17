const queries = {
    getTagList: `SELECT * FROM tag WHERE user_id = ?;`,
    insertTag: `INSERT INTO tag (title, user_id) VALUES (?,?);`,
    updateTag: `UPDATE tag SET title = ? WHERE id = ? AND user_id = ?;`,
    deleteTag: `DELETE FROM tag WHERE id = ? AND user_id = ?;`
}

module.exports = queries;
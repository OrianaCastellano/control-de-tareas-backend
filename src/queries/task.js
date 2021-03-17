const queries = {
    getTaskList: `
        SELECT * FROM task 
        WHERE user_id = ? 
        ORDER BY position ASC;
    `,
    getTaskListByText: `
        SELECT * FROM task 
        WHERE user_id = ? AND 
        (title LIKE ? OR description LIKE ?);
    `,
    getTaskById: `SELECT * FROM task WHERE user_id = ? AND id = ?;`,
    getFilesByTaskId: `SELECT * FROM file WHERE task_id = ?;`,
    getTagsByTaskId: `
        SELECT tag.* FROM task_tag 
        INNER JOIN tag ON (
            tag.id = task_tag.tag_id
        ) 
        WHERE task_tag.task_id = ?;`,
    insertTask: `INSERT INTO task (title, date_end, description, user_id, position, date_recordatory) VALUES (?,?,?,?,?,?);`,
    insertTagByTaskId: `INSERT INTO task_tag (tag_id, task_id) VALUES (?,?);`,
    updateTask: `UPDATE task SET title = ?, date_end = ?, description = ?, date_recordatory = ? WHERE id = ? AND user_id = ?;`,
    updateTaskPosition: `UPDATE task SET position = ? WHERE id = ? AND user_id = ?;`,
    updateTaskPinned: `UPDATE task SET pinned = ? WHERE id = ? AND user_id = ?;`,
    updateTaskFinish: `UPDATE task SET date_finish = ? WHERE id = ? AND user_id = ?;`,
    deleteTask: `DELETE FROM task WHERE id = ? AND user_id = ?;`,
    deleteFile: `DELETE FROM file WHERE id = ?;`,
    
    deleteTagByTaskId: `DELETE FROM task_tag WHERE task_id = ? AND tag_id = ?;`,
    getMaxPositionTask: `SELECT MAX(position) + 1 as max_position FROM task WHERE user_id = ? AND date_finish IS NOT NULL GROUP BY user_id LIMIT 1;`,
}

module.exports = queries;
const db = require('./db');
const taskQuery = require('../queries/task');
const fileService = require('../services/file');

class TaskController{
    constructor(){

    }

    getResponse = ()=>{
        return {
          status: 200,
          data: [],
          error: []
        }
      }
    
    getTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            response.data = await db.asyncQuery(taskQuery.getTaskList, [req.user.sub]);
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    getTaskByText = async (req,res)=>{
        const response = this.getResponse();
        try {
            response.data = await db.asyncQuery(taskQuery.getTaskListByText, [req.user.sub, `%${req.query.text}%`,`%${req.query.text}%`]);
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    getTaskById = async (req,res)=>{
        const response = this.getResponse();
        try {
            response.data = await db.asyncQuery(taskQuery.getTaskById, [req.user.sub, req.params.id]);

            if(response.data[0]){
                response.data = response.data[0];
                response.data.files = await db.asyncQuery(taskQuery.getFilesByTaskId, req.params.id);
                response.data.tags = await db.asyncQuery(taskQuery.getTagsByTaskId, req.params.id);
            }else{
                response.status = 404;
                response.error = "NOT_EXIST";
            }

        } catch (error) {
            console.log(error);
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    assignTagByTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            const { task_id, tags} = req.body
            let tagsUploads = [];

            for(let tag of tags){
                try {

                    if(tag.new){
                        let rs = await db.asyncQuery(taskQuery.insertTagByTaskId, [tag.id,task_id]);
                        tag.task_tag_id = rs.insertId;
                        tagsUploads.push(tag);     
                    }else if(tag.delete){
                        await db.asyncQuery(taskQuery.deleteTagTask, [tag.id, task_id]);
                    }

                } catch (error) {
                    console.log(error);
                }
            }

            response.data = {
                task_id,
                tags: tagsUploads
            }

        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';  
        } finally{
            res.status(response.status).send(response);
        }
    }

    createTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            let {title, date_end, description, date_recordatory} = req.body;

            if(date_end)
                date_end = new Date(date_end);

            if(date_recordatory)
                date_recordatory = new Date(date_recordatory);

            //Se agregara la tarea (Siempre al final)
            const tasks = await db.asyncQuery(taskQuery.getMaxPositionTask, [req.user.sub]);
            let max_position = tasks.length ? tasks[0].max_position : 0;

            const rs = await db.asyncQuery(
                taskQuery.insertTask, 
                [
                    title,
                    date_end,
                    description,
                    req.user.sub,
                    max_position,
                    date_recordatory
                ]);

            const files = [];

            for(let file of req.files){
                try {
                    file = await fileService.uploadAttachedFile(file,undefined,rs.insertId,'uploads');
                    files.push(file);
                } catch (error) {
                    console.log(error);
                }
            }

            response.data = {
                id: rs.insertId,
                title,
                date_end,
                date_recordatory,
                description,
                files
            }

        } catch (error) {
            console.log(error);
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    updateTask = async (req,res)=>{
        const response = this.getResponse();
        try {

            let {id, title, date_end, description, date_recordatory,files_delete} = req.body;

            if(date_end)
                date_end = new Date(date_end);

            if(date_recordatory)
                date_recordatory = new Date(date_recordatory);

            //Se agregara la tarea (Siempre al final)
            const rs = await db.asyncQuery(
                taskQuery.updateTask, 
                [
                    title,
                    date_end,
                    description,
                    date_recordatory,
                    id,
                    req.user.sub
                ]);

            const files = [];

            //Inserto los nuevos archivos
            for(let file of req.files){
                try {
                    file = await fileService.uploadAttachedFile(file,undefined,id,'uploads');
                    files.push(file);
                } catch (error) {
                    console.log(error);
                }
            }

            //Elimino los archivos del array
            if(files_delete){
                try {
                    const files_id = JSON.parse(files_delete);
                    if(files_id.length){
                        for(let id of files_id){
                            await db.asyncQuery(taskQuery.deleteFile, [id]);
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            response.data = {
                id,
                title,
                date_end,
                date_recordatory,
                description,
                files
            }
            
        } catch (error) {
            console.log(error);
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    updatePositionTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            for(let task of req.body.task){
                await db.asyncQuery(taskQuery.updateTaskPosition, [task.position, task.id, req.user.sub]);
            }
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    updateStatusTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            for(let task of req.body.task){
                await db.asyncQuery(taskQuery.updateTaskFinish, [
                    task.finish ? new Date(): null, 
                    task.id, 
                    req.user.sub
                ]);
            }
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    updatePinnedTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            for(let task of req.body.task){
                await db.asyncQuery(taskQuery.updateTaskPinned, [task.pinned, task.id, req.user.sub]);
            }
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    deleteTask = async (req,res)=>{
        const response = this.getResponse();
        try {
            await db.asyncQuery(taskQuery.deleteTask, [req.params.id, req.user.sub]);
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

}

module.exports = new TaskController();
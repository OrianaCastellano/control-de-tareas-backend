const db = require('./db');
const tagQuery = require('../queries/tag');

class TagController{

    constructor(){

    }

    getResponse = ()=>{
        return {
          status: 200,
          data: [],
          error: []
        }
      }
    
    getTag = async (req,res)=>{
        const response = this.getResponse();
        try {
            response.data = await db.asyncQuery(tagQuery.getTagList, [req.user.sub]);
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    createTag = async (req,res)=>{
        const response = this.getResponse();
        try {
            const rs = await db.asyncQuery(
                tagQuery.insertTag, 
                [
                    req.body.title,
                    req.user.sub
                ]
            );

            response.data = {
                id: rs.insertId,
                title: req.body.title
            }

        } catch (error) {
            console.log(error);
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    updateTag = async (req,res)=>{
        const response = this.getResponse();
        try {
            const {title, id} = req.body;
            //Se agregara la tarea (Siempre al final)
            const rs = await db.asyncQuery(
                tagQuery.updateTag, 
                [
                    title,
                    id,
                    req.user.sub
                ]
            );

            response.data = {
                id,
                title
            }
            
        } catch (error) {
            console.log(error);
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

    deleteTag = async (req,res)=>{
        const response = this.getResponse();
        try {
            await db.asyncQuery(tagQuery.deleteTag, [req.params.id, req.user.sub]);
        } catch (error) {
            response.status = 500;
            response.error = 'SERVER_ERROR';
        }finally{
            res.status(response.status).send(response)
        }
    }

}

module.exports = new TagController();
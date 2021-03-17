const path = require('path')
const fs = require('fs/promises');
const db = require('../controllers/db')

const uploadAttachedFile = async (file, alt, taskId, folder = 'files') => {


    // params validation
    if(!file)
      throw 'REQUIRED_FILE'

    // set default alt text
    if(!alt)
      alt = ''

    // author id validation
    if(!taskId)
      throw 'REQUIRED_TASK'

    let filename = 'file_' + (new Date().getTime()).toString(16) + '.' + file.originalname.split('.')[file.originalname.split('.').length-1],
        urlOriginal = path.join(__dirname, `../../public/${folder}/` + filename),
        uri = folder + '/' + filename;

    
    // TODO: size validation
    // let size = parseInt((base64string).replace(/=/g,"").length * 0.75)
    // if(size > 9000)
    //   throw 'FILE_SIZE_EXCEEDED'

    try {
      await fs.mkdir(urlOriginal.split('/'+filename)[0], { recursive: true });
    } catch (error) {
      console.log(error);
    }

    try {
      await fs.writeFile(urlOriginal, file.buffer);
    } catch (error) {
      throw 'FILE_SAVE_ERROR'
    }

    const fileData = {
      url: uri,
      filename: filename,
      alt: alt,
      type: `${file.mimetype}`
    }

    const result = await db.asyncQuery(
      `INSERT INTO file(url, filename, type, alt, task_id) VALUES(?, ?, ?, ?, ?)`,
      [
        fileData.url,
        fileData.filename,
        fileData.type,
        fileData.alt,
        taskId
      ]
    ) 
      
    return {id: result.insertId, url: uri};
}

module.exports = {
  uploadAttachedFile
}

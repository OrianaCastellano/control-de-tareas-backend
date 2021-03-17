
const printErrors = (errorsArray) => {
  try {
    return errorsArray.map(error => error.msg)
  }
  catch(e) {
    return ['GENERAL_ERROR']
  }
}


module.exports = {
  printErrors
}

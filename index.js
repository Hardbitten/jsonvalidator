const Validator = require('jsonschema').Validator;
const v = new Validator();
const utilityhandler = require("utilityhandler")

const baseValidation = (Params, Schema) => {
    const Errors = v.validate(Params, Schema)["errors"]
    const ErrorResponse = {Error: false, ErrorData: []}
    if(utilityhandler.isEmpty(Errors)){
        ErrorResponse.Error = false
        return ErrorResponse
    } else {
        ErrorResponse.Error = true
        for(let i = 0; i < Errors.length; i++) {

            // Field Name
            let instance = Errors[i].property.split("instance.")[1]
            
            // Field Properties
            let instanceSchema = Errors[i].schema

            // Error Message
            let errorMessage = Errors[i].stack.split("instance.")[1]

            // All togather in one Object
            let ErrorData = {
                FieldName: instance,
                Schema: instanceSchema,
                Message: errorMessage
            }

            // push Error Data into Array
            ErrorResponse.ErrorData.push(ErrorData)
        }
        return ErrorResponse
    }
}

module.exports = (Params, Schema) => {
    let Param = { Status: 1, Message: "", Code: 200, Data: { } }
    const Validation = baseValidation(Params, Schema)
      if(Validation.Error) {
        Param.Code = 422
        Param.Status = 0
        Param.Data = Validation.ErrorData
        return Param
      } else
        return Param
  
  }
class ApiError{
    constructor(code, message){
        this.code = code
        this.message = message
    }

    static badRequest(msg){
        return new ApiError(400, msg)
    }

    static serverError(msg){
        return new ApiError(500, msg)
    }
}

module.exports = ApiError
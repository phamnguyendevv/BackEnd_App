

class ErrorWithStatus {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}


class EntityError extends ErrorWithStatus {
    
    constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }) {
        super(HTTP_STATUS.UNPROCESSABLE_ENTITY, message); 
        this.errors = errors;

        
    }
}

module.exports =  EntityError





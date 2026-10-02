exports.SUCCESS = (message, data) => {
    return {
        status: 200,
        message: message,
        results: data,
        data: data
    }
}
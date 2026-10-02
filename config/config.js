module.exports ={
        databaseConnection:{
            username:process.env.USER_NAME,
            password:process.env.PASSWORD,
            database:process.env.DATABASE,
            host:process.env.HOST,
            dialect: process.env.DB_DIALECT
        }
}
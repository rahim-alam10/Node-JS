import fs from  "fs"

function logReqRes(filename){
    return(req, res, next) =>{
        fs.appendFile(
            filename
            ,`\n${Date.now()}:${req.method}:${req.path}\n`,
            (err, data) => {
                next();
            }
        )
    }
}

export default logReqRes;
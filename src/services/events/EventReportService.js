const { OK_LBL } = require("../../constants/messages");
const { EventReport } = require("../../data/model/EventReport");
const { logError, logInfo } = require("../../helpers/Logger");
const { setOkResponse, setErrorResponse } = require("../../helpers/ResponseHelper");
const { getUserId } =  require("../authentication/FirebaseService");
const {create, findOne} = require("../../helpers/QueryHelper");
const { EventReportCategory } = require("../../data/model/EventReportCategory");
const { eventExists } = require("./EventService");

const handleCreateEventReport = async (req, res) => {
    const body = req.body;
    const id = await getUserId(req);
    console.log(id);
    if (!body.event_id || !(await eventExists(body.event_id))){
        return setErrorResponse("El campo event_id tiene que especificar un evento existente",res);
    }
    if (!body.text || body.text === ""){
        return setErrorResponse("No text",res);
    }
    if (!body.categories || body.categories.length === 0){
        return setErrorResponse("No categories",res);
    }
    for (const category of body.categories){
        const response = await findOne(EventReportCategory, {id: category});
        if (!response){
            return setErrorResponse(`Categoria de denuncia con id ${category} no existe`,res);
        }
    }
    const reportCreated = await create(EventReport,{
        reporter_id:id ,
        text: body.text,
        event_id: body.event_id
    }).then(async (reportCreated) => {
        await reportCreated.addReport_category(body.categories);
        return reportCreated;
    }).catch((err) => {
        logError(err);
        return null;
    });
    if (reportCreated == null){
        return setErrorResponse("Error al crear la denuncia",res);
    }

    return setOkResponse(OK_LBL,res);
}

module.exports = {
    handleCreateEventReport
}
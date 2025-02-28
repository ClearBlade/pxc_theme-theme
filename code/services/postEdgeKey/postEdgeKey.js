/**
 * Microservice: postEdgeKey
 * Description: Stores the public key on the IA system for the correct Edge.
 * @param {CbServer.BasicReq} req
 * @param {CbServer.Resp} resp
 */
function postEdgeKey(req, resp) {
    var hardwareId = req.params.hardware_id;
    var publicKey = req.params.public_key;

    if (!hardwareId || !publicKey) {
        resp.error("Missing required parameters: hardware_id or public_key.");
        return;
    }

    var systemKey = req.systemKey; // Use IA system key

    var edgePublicKeyUrl = "https://demo.clearblade.com/admin/edges/public_key/" + systemKey + "/" + hardwareId;
    var requestOptions = {
        uri: edgePublicKeyUrl,
        method: "POST",
        headers: {
            "ClearBlade-UserToken": req.userToken, // Running as iasystemcreator
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "public_key": publicKey,
            "allow_expired": false
        })
    };

    var requestObject = Requests();
    requestObject.post(requestOptions, function (err, response) {
        if (err) {
            resp.error(`Error updating Edge public key in IA system: ${JSON.stringify(err)}`);
        } else {
            resp.success({
                message: "Public key successfully stored in IA system.",
                hardware_id: hardwareId
            });
        }
    });
}
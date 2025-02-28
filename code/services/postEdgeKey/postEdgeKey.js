/**
 * Microservice: postEdgeKey
 * Description: Stores the public key on the IA system for the correct Edge.
 * @param {CbServer.BasicReq} req
 * @param {CbServer.Resp} resp
 */
function postEdgeKey(req, resp) {
    console.log("postEdgeKey function invoked.");

    var hardwareId = req.params.hardware_id;
    var publicKey = req.params.public_key;

    console.log("Received parameters:", { hardwareId, publicKey });

    if (!hardwareId || !publicKey) {
        console.error("Missing required parameters: hardware_id or public_key.");
        resp.error("Missing required parameters: hardware_id or public_key.");
        return;
    }

    var systemKey = req.systemKey; // Use IA system key
    console.log("System Key:", systemKey);

    var edgePublicKeyUrl = "https://demo.clearblade.com/admin/edges/public_key/" + systemKey + "/" + hardwareId;
    console.log("Edge Public Key URL:", edgePublicKeyUrl);

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

    console.log("Request Options:", requestOptions);

    var requestObject = Requests();
    requestObject.post(requestOptions, function (err, response) {
        if (err) {
            console.error("Error updating Edge public key in IA system:", err);
            resp.error('Error updating Edge public key in IA system');
        } else {
            console.log("Public key successfully stored in IA system:", response);
            resp.success({
                message: "Public key successfully stored in IA system.",
                hardware_id: hardwareId
            });
        }
    });
}

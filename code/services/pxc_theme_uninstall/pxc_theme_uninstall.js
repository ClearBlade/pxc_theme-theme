/**
 * @typedef {{prefix: string, entity_id: string, component_id: string, mfe_settings: Record<string, unknown>}} InstallParams
 * @param {CbServer.BasicReq & {params: InstallParams}} req
 * @param {CbServer.Resp} resp
 */

function pxc_theme_uninstall(req, resp) {
  const systemKey = req.systemKey;
  const userToken = req.userToken;
  const collectionName = "custom_settings"; 
  const settingsUrl = "https://demo.clearblade.com/api/v/1/collection/" + systemKey + "/" + collectionName;

  function deleteItemById(itemId) {
      const query = {
          "id": itemId 
      };
      
      const deleteOptions = {
          method: "DELETE",
          headers: {
              "Content-Type": "application/json",
              "ClearBlade-UserToken": userToken
          },
          body: JSON.stringify({ query }) 
      };
      
      return fetch(settingsUrl, deleteOptions);
  }

  Promise.all([
      deleteItemById("brand"),
      deleteItemById("theme")
  ])
  .then(function (responses) {
      for (var i = 0; i < responses.length; i++) {
          if (!responses[i].ok) {
              throw new Error("Failed to delete an item: " + responses[i].statusText);
          }
      }
      return Promise.all(responses.map(function (response) {
          return response.json();
      }));
  })
  .then(function (responseData) {
      log("PxC Theme Component Uninstalled Successfully: " + JSON.stringify(responseData));
      resp.success("PxC Theme Component Uninstalled Successfully!");
  })
  .catch(function (error) {
      log("Error in uninstallation: " + JSON.stringify(error));
      resp.error("Failed to uninstall PxC Theme Component: " + JSON.stringify(error));
  });
}

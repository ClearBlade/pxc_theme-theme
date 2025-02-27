/**
 * @typedef {{prefix: string, entity_id: string, component_id: string, mfe_settings: Record<string, unknown>}} InstallParams
 * @param {CbServer.BasicReq & {params: InstallParams}} req
 * @param {CbServer.Resp} resp
 */

function pxc_theme_uninstall(req, resp) {
  const systemKey = req.systemKey;
  const userToken = req.userToken;
  const collectionName = "custom_settings"; 
  const settingsUrl = `https://demo.clearblade.com/api/v/1/collection/${systemKey}/${collectionName}`;

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
  .then(responses => {
      for (let response of responses) {
          if (!response.ok) {
              throw new Error("Failed to delete an item: " + response.statusText);
          }
      }
      return Promise.all(responses.map(response => response.json()));
  })
  .then(responseData => {
      log("PxC Theme Component Uninstalled Successfully: " + JSON.stringify(responseData));
      resp.success("PxC Theme Component Uninstalled Successfully!");
  })
  .catch(error => {
      log("Error in uninstallation: " + JSON.stringify(error));
      resp.error("Failed to uninstall PxC Theme Component: " + JSON.stringify(error));
  });
}

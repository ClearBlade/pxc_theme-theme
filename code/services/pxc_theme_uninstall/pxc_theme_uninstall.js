/**
 * @typedef {{prefix: string, entity_id: string, component_id: string, mfe_settings: Record<string, unknown>}} InstallParams
 * @param {CbServer.BasicReq & {params: InstallParams}} req
 * @param {CbServer.Resp} resp
 */

function pxc_theme_uninstall(req, resp) {
  var systemKey = req.systemKey;
  var userToken = req.userToken;
  var collectionName = "custom_settings"; 
  var settingsUrl = "https://demo.clearblade.com/api/v/1/collection/" + systemKey + "/" + collectionName;

  // New default branding configuration
  var brandingData = {
      id: "brand",
      config: JSON.stringify([{
          title: {
              titleText: "ClearBlade"
          },
          logo: {
              logoUrl: "https://i.postimg.cc/YqW2542y/Copy-of-Clear-Blade-Logo-White.png",
              position: "right"
          }
      }]),
      description: "Default Branding Configuration for ClearBlade"
  };

  // New default theme configuration
  var themeData = {
      id: "theme",
      config: JSON.stringify([{
          palette: {
              primary: {
                  lightMode: "#000000"
              },
              banner: {
                  lightMode: "#242424",
                  darkMode: "#27EBAF"
              }
          }
      }]),
      description: "Default Theme Configuration"
  };

  function updateSettings(data) {
      var updateOptions = {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "ClearBlade-UserToken": userToken
          },
          body: JSON.stringify(data)
      };
      return fetch(settingsUrl, updateOptions);
  }

  Promise.all([
      updateSettings(brandingData),
      updateSettings(themeData)
  ])
  .then(function(responses) {
      for (var i = 0; i < responses.length; i++) {
          if (!responses[i].ok) {
              throw new Error("Failed to update settings: " + responses[i].statusText);
          }
      }
      return Promise.all(responses.map(function(response) {
          return response.json();
      }));
  })
  .then(function(responseData) {
      log("PxC Theme Component Uninstalled by Resetting to Defaults: " + JSON.stringify(responseData));
      resp.success("PxC Theme Component Uninstalled Successfully - Reset to Defaults!");
  })
  .catch(function(error) {
      log("Error in uninstallation: " + error.message);
      resp.error("Failed to uninstall PxC Theme Component: " + error.message);
  });
}

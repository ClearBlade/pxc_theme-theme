/**
 * @typedef {{prefix: string, entity_id: string, component_id: string, mfe_settings: Record<string, unknown>}} InstallParams
 * @param {CbServer.BasicReq & {params: InstallParams}} req
 * @param {CbServer.Resp} resp
 */

function pxc_install(req, resp) {
  
  var params = req.params;
  var entity_id = params.entity_id;
  var component_id = params.component_id;
  var mfe_settings = params.mfe_settings;
  var systemKey = req.systemKey; 
  var userToken = req.userToken; 

  var brandingData = {
      id: "brand",
      config: JSON.stringify([{
          logo: {
              logoUrl: "https://symbols-electrical.getvecta.com/stencil_262/69_phoenix-contact-icon.72917d2b46.png"
          },
          title: {
              titleText: "Phoenix Contact"
          }
      }]),
      description: "Branding Configuration for Phoenix Contact"
  };

  var brandingUrl = "https://demo.clearblade.com/api/v/1/collection/" + systemKey + "/custom_settings";
  var brandingOptions = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "ClearBlade-UserToken": userToken
      },
      body: JSON.stringify(brandingData)
  };

  fetch(brandingUrl, brandingOptions)
      .then(function (response) {
          if (!response.ok) {
              throw new Error("Failed to create branding data: " + response.statusText);
          }
          return response.json();
      })
      .then(function (responseData) {
          log("Branding data created successfully: " + JSON.stringify(responseData));
          var configData = JSON.parse(brandingData.config);
          var pxcLogoUrl = configData[0].logo.logoUrl;

          var themeData = {
              entity_id: entity_id,
              component_id: component_id,
              settings: JSON.stringify(mfe_settings),
              logo_url: pxcLogoUrl
          };

          var themeUrl = "https://demo.clearblade.com/api/v/1/collection/" + systemKey + "/custom_settings";
          var themeOptions = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "ClearBlade-UserToken": userToken
              },
              body: JSON.stringify(themeData)
          };

          return fetch(themeUrl, themeOptions);
      })
      .then(function (response) {
          if (!response.ok) {
              throw new Error("Failed to create theme data: " + response.statusText);
          }
          return response.json();
      })
      .then(function (responseData) {
          log("Theme data created successfully: " + JSON.stringify(responseData));
          resp.success("PxC Theme Component Installed Successfully with Logo from custom_settings!");
      })
      .catch(function (error) {
          log("Error in installation: " + JSON.stringify(error));
          resp.error("Failed to install PxC Theme Component: " + JSON.stringify(error));
      });
    }

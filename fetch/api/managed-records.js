import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

const primaryColors = ["red", "blue", "yellow"];

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
  //set options if not passed in
  options = options || {};
  let colors = options.colors || ["red", "brown", "blue", "yellow", "green"];
  const limit = 11;
  let page = options.page || 1;
  let offset = (page - 1) * 10;

  //builds our request URL with options
  let requestURL = URI(window.path)
                         .addSearch("offset", offset)
                         .addSearch("limit", limit)
                         .addSearch("color[]", colors);

  return fetch(requestURL)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw ('error message ' + response.status);
            }
          }).then((retrievedRecords) => {
            //our transformed data that will ultimately be returned
            let transformedData = {
              "ids": [],
              "open": [],
              "closedPrimaryCount": 0,
              "previousPage": null,
              "nextPage": null
            };

            if (page !== 1) {
              transformedData["previousPage"] = page - 1;
            }

            if (retrievedRecords.length === 0) {
              return transformedData;
            }

            if (retrievedRecords.length === limit) {
              transformedData["nextPage"] = page + 1;
              retrievedRecords.pop();
            }

            retrievedRecords.forEach((record) => {

              let primaryColor = isPrimaryColor(record["color"]);
              transformedData["ids"].push(record["id"]);

              if (record["disposition"] === "open") {
                record["isPrimary"] = primaryColor;
                transformedData["open"].push(record);
              } else {
                if (primaryColor) {
                  transformedData["closedPrimaryCount"] = transformedData["closedPrimaryCount"] + 1;
                }
              }
            })

            return transformedData;
          }).catch((error) => {
            console.log(error);
          });
}

//helper function to determine whether a color is considered primary
function isPrimaryColor(color) {
  return primaryColors.indexOf(color) !== -1 ? true : false;
}

export default retrieve;

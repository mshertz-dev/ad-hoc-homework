import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";
const primaryColors = ["red", "blue", "yellow"];

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
  options = options || {};
  let colors = options.colors || ["red", "brown", "blue", "yellow", "green"];
  const limit = 11;
  let page = options.page || 1;
  let offset = (page - 1) * 10;

  //addSearch test, using search compiles the same query
  let requestURL = URI("http://localhost:3000/records")
                         .addSearch("offset", offset)
                         .addSearch("limit", limit)
                         .addSearch("color[]", colors);
  console.log('requestURL is ' + requestURL);

  return fetch(requestURL)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.log('error message ' + response.status);
              // throw new Error(response.status);
            }
          }).then((retrievedRecords) => {
            let transformedData = {
              "ids": [],
              "open": [],
              "closedPrimaryCount": 0,
              "previousPage": null,
              "nextPage": null
            };
            if (retrievedRecords.length === 0) {
              return transformedData;
            }
            if (page !== 1) {
              transformedData["previousPage"] = page - 1;
            }
            if (retrievedRecords.length === 10) {
              transformedData["nextPage"] = null;
            } else {
              transformedData["nextPage"] = page + 1;
              retrievedRecords.pop();
            }
            console.log("the previous page is " + transformedData["previousPage"]);
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
              console.log(`'here's a record`);
              console.log(record);
              console.log(transformedData["ids"]);
              console.log(transformedData["closedPrimaryCount"]);
            })
            return transformedData;
          }).catch((error) => {
            console.log('error ' + error);
          })
}

function isPrimaryColor(color) {
  return primaryColors.indexOf(color) !== -1 ? true : false;
}

export default retrieve;

import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...
function retrieve(options) {
  let colors = options.colors || ["red", "brown", "blue", "yellow", "green"];
  const limit = 10;
  let page = options.page || 1;
  let offset = (page - 1) * 10;

  //addSearch test, using search compiles the same query
  let requestURL = URI("http://localhost:3000/records")
                         .addSearch("offset", offset)
                        //  .addSearch(`color[]`, colors)
                         .addSearch("limit", 10);

  // const requestURL = URI(window.path).search({offset: offset, `color[]`: colors, limit: 10});
  //delete this console log
  console.log(requestURL);
  return fetch(requestURL)
          .then((response) => {
            if (response.ok) {
              //delete console log
              console.log('got response, incoming');
              console.log(response.data);
              return response.json();
            } else {
              throw new Error(response.status);
            }
          }).then((retrievedRecords) => {
            let transformedData = {
              "ids": [],
              "open": [],
              "closedPrimaryCount": 0
            };
            retrievedRecords.forEach((record) => {
              transformedData["ids"].push(record["id"]);
              console.log(`'here's a record`);
              console.log(record);
              console.log(transformedData["ids"]);
            })
          })
          // .catch((error) => {
          //   console.log(error);
          // });
}

export default retrieve;

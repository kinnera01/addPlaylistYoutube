// var gettingids = function() {
  var SolrNode = require("solr-node");
  var client = new SolrNode({
    host: "aurora.cs.rutgers.edu",
    port: "8181",
    core: "discogs_data_test"
    // protocol: "http"
  });
  var youtubeids = [];
  const express = require("express");
  const app = express();
  var strQuery = client
    .query()
    .q({ releaseDate: "2016" })
    .sort({ viewcountRate: "desc" })
    .start(0)
    .rows(20);
  client.search(strQuery, function(err, result) {
    if (err) {
      console.log(err);
      return;
    }
    // console.log("Response:", result.response.docs);
    var docs = result.response.docs;
    docs.forEach(element => {
      youtubeids.push(element.youtubeId);
    });
    return youtubeids;
  });

// };
// gettingids();

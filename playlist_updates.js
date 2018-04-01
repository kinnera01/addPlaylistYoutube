// Define some variables used to remember state.
// var songsdata = require("../data/youtubeapi");
var playlistId, channelId;
var year;
// console.log("ids:"+youtubeids);
// After the API loads, call a function to enable the playlist creation form.
function handleAPILoaded() {
  enableForm();
}

// Enable the form for creating a playlist.
function enableForm() {
  $("#playlist-button").attr("disabled", false);
}

// Create a private playlist.
function createPlaylist() {
  var title = $("#Title").val();
  var description = $("#Desciption").val();
  console.log(title);
  console.log(description);
  var request = gapi.client.youtube.playlists.insert({
    part: "snippet,status",
    resource: {
      snippet: {
        title: title,
        description: description
      },
      status: {
        privacyStatus: "public"
      }
    }
  });
  
  request.execute(function(response) {
    console.log(response);
    var result = response.result;
    console.log(result);
    if (result) {
      playlistId = result.id;
      // console.log(playlistId)
      $("#playlist-id").val(playlistId);
      $("#playlist-Id").html(result.id);
      // $('#playlist-title').html(result.snippet.title);
      // $('#playlist-description').html(result.snippet.description);
    } else {
      $("#status").html("Could not create playlist");
    }
  });
}
function getyoutubeids(){
console.log("HEY I AM IN YIDS")
  // $("#year").empty();
  var year=$("#year").val();
  var url="//aurora.cs.rutgers.edu:8181/solr/discogs_data_test/select?q=releaseDate:"+year+'&sort=viewcountRate%20desc&start=0&rows=50&wt=json&indent=true';
  $.ajax({
    url: url,
    method: "GET"
  }).done(function (response) {
    console.log(response)
  })
}
// var videoId=["ZG1Su0QwPYs","_JVghQCWnRI","Y-xZIECiTwk"]
// Add a video ID specified in the form to the playlist.
function addVideoToPlaylist() {
  // addToPlaylist($('#playlist-id').val());
  getyoutubeids();
  //addToPlaylist($("#video-id").val());
}

// Add a video to a playlist. The "startPos" and "endPos" values let you
// start and stop the video at specific times when the video is played as
// part of the playlist. However, these values are not set in this example.
function addToPlaylist(id, startPos, endPos) {
  var playid = $("#playlist-id").val();
  console.log(
    "in addToPlaylist with " + id + "sending to playlist : " + playid
  );
  var details = {
    playlistId: playid,
    videoId: id,
    kind: "youtube#video"
  };
  console.log(details);
  if (startPos != undefined) {
    details["startAt"] = startPos;
  }
  if (endPos != undefined) {
    details["endAt"] = endPos;
  }
  // console.log(playlistId);
  var request = gapi.client.youtube.playlistItems.insert({
    part: "snippet",
    resource: {
      snippet: {
        playlistId: details.playlistId,
        resourceId: details
      }
    }
  });
  //console.log(request)
  request.execute(function(response) {
    $("#status").html("<pre>" + JSON.stringify(response.result) + "</pre>");
  });
}
function addTheseVideosToPlaylist() {
  var links = youtubeids;
  var counter = 0;
  function addVideosToPlaylist() {
    myLoop(links[0]);
  }
  function myLoop(video_id) {
    addToPlaylist(video_id);
    setTimeout(function() {
      counter++;
      if (counter < links.length) myLoop(links[counter]);
    }, 3000);
  }
}
// var url="http://aurora.cs.rutgers.edu:8181/solr/discogs_data_test/select?q=*%3A*"+query+'&start=0&rows=50&wt=json&indent=true';
// //solr
// function on_data(data) {
//   $('#results').empty();
//   var docs = data.response.docs;
//   $.each(docs, function(i, item) {
//       $('#results').prepend($('<div>' + item.name + '</div>'));
//   });

//   var total = 'Found ' + docs.length + ' results';
//   $('#results').prepend('<div>' + total + '</div>');
// }

// function on_search() {
//   var query = $('#query').val();
//   if (query.length == 0) {
//       return;
//   }

//   var url='http://xxxx.xxx.xxxx.xxx/xxx_xxx/core0/selectcore0/select/?q='+query+'&version=2.2&start=0&rows=50&indent=on&wt=json&callback=?&json.wrf=on_data';
//   $.getJSON(url);
// }

// function on_ready() {
//   $('#search').click(on_search);
//   /* Hook enter to search */
//   $('body').keypress(function(e) {
//       if (e.keyCode == '13') {
//           on_search();
//       }
//   });
// }
// // var youtubeids = [];
// // const express = require("express");
// // const app = express();
// // var strQuery = client
// //   .query()
// //   .q({ releaseDate: "2016" })
// //   .sort({ viewcountRate: "desc" })
// //   .start(0)
// //   .rows(20);
// // client.search(strQuery, function(err, result) {
// //   if (err) {
// //     console.log(err);
// //     return;
// //   }
// //   // console.log("Response:", result.response.docs);
// //   var docs = result.response.docs;
// //   docs.forEach(element => {
// //     youtubeids.push(element.youtubeId);
// //   });
// //   console.log(youtubeids);
// //   return youtubeids;
// // });
// $(document).ready(on_ready);
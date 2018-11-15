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
    var result = response.result;
    console.log(result);
    if (result) {
      playlistId = result.id;
      // console.log(playlistId)
      $("#playlist-id").val(playlistId);
      $("#playlist-Id").html(result.id);
    } else {
      $("#status").html("Could not create playlist");
    }
  });
}

// var videoId=["ZG1Su0QwPYs","_JVghQCWnRI","Y-xZIECiTwk"]
// Add a video ID specified in the form to the playlist.
var addVideoToPlaylist=function() {
  getyoutubeids();
  //addToPlaylist($("#video-id").val());
}
function getyoutubeids(){
  console.log("HEY I AM IN YIDS")
    // $("#year").empty();
    var year=$("#year").val();
    // console.log(year);
    //aurora.cs.rutgers.edu:8181/solr/discogs_data_test/select?q=releaseDate:"+year+'&sort=viewcountRate%20desc&start=0&rows=50&wt=json&indent=true
    var queryurl="//aurora.cs.rutgers.edu:8181/solr/#/discogs_data_test/query/select?q=releaseDate:"+year+"&sort=viewcountRate=desc&start=0&rows=50&wt=json&indent=true";
    jQuery.support.cors = true;
      $.getJSON(queryurl).done(function(res){
      //   console.log("HEY")
      // console.log("i am response"+res.response.docs)
      var docs = res.response.docs;
      console.log(docs)
        docs.forEach(element => {
          // youtubeids.push(element.youtubeId);
          console.log(element.youtubeId);
          addToPlaylist(element.youtubeId);
        });
      });
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
}
// Define some variables used to remember state.
var playlistId, channelId;
console.log("ids:"+youtubeids);
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
  console.log(request);
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
// var videoId=["ZG1Su0QwPYs","_JVghQCWnRI","Y-xZIECiTwk"]
// Add a video ID specified in the form to the playlist.
function addVideoToPlaylist() {
  // addToPlaylist($('#playlist-id').val());
  addToPlaylist($("#video-id").val());
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

var EVENTBRITE_URL = 'https://www.eventbriteapi.com/v3/events/search/',
    TOKEN = 'GNF3M2PCP767DCKDYJZF',
    WEEK = "this_week",
    cityDiv = $('city'),
    stateDiv = $('state'),
    thisWeekEventsList = $('#this-week-events-list'),
    loadingMsg = $('#loading-msg');

var clearPreviousSearchResult = function(){
  $('#event-wrapper').remove();
}


var checkValidInput = function(city, state){
  if(city=="" || state==""){
    throw new Error("Please enter valid city and state");
  }
  return;
}

var displayLoadingMsg = function(){
  loadingMsg.html("Loading Events...")
}

var removeLoadingMsg = function(){
  loadingMsg.remove();
}


var makeEventsRequest = function() {
  clearPreviousSearchResult();
  var city  = cityDiv.val();
  var state = stateDiv.val();

  checkValidInput(city, state);

  displayLoadingMsg();

  var settings = {
    token: TOKEN,
    'venue.city': city,
    'venue.region': state,
    'start_date.keyword': WEEK,
    'expand': 'venue'
  };

  $.get(EVENTBRITE_URL, settings, displayEvents);
};


var constructEventHtml = function(parentDiv, event){
  var eventContent = "";
  eventContent += "<div id=event-wrapper>";
  eventContent += "<h3><a href='" + event.url + "'>" + event.name.text + "</a></h3>";
  eventContent += "<p>Location: " + event.venue.address.address_1 +" "
                                     + event.venue.address.address_2 + "</p>";
  eventContent += "<p>Date/Time: " + stringifyUtcDate(event.start.local) + "</p>";
  eventContent += "<p>This event is " + event.status + "!!</p>";
  eventContent += "</div>";

  // attach event to parent div
  parentDiv.append(eventContent);
}


var displayEvents = function(data) {
  removeLoadingMsg();
  var events = data.events;
  if (events.length){
    for (var i = 0; i < Math.min(events.length, 20); i++){
      var event = events[i];
      console.log(event);
      constructEventHtml(thisWeekEventsList, event);
    }
  } else {
    console.log("display failed")
  }
};


var stringifyUtcDate = function(utc){
  var date = new Date(utc);
  return date.toString();
}


$(document).ready(function(){
  var searchForm = $('#search-event');
  searchForm.submit(function(event){
    event.preventDefault();
    makeEventsRequest();
  });
});
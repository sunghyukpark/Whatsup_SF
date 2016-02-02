var EVENTBRITE_URL = 'https://www.eventbriteapi.com/v3/events/search/',
    TOKEN = 'GNF3M2PCP767DCKDYJZF',
    DESC_MAX_LENGTH = 200,
    WEEK = "this_week",
    cityDiv = $('city'),
    stateDiv = $('state'),
    thisWeekEventsList = $('#this-week-events-list'),
    loadingMsg = $('#loading-msg');

var clearPreviousSearchResult = function(){
  thisWeekEventsList.empty();
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

var removeSearchDiv = function(){

}


var constructEventHtml = function(parentDiv, event){
  removeSearchDiv();
  var eventContent = "";
  eventContent += "<h3><b><a href='" + event.url + "'>" + event.name.text + "</a><b></h3>";
  eventContent += "<p>Location: " + event.venue.address.address_1 +" "
                                     + event.venue.address.address_2 + "</p>";
  eventContent += "<p>Date/Time: " + event.start.local + "</p>";
  eventContent += "<p><b>This event is " + event.status + "!!<b></p>";

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

  // // Buffer event details into 'eventListHTML' and append to the DOM once
  // var eventListHTML = '';
  // for (var i = 0, len = events.length; i < len; i++) {
  //   var name = events[i].name.text;
  //   var description = truncate(events[i].description.text);
  //   var startTime = formatTime(events[i].start.utc);
  //   var eventUrl = events[i].url;
  //   eventListHTML += '<div class="event-title"><a href="' + eventUrl + '" class="event-link">' + name + '</a></div>';
  //   eventListHTML += '<div>' + startTime + '</div>';
  //   eventListHTML += '<p>' + description + '</p>';
  // }
  // weeklyEvents.append(eventListHTML);
  // eventsContainer.show();

  // // cache results so they will still be available after popup close
  // storeEventListHTML(eventListHTML);
  // // Make event links clickable
  // attachLinkEventHandler();


// Helpers

/**
 * Truncate 'str' to 'DESCRIPTION_MAX_LEN' characters.
 */
var truncate = function(str) {
  var trunced = str.substring(0, DESCRIPTION_MAX_LEN);
  if (trunced.length < str.length) {
    trunced += '...';
  }
  return trunced;
};

/**
 * Convert UTC to local time and date.
 * e.g. '2015-03-22T03:00:00Z' --> 'Saturday, 3/21, 8 PM PDT'
 */
var formatTime = function(utc) {
  var date = new Date(utc);
  return date.toLocaleTimeString('en-US', {
    weekday: 'long',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    timeZoneName: 'short'
  });
};

// Cache handlers

var storeLocation = function() {
  chrome.storage.sync.set({
    city: cityInput.val(),
    state: stateInput.val()
  });
};

var getStoredLocation = function(callback) {
  chrome.storage.sync.get(['city', 'state'], callback);
};

var storeEventListHTML = function(html) {
  chrome.storage.sync.set({ eventListHTML: html });
};

var getStoredEventListHTML = function(callback) {
  chrome.storage.sync.get('eventListHTML', callback);
};

var clearStoredEventListHTML = function() {
  chrome.storage.sync.remove('eventListHTML');
};


$(document).ready(function(){
  var searchForm = $('#search-event');
  searchForm.submit(function(event){
    event.preventDefault();
    makeEventsRequest();
  });
});
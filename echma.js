$(document).ready(function() {
  // The setInterval timer
  var setTimer;
  // The actual state (work or break)
  var state = "work";
  // Pomodoro progress bar
  var progress = $("#pomodoro-progress");
  // pause/resume
  var pause = false;
  // Alarm sound
  var alarm = new Audio("https://www.rhcapati.com.br/sounds/pen/pomodoro/beep.mp3");
  
  // Calculate the total progress
  function progressTime(timer, duration) {
    return (timer / duration) * 100;
  }
  
  // Create and start the Timer
  function startTimer(duration, breakTime, clock) {
    var timer = duration-1, min, sec, percentage;
    setTimer = setInterval(function() {
      if (!pause) {
        min = parseInt(timer / 60, 10);
        sec = parseInt(timer % 60, 10);
      
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
      
        clock.innerHTML = min + ":" + sec;
      
       if (state === "work") {
        percentage = progressTime(parseFloat(duration-timer+"."+sec), duration);
       } else {
         percentage = progressTime(parseFloat(breakTime-timer+"."+sec), breakTime);
       }
      
        progress.css("width", percentage+"%");
      
       if (--timer < 0) {
          percentage = 0;
          alarm.play();
          if (state === "work") {
            $("#status").text("break");
            state = "break";
            timer = breakTime;
          } else if (state === "break") {
            $("#status").text("working");
            state = "work";
            timer = duration;
          }
        }
      }
    }, 1000);
  }
  
  // Pomodoro slider
  $("#slider-pomodoro").slider({
    value: 25,
    step: 1,
    min: 1,
    max: 60,
    slide: function(event, ui) {
      $("#pomodoro").text(ui.value);
    }
  });
  
  // Break slider
  $("#slider-break").slider({
    value: 5,
    step: 1,
    min: 1,
    max: 60,
    slide: function(event, ui) {
      $("#break").text(ui.value);
    }
  });
  
  // Start and Stop
  $("#switchOn").click(function() {
    var clock = document.getElementById("timer");
    var minutes = $("#pomodoro").text();
    var breakTime = $("#break").text();
    clock.innerHTML = minutes + ":00";
    // *** START Button ***
    if ($("#switchOn > span").text() === "start") {
      // It's working time!
      $("#status").text("working");
      $("#status").css("color", "#FF0");
      // Set button states
      $("#switchOn > span").text("stop");
      $("#switchOn > i").attr("class", "fa fa-stop");
      $("#switchPause").removeAttr("disabled");
      // Start the Pomodoro Timer
      startTimer(60 * minutes, 60 * breakTime, clock);
      // ** STOP Button ***
    } else if ($("#switchOn > span").text() === "stop")  {
      $("#status").text("--");
      $("#status").css("color", "#FFF");
      // Remove the actual timer
      clearInterval(setTimer);
      // Reset variables
      progress.css("width", 0);
      pause = false;
      state = "work";
      // Set button states
      $("#switchOn > span").text("start");
      $("#switchOn > i").attr("class", "fa fa-play");
      $("#switchPause").attr("disabled", "disabled");
      $("#switchPause > span").text("pause");
      $("#switchPause > i").attr("class", "fa fa-pause");
    }
  });
  
  // Pause and Resume
  $("#switchPause").click(function() {
    // Switch between pause and resume
    pause = pause === true ? false : true;
    // Set button states
    if ($("#switchPause > span").text() === "pause") {
      $("#switchPause > span").text("resume");
      $("#switchPause > i").attr("class", "fa fa-play");
    } else if ($("#switchPause > span").text() === "resume") {
      $("#switchPause > span").text("pause");
      $("#switchPause > i").attr("class", "fa fa-pause");
    }
  });
});
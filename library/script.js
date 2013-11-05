//http://www.sefol.com/?p=1090

var client = new Dropbox.Client({key: 'j37v18c5tdi8xu4'});
client.authenticate();
  if (client.isAuthenticated()) {
    // Client is authenticated. Display UI.
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }
      var taskTable = datastore.getTable('tasks');
      //each record specified by horizon.
      var results = taskTable.query();
      var list = taskTable.query({horizon: 'listed'});
      var action = taskTable.query({horizon: 'action'});
      var project = taskTable.query({horizon: 'project'});
      var focus = taskTable.query({horizon: 'focus'});
      var goal = taskTable.query({horizon: 'goal'});
      var vision = taskTable.query({horizon: 'vision'});
      var wait = taskTable.query({horizon: 'wait'});
      var calendar = taskTable.query({horizon: 'calendar'});


    var queries = [
      {horizon: 'action'},
      {horizon: 'project'},
      {horizon: 'focus'},
      {horizon: 'goal'},
      {horizon: 'vision'},
      {horizon: 'wait'},
      {horizon: 'calendar'},
      {completed: false}
    ];

  //append all db items to projects div from the start.
    for (var k=0; k<list.length;k++ ) {
      $("#list").append( "<li>"+list[k].get("taskname") + "</li>");
    };

    //append all db items to projects div from the start.
    for (var k=0; k<action.length;k++ ) {
      $("#actionVerb").append( "<li>"+action[k].get("taskname") + "</li>");
    };
    //append all db items to projects div from the start.
    for (var k=0; k<project.length;k++ ) {
      $("#projects").append( "<li>"+project[k].get("taskname") + "</li>");
    };
    //append all db items to projects div from the start.
    for (var k=0; k<focus.length;k++ ) {
      $("#aof").append( "<li>"+focus[k].get("taskname") + "</li>");
    };
    //append all db items to projects div from the start.
    for (var k=0; k<goal.length;k++ ) {
      $("#goals").append( "<li>"+goal[k].get("taskname") + "</li>");
    };
    //append all db items to projects div from the start.
    for (var k=0; k<vision.length;k++ ) {
      $("#vision").append( "<li>"+vision[k].get("taskname") + "</li>");
    };
    //append all db items to projects div from the start.
    for (var k=0; k<wait.length;k++ ) {
      $("#waiting").append( "<li>"+wait[k].get("taskname") + "</li>");
    };
    //append all db items to projects div from the start.
    for (var k=0; k<calendar.length;k++ ) {
      $("#calendar").append( "<li>"+calendar[k].get("taskname") + "</li>");
    };

     //Update… visual
    $('#doing').click(function(){
      var aa = $('#list li').length;
      var bb = $('#actionVerb li').length;
      var cc = $('#projects li').length;
      var dd = $('#aof li').length;
      var ee = $('#goals li').length;

      var path = svg.selectAll("path")
        .data(pie([ aa, bb, cc, dd, ee ]))
        .enter().append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc);

      // path = svg.selectAll("path")
      // .data(pie(dataset.apples))
      // .enter().append("path")
      // .attr("fill", function(d, i) { return color(i); })
      // .attr("d", arc);
    })

  // var aa = $('#list li').length;
  // var bb = $('#actionVerb li').length;
  // var cc = $('#projects li').length;
  // var dd = $('#aof li').length;
  // var ee = $('#goals li').length;

  var aa = $('#list li').length;
  var bb = $('#actionVerb li').length;
  var cc = $('#projects li').length;
  var dd = $('#aof li').length;
  var ee = $('#goals li').length;


  var dataset = {
    apples: [ aa, bb, cc, dd, ee ],
  };

  //Doughnut Specs
  var width = 350,
      height = 280,
      radius = Math.min(width, height) / 2;
  var color = d3.scale.category20();
  var pie = d3.layout.pie()
      .sort(null);
  var arc = d3.svg.arc()
      .innerRadius(radius - 240)
      .outerRadius(radius - 250);
  var svg = d3.select("#doughnut").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var path = svg.selectAll("path")
      .data(pie(dataset.apples))
    .enter().append("path")
      .attr("fill", function(d, i) { return color(i); })
      .attr("d", arc);
//=========================================================================

    //delete all completed items on button click.
    $('#eraser').click(function() {
      var erasethem = taskTable.query();
      for (var i = 0; i < erasethem.length; i++) {
        erasethem[i].deleteRecord();
        console.log('deleted', erasethem[i]);
        console.log('worked');
      }
      $('li').remove();
    });

    //filter actions into div filter when clicked on any button
    $('#filtration').click(function() {
      $('#actionVerb li').sort(function(a, b) {
          var at = $(a).text(), bt = $(b).text();
          return (at > bt)?1:((at < bt)?-1:0);
      }).appendTo($('#filtered'));
    });

    document.getElementById('search').focus();
    //inputID, keycode, divID
    var combined = [
      ['search', undefined, '#list',       'listed'],
      ['search2',       65, '#actionVerb', 'action'],
      ['projectsInput', 80, '#projects',   'project'],
      ['aofInput',      70, '#aof',        'focus'],
      ['',              67, '#calendar',   'calendar'],
      ['goalsInput',    71, '#goals',      'goal'],
      ['visionInput',   86, '#vision',     'vision'],
      ['waitingInput',  87, '#waiting',    'wait']
    ];
    //input, div coresponding
    var combinedAppend = [
      ['actionAttached', '#actionVerb', 'action'],
      ['aofAttached',    '#projects',   'project'],
      ['goalsAttached',  '#aof',        'focus'],
      ['visionAttached', '#goals',      'goal']
    ];

    //print each action li into output
    $('button').click(function() {
      var contents = '';
      $("#actionVerb li").each(function() {
        contents = contents + $(this).text() + '\n';
      });
      $('#output').val( contents );
    });

    //import textarea
    $('#import').click(function() {
      var items = $('#newItems').val().split('\n');
      if(items == false){return false}
      $('#newItems').val('');
      _.each(items, function(item){
        //add to dp from importer
        $('#list').prepend('<li>' + item + '</li>');
        var firstTask = taskTable.insert({
          taskname: item,
          completed: false,
          horizon: 'listed',
          created: new Date()
        })
      });
    });

    //add new items into inbox
    $("#search").keyup(function (e) {
      var value = $(this).val();
      if(value == false){return false};
      if(e.keyCode == 13) {
        $(this).val('');
        $('#list').append('<li>' + value + '</li>');
        //add new record into dp
        var firstTask = taskTable.insert({
          taskname: value,
          completed: false,
          horizon: 'listed',
          created: new Date()
        })
        return false;
      }
    }).keyup();

    //insert each item respectively from any activeElement.
    $('body').bind('keydown', function(e) {
      var $currentInput = $(document.activeElement).attr('id');
      for(var i = 0; i < combined.length; i++) {
        if( $currentInput == combined[i][0]){

          for(var j = 0; j < combined.length; j++){
            if(e.shiftKey && e.keyCode == combined[j][1]){

              var passed = $(combined[i][2]).children().first();
              var data = $(combined[i][2]).children().first().text();

              $(combined[j][2]).append(passed);
              //dp access to update horizon
              var results = taskTable.query({taskname: data});
              results[0].set('horizon', combined[j][3]);

              return false;
            }
          }
        }
      }
    });

    //verb highlighter
    function doWork() {
      repeater = setTimeout(doWork, 100);
      $("#actionVerb li").each(function( index, elem ) {
        var string = $(this).html();
        for(var i = 0; i < verb.length; i++){
          if(string.indexOf(verb[i]) != -1){
            if($("li > span").length < 1){
              $(this).html(string.replace(verb[i], '<span>'+ verb[i] +'</span>'));
            }
          }
        }
      });
    }
    doWork();

    //shift + T : output actions in form as a list
    $("body").bind('keydown', function(e) {
      if (e.shiftKey && e.keyCode == 84) {
        $( "#reveal" ).show( "slow" );
        var formFill = '';

        $('#actionVerb li').sort(function(a, b) {
          var at = $(a).text();
          var bt = $(b).text();
          return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
        }).appendTo($('#filtered'));
  //remove this extra step.
        $('#filtered li').each(function(index, elem) {
          var content = $(this).text();
          formFill = formFill + content + '\n';
        });
      $('#output').val(formFill);
      return false;
      }
    });

//shift + R = moves into work mode panel...
    $("body").bind('keydown', function(e) {
      if (e.shiftKey && e.keyCode == 82) {
        $( "#filtered" ).toggle('show')
//trying to activate the panel to open on screen.

      }
    })

    //delete within each list[√]
    $("body").bind('keydown', function(e) {
      if (e.shiftKey && e.keyCode == 68) {
        var doc = document.activeElement;
        for (var i = 0; i < combined.length; i++) {
          if($(doc).attr('id') == combined[i][0]){

            //removing from dp in any div
            var data = $(combined[i][2]).children().first().text();
            console.log(data);
            var results = taskTable.query({taskname: data});
            console.log(results);
            results[0].deleteRecord();

            $(combined[i][2]).children().first().remove();
          }
        }
        return false;
      }
    });

    //click observed
    $('body').bind('keydown', function(e) {
      var activeInput = document.activeElement;
      var lengthen = 0;

      //if it is an active input
      for (var i = 1; i < combined.length; i++) {
        if($(activeInput).attr('id') == combined[i][0]){
          lengthen = $(combined[i][2] + ' ' + 'li').length;
          var value = $('#' + combined[i][0]).val();

          //hit return to
          if (e.keyCode == 13) {
            $('<li>' + value + '</li>').appendTo(combined[i][2]).hide().fadeIn(8500);
            var firstEl = $(combined[i][2]).children().first().text();
            $(combined[i][2]).children().first().remove();
            $('#' + combined[i][0]).val('');
            $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');

            //updating each li to dp in all div[√]
            var results = taskTable.query({taskname: firstEl});
            results[0].set('taskname', value);
            results[0].set('horizon', combined[i][3]);
            var valueString = value + "";
            // return false;
          }
          else if (e.shiftKey && e.keyCode == 78) { //next => n
            $('#' + combined[i][0]).val('');
            var contained = $(combined[i][2]).children().first().get();
            $(contained).appendTo(combined[i][2]).hide().fadeIn(8500);
            $(combined[i][2] + ' ' + 'li:eq(' + (lengthen-1) + ')').css('color', 'black');
            e.preventDefault();
          }
        }
      }
      //additional attached inputs
      for (var j = 0; j < combinedAppend.length; j++) {
        if($(activeInput).attr('id') == combinedAppend[j][0]){
          var connected = '#'+ combinedAppend[j][0];
          var connector = combinedAppend[j][1];
          var connectee = combinedAppend[j+1][1];
          var value2 = $(connected).val();

          if (e.keyCode == 13) { //newone => enter
            if(value2 == false){return false}
            $(connector).prepend('<li>' + value2 + '</li>');
            $(connected).val('');

            //add new record into dp
            var firstTask = taskTable.insert({
              taskname: value2,
              completed: false,
              horizon: combinedAppend[j][2],
              created: new Date()
            })

            return false;
          }
          else if (e.shiftKey && e.keyCode == 68) { //delete => d
            //removing from dp in other div
            var inputfirst = $(connectee).children().first().text();
            var inputresults = taskTable.query({taskname: inputfirst});
            inputresults[0].deleteRecord();

            $(connectee).children().first().remove();
            $(connectee).val('');
            return false;
          }
          else if (e.shiftKey && e.keyCode == 78) { //next => n
            $(connectee).val('');
            var contained = $(connectee).children().first().get();
            $(connectee).append(contained);
            e.preventDefault();
            return false;
          }
        }
      }
    });
  });
};
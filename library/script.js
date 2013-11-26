//http://www.sefol.com/?p=1090

var client = new Dropbox.Client({key: 'XXXXXXXXXXXXX'});
client.authenticate();
  // Client is authenticated. Display UI.
  if (client.isAuthenticated()) {
    var datastoreManager = client.getDatastoreManager();
    datastoreManager.openDefaultDatastore(function (error, datastore) {
      if (error) {
        alert('Error opening default datastore: ' + error);
      }
      var taskTable = datastore.getTable('tasks');
      //each record by horizon
      var results = taskTable.query({completed:false});
      var list = taskTable.query({horizon: 'listed', completed:false});
      var action = taskTable.query({horizon: 'action', completed:false});
      var project = taskTable.query({horizon: 'project', completed:false});
      var focus = taskTable.query({horizon: 'focus', completed:false});
      var goal = taskTable.query({horizon: 'goal', completed:false});
      var vision = taskTable.query({horizon: 'vision', completed:false});
      var wait = taskTable.query({horizon: 'wait', completed:false});
      var someday = taskTable.query({horizon: 'someday', completed:false});
      //each projectTable
      var projectTable = datastore.getTable('projects');
      var projectResults = projectTable.query();
      var projectheadlines = projectTable.query({headline:true, completed:false});
      var projectactions = projectTable.query({headline:false, completed:false});

      //score of project actions completed
      var indprojscore = projectTable.query({headline:false, completed:true});
      var nextactions = projectTable.query({headline:false, nextaction:true, completed:false});
      var waitingfor = projectTable.query({headline:false, waiting:true, completed:false});


// //delete entire datastore:
//       for ( var k=0; k<projectResults.length;k++ ) {
//         projectResults[k].deleteRecord()
//       };





      for (var k=0; k<nextactions.length;k++ ) {
        $("#nextactions").append( "<p>"+nextactions[k].get("actionname") + "</p>");
      };
      for (var k=0; k<waitingfor.length;k++ ) {
        $("#waitingfor").append( "<p>"+waitingfor[k].get("actionname") + "</p>");
      };

      //generate headlines and divs of each project at start:
      for (var k=0; k<projectheadlines.length;k++ ) {
        $("#row").append(
          '<div class="column2">'
        + '<div class="listed">'
        + '</div>'
        + '<input class="next" type="text" value="" autofocus>'
        + '<div class="listed2"></div>'
        + "<h3>" + projectheadlines[k].get("projectname") + "</h3>"
        // + '<textarea rows="4" cols="5" class="txt"></textarea>'//make persistant[and folding]
      + '</div>');
      };

      //iterate over actions to place into each respective div
      for (var k=0; k<projectactions.length; k++ ) {
        var proname1 = projectactions[k].get('projectname')
        var actionname2 = projectactions[k].get('actionname')
        //for every h3 that matches the projectname, append the action.
        $('h3').each(function(){
          var $this = $(this);
          if( $this.text() === proname1){
            $this.prev().prev().prev().append('<p>'+actionname2+'</p>')
          }
        });
      };

      

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
      for (var k=0; k<someday.length;k++ ) {
        $("#someday").append( "<li>"+someday[k].get("taskname") + "</li>");
      };

      //d3 visualizatin data:
      var update = function(){
        var a = $('#list li').length;
        var b = $('#actionVerb li').length;
        var c = $('#projects li').length;
        var d = $('#aof li').length;
        var e = $('#goals li').length;
        var f = $('#vision li').length;
        var data1= [
            {"crimeType":"mip","totalCrimes":a},
            {"crimeType":"theft","totalCrimes":b},
            {"crimeType":"drugs","totalCrimes":c},
            {"crimeType":"larson","totalCrimes":d},
            {"crimeType":"homicide","totalCrimes":e},
            {"crimeType":"suicide","totalCrimes":f}
          ];
        return data1;
      };

      //real time events update d3 visualization
      $("body").bind('keydown', function(e) {
        if (e.keyCode) {
          change(update());
        }
      });

      //Doughnut Specs
      var width = 200,
          height = 200,
          radius = Math.min(width, height) / 2;
      var color = d3.scale.ordinal()
          .range(['#FFCC00', '#FF6633', '#CC0066', '#31a354', '#17becf', '#660099']);
          // .range(['#e7ba52', '#fdae6b', '#d6616b', '#74c476', '#6baed6', '#1f77b4']);
      var arc = d3.svg.arc()
          .innerRadius(radius - 192)
          .outerRadius(radius - 200);
      var pie = d3.layout.pie()
          .sort(null)
          .value(function (d) {
            return d.totalCrimes;
          });

      var svg = d3.select("#doughnut").append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("id", "pieChart")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var path = svg.selectAll("path")
          .data(pie(update()))
          .enter()
          .append("path");

      path.transition()
          .duration(500)
          .attr("fill", function(d, i) { return color(i); })
          .attr("d", arc)
          .each(function(d) { this._current = d; }); // store the initial angles

      function change(data){
        path.data(pie(data));
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
      }
      // Store the displayed angles in _current.
      // Then, interpolate from _current to the new angles.
      // During the transition, _current is updated in-place by d3.interpolate.
      function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
          return arc(i(t));
      };
    }

    document.getElementById('search').focus();
    //inputID, keycode, divID
    var combined = [
      ['search', undefined, '#list',       'listed'],
      ['search2',       65, '#actionVerb', 'action'],
      ['projectsInput', 80, '#projects',   'project'],
      ['aofInput',      70, '#aof',        'focus'],
      ['someday',       83, '#someday',   'someday'],
      ['goalsInput',    71, '#goals',      'goal'],
      ['visionInput',   86, '#vision',     'vision'],
      ['waitingInput',  87, '#waiting',    'wait']
    ];
    //input, div coresponding
    var combinedAppend = [
      ['actionAttached', '#actionVerb', 'action'],
      ['aofAttached',    '#projects',   'project'],
      ['goalsAttached',  '#aof',        'focus'],
      ['visionAttached', '#goals',      'goal'],
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
      if(items == false){return false};
      $('#newItems').val('');
      _.each(items, function(item){
        //add to dp from importer
        $('#list').prepend('<li>' + item + '</li>');
        var firstTask = taskTable.insert({
          taskname: item,
          completed: false,
          horizon: 'listed',
          created: new Date()
        });
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
        });
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
              var results = taskTable.query({taskname: data, completed:false});
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

    //delete within each list[√]
    $("body").bind('keydown', function(e) {
      if (e.shiftKey && e.keyCode == 68) {
        var doc = document.activeElement;
        for (var i = 0; i < combined.length; i++) {
          if($(doc).attr('id') == combined[i][0]){
            //removing from dp in any div
            var data = $(combined[i][2]).children().first().text();
            var results = taskTable.query({taskname: data});
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

          //newone => enter
          if (e.keyCode == 13) {
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
          //delete => d
          else if (e.shiftKey && e.keyCode == 68) {
            //removing from dp in other div
            var inputfirst = $(connectee).children().first().text();
            var inputresults = taskTable.query({taskname: inputfirst});
            inputresults[0].deleteRecord();

            $(connectee).children().first().remove();
            $(connectee).val('');
            return false;
          }
          //next => n
          else if (e.shiftKey && e.keyCode == 78) {
            $(connectee).val('');
            var contained = $(connectee).children().first().get();
            $(connectee).append(contained)
            e.preventDefault();
            return false;
          }
        }
      }
    });

    $("body").bind('keydown', function(e) {
      if($(document.activeElement).prev('.listed').length) {
        //enter = create a new <p> action
        if(e.keyCode == 13){
          var value = $(document.activeElement).val();
          $(document.activeElement).prev().append('<p>'+value+'</p>');

          //get h3 text to label record with + action name.
          var projh3 = $(document.activeElement).next().next().text();

          //persistant actions:
          var firstProject = projectTable.insert({
            headline: false,
            projectname: projh3,
            actionname: value,
            nextaction: false,
            context: '@computer',
            completed: false,
            waiting: false,
            created: new Date()
          });
          $(document.activeElement).val('');
        }
        //shift Q = complete project pod
        if (e.shiftKey && e.keyCode == 81)  {
          //complete or delete action
          var deleteIt = $(document.activeElement).next().next('h3').text();
          var projResults = projectTable.query({projectname: deleteIt, headline: true});
          projResults[0].set('completed', true);
          e.preventDefault();
          $(document.activeElement).val('');
          $(document.activeElement).parent().remove()
        }
        //shift D = complete || delete it
        if (e.shiftKey && e.keyCode == 68)  {
          $(document.activeElement).prev().children('p').last().css( "color", "#7CCD7C" );
          //complete or delete action
          var deleteIt = $(document.activeElement).prev().children('p').last().text();
          var projResults = projectTable.query({actionname: deleteIt});
          projResults[0].set('completed', true);
          // projResults[0].deleteRecord();
          e.preventDefault();
          $(document.activeElement).val('');
        }
        //shift W = waiting on
        if (e.shiftKey && e.keyCode == 87)  {
          $(document.activeElement).prev().children('p').last().css( "color", "#ff6666" );
          //update to true ->
          var waitonit = $(document.activeElement).prev().children('p').last().text();
          var projResults = projectTable.query({actionname: waitonit});
          projResults[0].set('waiting', true);
          e.preventDefault();
          $(document.activeElement).val('');
        }
        //shift C = continue
        if (e.shiftKey && e.keyCode == 67)  {
          $(document.activeElement).prev().children('p').last().css( "color", "#00aaff" );
          //change back to false
          var waitnomore = $(document.activeElement).prev().children('p').last().text();
          var projResults = projectTable.query({actionname: waitnomore});
          projResults[0].set('waiting', false);
          e.preventDefault();
          $(document.activeElement).val('');
        }
        //previous => shift p
        if (e.shiftKey && e.keyCode == 80) {
          $(document.activeElement).val('');
          var contained = $(document.activeElement).prev().children('p').last().get();
          $(contained).prependTo($(document.activeElement).next())
          e.preventDefault();
          $(document.activeElement).val('');
        }
        //next => shift n
        if (e.shiftKey && e.keyCode == 78) {
          $(document.activeElement).val('');
          var contained2 = $(document.activeElement).next().children('p').first().get();
          $(contained2).appendTo($(document.activeElement).prev())
          e.preventDefault();
          $(document.activeElement).val('');
        }
        //next action => shift a
        if (e.shiftKey && e.keyCode == 65) {
          var contained2 = $(document.activeElement).prev().children('p').last().text()
          $(document.activeElement).prev().children('p').last().css('color', 'green')
          var projResults = projectTable.query({actionname: contained2});
          projResults[0].set('nextaction', true);
          e.preventDefault();
          $(document.activeElement).val('');
        }
      }
    })

    //shift + T
    $("#projectsInput").bind('keydown', function(e) {

      if (e.shiftKey && e.keyCode == 84) {
      var projectItem = $('#projects li').first().text();

        //create a new div for that project *duplicate*
        $('#row').append(
          '<div class="column2">'
          + '<div class="listed">'
          + '</div>'
          + '<input class="next" type="text" value="" autofocus>'
          + '<div class="listed2"></div>'
          + '<h3>' + projectItem + '</h3>'
        + '</div>'
        );
        //create persistence:
        var firstProject = projectTable.insert({
            headline: true,
            projectname: projectItem,
            actionname: 'no action',
            nextaction: false,
            context: '@computer',
            completed: false,
            waiting: false,
            created: new Date()
        });
        var formFill = '';
        $(document.activeElement).val(formFill);
      }
    });

//move action across the pods.
    $("#search2").bind('keydown', function(e) {
          if (e.shiftKey && e.keyCode == 84) {
          var actionItem = $('#actionVerb li').first().text();
          $('#actionVerb li').first().css('background-color', 'gray');

//take length of # of divs of column2.
//iterate over them one by one increment.
//remove the append each time from the one previous.
//update the persistence each time.
//when it hits the end, start the increment over.
  //have the next actions be updating every time the key is pressed(waiting too)

            $('.listed2').append('<p>' + actionItem + '</p>');
            var projectName = $('.listed2').next().text();
            //create persistence:
            var firstProject = projectTable.insert({
                headline: false,
                projectname: projectName,
                actionname: actionItem,
                nextaction: false,
                context: '@computer',
                completed: false,
                waiting: false,
                created: new Date()
            });
            var formFill = '';
            $(document.activeElement).val(formFill);
          }
        });
    //Beginning of the summary dashboard of @contexts...3 divs
    //@home, @work, @phone, @computer, etc
    //Another summary of next actions  and waiting fors.... 2 divs
    //   //   $('#actionVerb li').sort(function(a, b) {
    //   //     var at = $(a).text();
    //   //     var bt = $(b).text();
    //   //     return (at > bt) ? 1 : ((at < bt) ? -1 : 0);
    //   //   }).appendTo($(document.activeElement).parent('div').parent('div'));
    //   // return false;
    // };
  });
}

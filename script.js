
    function draw(error, data) {
    if (error) throw error;
      
    var margin = 5,
        width = 500	 - margin,
        height = 400 - margin;


    var projection = d3.geo.mercator()
                          .center([-55, 5])
                          .scale(750)
                          .translate([width / 2, height / 30])
						  ;
						  
						  
    var path = d3.geo.path().projection(projection);
					 

    // create and append the map
    var map = d3.select('#map').selectAll('path')
                 .data(data[0].features)
                 .enter()
                 .append('svg:path')
                 .attr('d', path)
                 .style('fill', '#e5e5e5')
                 .style('stroke', 'white')
                 .style('stroke-width', 1)
				 .on("mouseover", function(d,i) { d3.select(this).transition().duration(1500).style('fill', '#b7b7b7').style("stroke-width", 5).style("stroke-opacity", .4).style('stroke', '#5b5b5b');
	})
				 .on("mouseleave", function(d,i) { d3.select(this).transition().duration(1500).style('fill', '#e5e5e5');
	})
	
	
;

 				 
    var text = d3.select('#map').selectAll('text')
	             .data(data[0].features)
	             .enter()
	             .append("text")
				 .attr("x",function (d) {return path.centroid(d)[0];})
 				 .attr("y",function (d) {return path.centroid(d)[1];})
				 .attr("text-anchor","middle")
				 .style("font-size", "10px")
				 .style("font-family", "helvetica, arial, sans-serif")
				 .style("fill", "#004669")
				 .style("font-weight", "bold")
				 .text(function(d){return d.properties.sigla;})
				 
				 ;
				 

     map.datum(function(d) {
                 var normalized = d.iata;
                 d.iata = normalized;
                 return d;
    });
	

    // add the iata name as its class
    map.attr('class', function(d) {
                 return d.iata;					
                 });

      // find the min/max of listing per iata
    var listings_extent = d3.extent(d3.values(data[1]));

      // append a bubble to each iata
    var bubbles = d3.select('#map').append("g")
              .attr("class", "bubble")
              .selectAll("circle")
              .data(data[4])
              .enter()
              .append("circle")
              .attr('class', 'airbnb')	
              .on("mouseover", function(d, i) { d3.select("h2 span").text(d.name + ", " +d.iata + ", " +d.state); d3.select("h3 span").text(d.iata)})	
			  
			  ;

      // add the listing data to each iata datum
     bubbles.datum(function(d) {
               d.count2 = data[1][d.iata];
               return d;
               });
	  
    bubbles.attr('class', function(d) {
               return d.iata;
		       });	  

      // scale each bubble with a sqrt scale
    var radius = d3.scale.pow().exponent(0.5)
               .domain(listings_extent)
               .range([3, 5]);

      // transform each bubbles' attributes according to the data 
    bubbles
               .attr("cx", function (d) { return projection([d["longitude"],d["latitude"]])[0];})
               .attr("cy", function(d)  {  return projection([d["longitude"],d["latitude"]])[1];})
               .attr("r", function(d) { return radius(d.count2); });


	   
var formatPercent = d3.format(".0%");			   
//.tickFormat(formatPercent)
			   
			   
			   
			   

			   
    // initialize the Mission as the default iata
    var field = "FLIGHTS";

    // maximum reviews
    var max_y = d3.max(data[2], function(d) {
               var max = 0;
               d3.values(d).forEach(function(i) {
               if (+i && (+i > max)) {
               max = +i;
               }
               });
               return max;
               });

    // Create y-axis scale mapping price -> pixels
    var measure_scale = d3.scaleLinear()
              .range([height, 60])
              .domain([0, max_y])
;


	var scaleY = d3.axisLeft(measure_scale)
//	.ticks(10, "%")
	.tickFormat(formatPercent)
//	 .tickSizeInner(-width)



	;
			



			  

			  
			  
			  

 
    // create a function to draw the timeseries for each iata
    var drawChart = function(field) {
    // remove the previous chart

              d3.select('#chart').select('.x.axis').remove();			  
              d3.select('#chart').select('path').remove();
      //        d3.select('#chart').selectAll("g").remove();
			                d3.select('#chart').selectAll("*").remove();

		  
	



	
    // update the title
              d3.select('#heading')
             .text(field.replace(/_/g, ' '))
	   		 ;

			 
			 
			 
    // remove missing values
    var neigh_data = data[2].filter(function(d) {
              return d[field] ;
              });
	  
    var neigh_data2 = data[2].sort(function(d,i) {
              return d[field] - i[field];
              });	  
	  

	  
	  
	  



	
	
		//This is EXACTLY the same as above, except for:
		d3.select("g")  //DEscending
			.on("click", function(d,i) { return neigh_data2; })
						;

	  
	  
	  
	  
	  
    var time_extent = neigh_data.map( function( d ){ return d['timestamp'] });		  

    // Create x-axis scale mapping dates -> pixels
    var time_scale = d3.scaleBand()
		     .rangeRound([0, width-margin],1)
			 .padding(0.1)
             .domain(time_extent)
   		     ;
    // Create D3 axis object from time_scale for the x-axis
    var time_axis = d3.axisBottom(time_scale)
		      ;

			  
    // Append SVG to page corresponding to the D3 y-axis
    d3.select('#chart').append('svg')
              .attr('class', 'y axis')
              .attr("transform", "translate(" + width + " , 0)")
              .call(scaleY)
             .selectAll("text")
             .attr("y", 0)
             .attr("x", 12)
             .attr("dy", ".35em")
             .attr("transform", "rotate(0)")
             .style("text-anchor", "start")

			  ;
			  
	// add label to y-axis
      d3.select(".y.axis")	
              .append("text")
              .attr('class', 'label')
              .text("Relation for kg between airports")
              .attr("transform", "translate(5,215) rotate(90)");	

			  
			  
			  
			  
    // Append SVG to page corresponding to the D3 x-axis
    d3.select('#chart').append('g')
             .attr('class', 'x axis')
             .attr('transform', "translate(" + margin + ',' + (height +7) + ")")
             .call(time_axis)
             .selectAll("text")
             .attr("y", -4)
             .attr("x", 14)
             .attr("dy", ".2em")
				 .style("font-size", "11px")
				 .style("font-family", "helvetica, arial, sans-serif")
				 .style("fill", "#6666ff")			 
             .attr("transform", "rotate(90)")
             .style("text-anchor", "start")
		     ;
			

			


	   d3.select('#chart').selectAll(".bar").append("g")
      .data(neigh_data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d,i) { return   time_scale(d['timestamp'])+13; })
      .attr("y", function(d,i) { return measure_scale(+d[field]); })
      .attr("width", time_scale.bandwidth())	
      .attr("height", function (d,i) {  return height -  measure_scale(+d[field]); }) 

		   ;	 
  
	     d3.select('#chart').append("g")
             .attr("class", "x axis")
             .selectAll("text")
             .data(neigh_data)
             .enter()
             .append("text")
	         .attr("class", "label")
             .attr("y", function (d) { return width - time_scale(d['timestamp'])-590; })
             .attr("x", function (d) { return measure_scale(+d[field])+72; })
             .attr("text-anchor", "start")
			 .attr("dy", "2em")
             .attr("transform", "translate(-60 -70)rotate(90)")
				 .style("font-size", "10px")
				 .style("font-family", "helvetica, arial, sans-serif")
				 .style("fill", "white")
				 .style("font-weight", "bold")	
//                 .style('stroke', 'red')
 //                .style('stroke-width', .9)				 
             .text(function(d) {
             return formatPercent(d[field]);
             });

		   

	   };

    drawChart(field);
		
		
		
		
		
		

        // create a callback for the iata hover
    var mover = function(d) {
             var neigh = d.iata;
             d3.select('#map path.' + neigh).style('fill', '#9999ff')
             ;
             drawChart(neigh);
             };

        // create a callback for the iata hover
    var mout = function(d,i) {
             var neigh = d.iata;
             d3.select('path.' + neigh).style('fill', '#7f7f7f')
		 	 ;
             }

        // attach events to iatas in map
        map.on("click", mover);
        map.on("mouseout", mout);

        // attach events to bubbles on map
        bubbles.on('click', mover);
        bubbles.on('mouseout', mout);
		
    }
 

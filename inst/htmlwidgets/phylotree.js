// These vars are accessibel in the browser
// everything in the HTMLWidget is scoped
var fulltree, gparams;


HTMLWidgets.widget({

  name: 'phylotree',

  type: 'output',

  initialize: function(el, width, height) {
    return { };
  },

  renderValue: function(el, params, instance) {
    instance.params = params;
    this.drawGraphic(el, params, el.offsetWidth, el.offsetHeight);
  },


  drawGraphic: function(el, params, width, height) {

    gparams   = params;

    // setup vars
    var myTree;
    var dummy = 0;


    // support fns
    const zoomClade = function(d){
    	phyloTree.zoomIntoClade(myTree, d, 800);
    }

    const tipText = function(d){
        if (d.n.strain && d.terminal){
            return d.n.strain;
        }else{
            return "";
      }
    }

    const tipFontSize = function(d){return params.tipFontSize;};

    const addDataToTooltip = function(node, excludes=["parent", 'clade', 'attr', 'shell']) {

        //get tooltip div
        var tooltipdiv = d3.select("#" + el.id + "-tooltip")
        tooltipdiv.transition()
              .duration(200)
              .style("opacity", .9);
        tooltipdiv.html( node.n.strain )
              .style("left", (d3.event.pageX) + "px")
              .style("top",  (d3.event.pageY - 28) + "px");
    };

    const removeDataFromTooltip = function(node, excludes=["parent", 'clade', 'attr', 'shell']) {
        //get tooltip div
        var tooltipdiv = d3.select("#" + el.id + "-tooltip")
        tooltipdiv.transition()
              .duration(500)
              .style("opacity", 0);
    };

    // dynamic radius calculation for specific types
    var makeRadiusFn = function(domain_max, domain_min, range_min, range_max) {
      return d3.scale.sqrt().domain([domain_min, domain_max]).range([range_min, range_max])
    };

    // setup dom
    d3.select("#" + el.id + "-colorby")
      .selectAll("option")
      .data(d3.keys(params.colors))
      .enter()
      .append("option")
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

    d3.select("#" + el.id + "-sizeby")
      .selectAll("option")
      .data(d3.keys(params.sizes))
      .enter()
      .append("option")
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });


    // main fn
    var treeplot = d3.select("#" + el.id + "-treeplot");
  	myTree = phyloTree.phyloTree(
  		params.treejson,
  		{svg:treeplot,
  		 layout: params.layout,
       distance: params.distance,
       orientation: {x:params.orientation_x, y:params.orientation_y},
       zoom: {x:params.zoomLevel_x, y:params.zoomLevel_y},
       pan: {x:params.pan_x, y:params.pan_y},
       tipRadius: params.tipRadius,
       tipStroke:params.tipStroke,
       tipFill:params.tipFill,
       tipStrokeWidth: params.tipStrokeWidth,
       branchStroke: params.branchStroke,
       branchStrokeWidth: params.branchStrokeWidth,
       autoTipSize: params.autoTipSize,
  		 margins:{top:10, bottom:10, left:10, right:10},
  	 	callbacks:{onBranchClick:zoomClade,
  					onBranchHover:function(d){console.log(d.n.strain);},
  					onBranchLeave:function(d){console.log(d.n.strain);},
  					//onTipHover:function(d){console.log(d.n.strain);},
  					//onTipLeave:function(d){console.log(d.n.strain);},
  					onTipHover:function(d){addDataToTooltip(d);},
  					onTipLeave:function(d){removeDataFromTooltip(d);},
  					onTipClick:function(d){addDataToModal(d);},
  					}
  	});


  	phyloTree.drawTree(myTree);
  	fulltree = myTree;


    // All the D3 select functions here
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////

  	 d3.select("#" + el.id + "-layout").on("change", function(){
      var layout = document.getElementById(el.id + "-layout").value;
      phyloTree.changeLayout(myTree, 1000, layout);
  	 });


  	d3.select("#" + el.id + "-distance").on("change", function(){
      var distance = document.getElementById( el.id + "-distance").value;
      phyloTree.changeDistance(myTree, 1000, distance);
      console.log(myTree);
      });

    d3.select("#" + el.id + "-colorby").on("click", function(){
      var colval = document.getElementById(el.id + "-colorby").value;
      //console.log(colval);
      myTree.nodes.forEach(function(d,i){
          if (d.terminal){

              // get the tipAttribute value for the tip then
              // lookup and set
              //console.log(d3.keys(d.tipAttributes))
              tipcolvar = d.n[colval] //tip data held under the 'n' field
              console.log(tipcolvar)
              tipcol    = params.colors[colval][tipcolvar] // note this is fragile and depends on the color input model
              console.log(tipcol)
              d.tipAttributes.fill = tipcol;
              d.tipAttributes.stroke = d3.rgb(tipcol).darker();
              d.branchAttributes.stroke = d.tipAttributes.stroke;
          }else{
              d.branchAttributes.stroke = d3.rgb(params.colors[(dummy+i)%10]).darker();
              //d.branchAttributes["stroke-width"] = 1+i%7;
          }
      });
      dummy++;
      phyloTree.updateTips(myTree, [], ['fill', 'stroke'], 1000);
      phyloTree.updateBranches(myTree, [], ['stroke', 'stroke-width'], 1000);
      console.log(myTree);
       });

    d3.select("#" + el.id + "-sizeby").on("click", function(){

        var sizeval = document.getElementById(el.id + "-sizeby").value;

        // Get Size Domains from the input to make the scaling function
        var tipDomMin   = params.sizes[sizeval].min;
        var tipDomMax   = params.sizes[sizeval].max;
        var tipRangeMin = params.tipMinRadius;
        var tipRangeMax = params.tipMaxRadius;
        radfn           = makeRadiusFn(tipDomMin, tipDomMax, tipRangeMin, tipRangeMax);

        // Calc Individual Sizes and Update
        myTree.nodes.forEach(function(d,i){
            if (d.terminal){
                // get the tipAttribute value for the tip and scale it
                tipsizevar = d.n[sizeval]
                d.tipAttributes.r = radfn(tipsizevar);
            }
        });
        phyloTree.updateTipAttribute(myTree, 'r', 1000);
    });


    d3.select("#" + el.id + "-tiplabels").on("change", function(){
      var labeltips = document.getElementById(el.id + "-tiplabels").checked;
      if (labeltips === true) {
        phyloTree.tipLabels(myTree, tipText, tipFontSize, 5,5);
      } else {
         phyloTree.removeLabels(myTree);
      };
    });


    d3.select("#" + el.id + "-reset").on("click", function(){
        zoomClade(myTree.nodes[0]);
    });

    d3.select("#" + el.id + "-treeplot").on("dblclick", function(){
        console.log("zoom");
        phyloTree.zoomIn(myTree, 1.4,  700);
    });


    // Add callbacks to close the modal.
    // Must be run after DOM is loaded
    d3.select('.modal-close').on("click", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

    d3.select('.modal-background').on("dblclick", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

    d3.select('.modal').on("dblclick", function(d) {
      d3.select('.modal').attr("class", "modal")
    });
  }
});

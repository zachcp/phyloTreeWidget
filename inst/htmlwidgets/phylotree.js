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

    // setup vars
    var myTree;
    var dummy = 0;
    gparams = params;

    // support fns
    const zoomClade = function(d){
    	phyloTree.zoomIntoClade(myTree, d, 800);
    }

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
  					onTipHover:function(d){console.log(d.n.strain);},
  					onTipLeave:function(d){console.log(d.n.strain);},
  					onTipClick:function(d){addDataToModal(d)}
  					}
  	});


  	phyloTree.drawTree(myTree);
  	fulltree = myTree;


    // All the D3 select functions here
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
      console.log(colval);
      phyloTree.removeLabels(myTree);
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
        // myTree.tips.forEach(function(d,i){ d.tipAttributes.r = (dummy+i)%8+2; });
        // dummy++;
        // phyloTree.updateTipAttribute(myTree, 'r', 1000);
        var sizeval = document.getElementById(el.id + "-sizeby").value;
        console.log(sizeval);
        phyloTree.removeLabels(myTree);
        myTree.nodes.forEach(function(d,i){
            if (d.terminal){
                // get the tipAttribute value for the tip then
                tipsizevar = d.n[sizeval] //tip data held under the 'n' field
                //console.log(tipsizevar)
                d.tipAttributes.r = tipsizevar;
            }
        });
        dummy++;
        phyloTree.updateTipAttribute(myTree, 'r', 1000);
        //phyloTree.updateBranches(myTree, [], ['stroke', 'stroke-width'], 1000);
        console.log(myTree);
    });


    d3.select("#" + el.id + "-reset").on("click", function(){
        zoomClade(myTree.nodes[0]);
     });

    d3.select("#" + el.id + "-treeplot").on("dblclick", function(){
        console.log("zoom");
        phyloTree.zoomIn(myTree, 1.4,  700);
    });


    // Callbacks for the Modal
    // add callbacks to close the modal
    d3.select('.modal-close').on("click", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

    d3.select('.modal-background').on("dblclick", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

    d3.select('.modal').on("dblclick", function(d) {
      d3.select('.modal').attr("class", "modal")
    });
  },

});

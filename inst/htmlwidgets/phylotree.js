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
    };

    const tipText = function(d){
        if (d.n.strain && d.terminal){
            return d.n.strain;
        }else{
            return "";
      }
    };

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

    // setup the dom. found in phylotree_local.js
    setup_the_dom(el=el, params=params)

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

    // All the D3 select functions here. Found in phylotree_local.js
    add_listener_functions(el=el, params=params)
    add_modal_callbacks()

  }
});

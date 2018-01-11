// these vars are accessible in the browser
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
    var treeplot = d3.select("#" + el.id + "-treeplot");

    // setup the dom; add drop downs to the menu itmes.
    // found in phylotree_local.js
    setup_the_dom(el=el, params=params)

    // main fn
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
  	 	callbacks:{
  	 	      onBranchClick:function(d){zoomClade(d, tree=myTree)},
  					onBranchHover:function(d){console.log(d.n.strain);},
  					onBranchLeave:function(d){console.log(d.n.strain);},
  					//onTipHover:function(d){console.log(d.n.strain);},
  					//onTipLeave:function(d){console.log(d.n.strain);},
  					onTipHover:function(d){addDataToTooltip(d, el=el);},
  					onTipLeave:function(d){removeDataFromTooltip(d, el=el);},
  					onTipClick:function(d){addDataToModal(d);},
  					}
  	});

  	phyloTree.drawTree(myTree);
  	fulltree = myTree;

    // all the D3 select functions here.
    //Found in phylotree_local.js
    add_listener_functions(el=el, params=params, domtree=myTree)

    // control for the modals here.
    add_modal_callbacks()




  }
});

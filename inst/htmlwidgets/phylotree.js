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

    // setup the dom; add drop downs to the menu itmes.
    // found in phylotree_local.js
    setup_the_dom(el=el, params=params)

    // hide controls
    if (params.controlpanel === false) {
      console.log('Hiding control panel!')
      d3.select("#" + el.id + "-controlpanel").style('display', 'none')
      // note opposite is: ...style('display', 'block')
    }

    // setup and draw the tree
    const treeplot = d3.select("#" + el.id + "-treeplot");
  	const myTree = phyloTree.phyloTree(
  		params.treejson,
  		{svg:               treeplot,
  		 layout:            params.layout,
       distance:          params.distance,
       orientation:       {x:params.orientation_x, y:params.orientation_y},
       zoom:              {x:params.zoomLevel_x, y:params.zoomLevel_y},
       pan:               {x:params.pan_x, y:params.pan_y},
       tipRadius:         params.tipRadius,
       tipStroke:         params.tipStroke,
       tipFill:           params.tipFill,
       tipStrokeWidth:    params.tipStrokeWidth,
       branchStroke:      params.branchStroke,
       branchStrokeWidth: params.branchStrokeWidth,
       autoTipSize:       params.autoTipSize,
  		 margins:           {top:     params.margins,
  		                     bottom:  params.margins,
  		                     left:    params.margins,
  		                     right:   params.margins},
  	 	 callbacks:         {
                	 	      onBranchClick:function(d){cladeZoom(d, tree=myTree, el=el);},
                					onBranchHover:function(d){console.log(d.n.strain);},
                					onBranchLeave:function(d){console.log(d.n.strain);},
                					onTipHover:function(d){addDataToTooltip(d, el=el);},
                					onTipLeave:function(d){removeDataFromTooltip(d, el=el);},
                					onTipClick:function(d){addDataToModal(d);},
  					}
  	});

  	phyloTree.drawTree(myTree);

  	// add highlights
    if (!params.highlights === null) {
      highlight_tips(tree=myTree, params=params)
    }

    // all the D3 select functions here.
    //Found in phylotree_local.js
    add_listener_functions(el=el, params=params, domtree=myTree);

    // export to global scope for testing/experimentation
    fulltree = myTree;
  	gparams  = params;

  }
});

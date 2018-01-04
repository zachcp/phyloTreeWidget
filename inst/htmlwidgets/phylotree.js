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
    var dummy=0;
    var colors   = params.colors;
    treedata     = params.treejson;
    gparams      = params;

    var treeplot = d3.select("#" + el.id + "-treeplot");

    // support fns
    const zoomClade = function(d){
    	phyloTree.zoomIntoClade(myTree, d, 800);
    }

    // setup dom
    d3.select("#" + el.id + "-colorby")
      .selectAll("option")
      .data(d3.keys(colors))
      .enter()
      .append("option")
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });


    // main fn
  	myTree = phyloTree.phyloTree(
  		treedata,
  		{svg:treeplot,
  		 margins:{top:10, bottom:10, left:10, right:10},
  		callbacks:{onBranchClick:zoomClade,
  					onBranchHover:function(d){console.log(d.n.strain);},
  					onBranchLeave:function(d){console.log(d.n.strain);},
  					onTipHover:function(d){console.log(d.n.strain);},
  					onTipLeave:function(d){console.log(d.n.strain);}
  	}});
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

    d3.select("#size").on("click", function(){
        myTree.tips.forEach(function(d,i){
            d.tipAttributes.r = (dummy+i)%8+2;
        });
        dummy++;
        phyloTree.updateTipAttribute(myTree, 'r', 1000);
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
              //console.log(tipcolvar)
              tipcol    = colors[colval][tipcolvar][0] // note this is fragile and depends on the color input model
              //console.log(tipcol)
              d.tipAttributes.fill = tipcol;
              d.tipAttributes.stroke = d3.rgb(tipcol).darker();
              d.branchAttributes.stroke = d.tipAttributes.stroke;
          }else{
              d.branchAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
              //d.branchAttributes["stroke-width"] = 3+i%7;
          }
      });
      dummy++;
      phyloTree.updateTips(myTree, [], ['fill', 'stroke'], 1000);
      phyloTree.updateBranches(myTree, [], ['stroke', 'stroke-width'], 1000);
      console.log(myTree);
       });

   d3.select("#both").on("click", function(){
       myTree.tips.forEach(function(d,i){
          d.tipAttributes.fill = colors[(dummy+i)%10];
          d.tipAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
          d.tipAttributes.old_r = d.tipAttributes.r;
          d.tipAttributes.r = (dummy+i)%8+2;
          d.branchAttributes.stroke = d.tipAttributes.stroke;
         });
        dummy++;
        phyloTree.updateTips(myTree, ['r'], ['fill', 'stroke'], 1000);
        phyloTree.updateBranchStyle(myTree, 'stroke', 1000);
        console.log(myTree)
      });

    d3.select("#reset").on("click", function(){
        zoomClade(myTree.nodes[0]);
     });

    d3.select("#treeplot").on("dblclick", function(){
        console.log("zoom");
        phyloTree.zoomIn(myTree, 1.4,  700);
    });

  },

});

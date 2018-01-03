var treedata, gparams;

HTMLWidgets.widget({

  name: 'phylotree',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    console.log("in the factory!")

    return {

      renderValue: function(params) {
        console.log("in the render!")

        // TODO: code to render the widget, e.g.
        treedata = params.zika
        //el.innerText = params.message;
        console.log(params.zika);
        var treeplot = d3.select("#treeplot");

        var myTree;
        var dummy=0;
        //var treedata;

        const zoomClade = function(d){
        	phyloTree.zoomIntoClade(myTree, d, 800);
        }

        const zoom = function(){
        	phyloTree.zoomIn(myTree, 1.4,  700);
        }

        const colors = [
  "#60AA9E", "#D9AD3D", "#5097BA", "#E67030", "#8EBC66", "#E59637", "#AABD52", "#DF4327", "#C4B945", "#75B681"
];

       console.log("Going to Draw the Tree!");
       console.log("Tree is drawn!");

      	tree = phyloTree.phyloTree(
      		treedata,
      		{svg:treeplot,
      		 margins:{top:10, bottom:10, left:10, right:10},
      		callbacks:{onBranchClick:zoomClade,
      					onBranchHover:function(d){console.log(d.n.strain);},
      					onBranchLeave:function(d){console.log(d.n.strain);},
      					onTipHover:function(d){console.log(d.n.strain);},
      					onTipLeave:function(d){console.log(d.n.strain);}
      	}});
      	// myTree = drawPhyloTree(treedata, treeplot)

      	phyloTree.drawTree(tree);
      	myTree = tree;

      	 d3.select("#layout").on("change", function(){
          var layout = document.getElementById("layout").value;
          myTree.dimensions.height=500;
          phyloTree.changeLayout(myTree, 1000, layout);
      	 });


      	d3.select("#distance").on("change", function(){
          var distance = document.getElementById("distance").value;
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

        d3.select("#color").on("click", function(){
          phyloTree.removeLabels(myTree);
          myTree.nodes.forEach(function(d,i){
              if (d.terminal){
                  d.tipAttributes.fill = colors[(dummy+i)%10];
                  d.tipAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
                  d.branchAttributes.stroke = d.tipAttributes.stroke;
              }else{
                  d.branchAttributes.stroke = d3.rgb(colors[(dummy+i)%10]).darker();
                  d.branchAttributes["stroke-width"] = 3+i%7;
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
          });

        d3.select("#reset").on("click", function(){
            zoomClade(myTree.nodes[0]);
         });

        d3.select("#treeplot").on("dblclick", function(){
            console.log("zoom");
            phyloTree.zoom();
        });

      },


      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

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
      },


      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});

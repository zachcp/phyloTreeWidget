//
// Code To Control the Modal
//
// Note this is all based on html modal classes created in phyotree.R
// css is the bulma modal css.


// add modal processing function
const addDataToModal = function(node, excludes=["parent", 'clade', 'attr', 'shell']) {

  // update title with Node ID
  d3.select(".modal-card-title").text(node.n.name);

  // update Body with Node information
  var modalbody = document.getElementsByClassName("modal-card-body")[0];

  // reset the body
  modalbody.innerHTML = ""

  // add the data to the modal
  var nodekeys = d3.keys(node.n);
  nodekeys.forEach(function(nodekey) {

    if (excludes.includes(nodekey)) {
      console.log("Excluding: " + nodekey)
      return
    }

    console.log("NOT Excluding: " + nodekey)
    console.log(nodekey)
    content = document.createTextNode(nodekey + ": " + node.n[nodekey]);
    modalbody.appendChild(content);
    modalbody.appendChild(document.createElement("br"));


    // valcontent = document.createTextNode(node.n[nodekey]);
    // modalbody.appendChild(valcontent)
    // modalbody.appendChild(document.createElement("hr"));

  });

  // Make Node Visible
  d3.select('.modal').attr("class", "modal is-active")

};

// dynamic radius calculation for specific types
var makeRadiusFn = function(domain_max, domain_min, range_min, range_max) {
  return d3.scale.sqrt().domain([domain_min, domain_max]).range([range_min, range_max])
};

const setup_the_dom = function(el, params) {
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

};


const add_contorl_listeners = function(el, params) {
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

        var sizeval  = document.getElementById(el.id + "-sizeby").value;
        var tiplabel= document.getElementById(el.id + "-tiblabels").checked;

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
        phyloTree.removeLabels(myTree);
        phyloTree.updateTipAttribute(myTree, 'r', 1000);
        if (tiplabels === true)  {
          phyloTree.tipLabels(myTree, tipText, tipFontSize, 5,5);
        }
    });


    d3.select("#" + el.id + "-tiplabels").on("change", function(){
      var labeltips = document.getElementById(el.id + "-tiplabels").checked;
      if (labeltips === true) {
        phyloTree.tipLabels(myTree, tipText, tipFontSize, 5,5);
      } else {
         phyloTree.removeLabels(myTree);
      }
    });


    d3.select("#" + el.id + "-reset").on("click", function(){
        zoomClade(myTree.nodes[0]);
    });

    d3.select("#" + el.id + "-treeplot").on("dblclick", function(){
        phyloTree.zoomIn(myTree, 1.4,  700);
    });

};


const add_modal_callbacks = function() {
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

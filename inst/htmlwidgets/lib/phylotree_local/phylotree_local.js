//
// Code To Control the Interface
//



////////////////////////////////////////////////////////////////////////////////
// Helper Functions

// what to label the tips
const tipText = function(d){
        if (d.n.strain && d.terminal){
            return d.n.strain;
        }else{
            return "";
      }
    };

// dynamic radius calculation for specific types
var makeRadiusFn = function(domain_max, domain_min, range_min, range_max) {
  return d3.scale.sqrt().domain([domain_min, domain_max]).range([range_min, range_max])
};



////////////////////////////////////////////////////////////////////////////////
// Control Panel

// add drop down value to the select boxes
// note: all of the secltions are based on UID from htmlwidgets, 'el.id'
const setup_the_dom = function(el, params) {
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


// there are the on-click events that fire when the control boxes are pushed
const add_listener_functions = function(el, params, domtree) {

      // handle layout here.
    	d3.select("#" + el.id + "-layout").on("change", function(){

        var layout    = document.getElementById(el.id + "-layout").value;
        var tiplabels = document.getElementById(el.id + "-tiplabels").checked;

        if (tiplabels === true) { phyloTree.removeLabels(domtree)}

        phyloTree.changeLayout(domtree, 1000, layout);

        if (tiplabels === true) { phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5, 5);}

  	 });


  	d3.select("#" + el.id + "-distance").on("change", function(){
      var distance = document.getElementById( el.id + "-distance").value;
      var tiplabels = document.getElementById(el.id + "-tiplabels").checked;
       if (tiplabels === true) { phyloTree.removeLabels(domtree)}
      phyloTree.changeDistance(domtree, 1000, distance);
      if (tiplabels === true) { phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5, 5);}
      //console.log(domtree);
      });

    d3.select("#" + el.id + "-colorby").on("click", function(){
      var colval = document.getElementById(el.id + "-colorby").value;
      //console.log(colval);
      domtree.nodes.forEach(function(d,i){
          if (d.terminal){

              // get the tipAttribute value for the tip then
              // lookup and set
              //console.log(d3.keys(d.tipAttributes))
              tipcolvar = d.n[colval] //tip data held under the 'n' field
              console.log(tipcolvar)
              // note this is fragile and depends on the color input model
              tipcol    = params.colors[colval][tipcolvar]
              console.log(tipcol)
              d.tipAttributes.fill = tipcol;
              d.tipAttributes.stroke = d3.rgb(tipcol).darker();
              d.branchAttributes.stroke = d.tipAttributes.stroke;
          }else{
              //d.branchAttributes.stroke = d3.rgb(params.colors[(dummy+i)%10]).darker();
              //d.branchAttributes["stroke-width"] = 1+i%7;
          }
      });

      phyloTree.updateTips(domtree, [], ['fill', 'stroke'], 1000);
      phyloTree.updateBranches(domtree, [], ['stroke', 'stroke-width'], 1000);
      console.log(domtree);
       });

    // control the size of the tips
    d3.select("#" + el.id + "-sizeby").on("click", function(){

        var sizeval  = document.getElementById(el.id + "-sizeby").value;
        var tiplabel = document.getElementById(el.id + "-tiplabels").checked;

        // Get Size Domains from the input to make the scaling function
        var tipDomMin   = params.sizes[sizeval].min;
        var tipDomMax   = params.sizes[sizeval].max;
        var tipRangeMin = params.tipMinRadius;
        var tipRangeMax = params.tipMaxRadius;
        radfn           = makeRadiusFn(tipDomMin, tipDomMax, tipRangeMin, tipRangeMax);

        // Calc Individual Sizes and Update
        domtree.nodes.forEach(function(d,i){
            if (d.terminal){
                // get the tipAttribute value for the tip and scale it
                tipsizevar = d.n[sizeval]
                d.tipAttributes.r = radfn(tipsizevar);
            }
        });

        if (tiplabels === true) {phyloTree.removeLabels(domtree)}
        phyloTree.updateTipAttribute(domtree, 'r', 1000);
        if (tiplabels === true)  { phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5, 5);}
    });


    d3.select("#" + el.id + "-tiplabels").on("change", function(){
      var labeltips = document.getElementById(el.id + "-tiplabels").checked;
      if (labeltips === true) {
        phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5,5);
      } else {
         phyloTree.removeLabels(domtree);
      }
    });


    d3.select("#" + el.id + "-reset").on("click", function(){
        var labeltips = document.getElementById(el.id + "-tiplabels").checked;
        if (labeltips === true) { phyloTree.removeLabels(domtree);}
        phyloTree.zoomIntoClade(domtree, domtree.nodes[0], 800);
        if (labeltips === true) {
          phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5,5);
    }});

    d3.select("#" + el.id + "-treeplot").on("dblclick", function(){
       var labeltips = document.getElementById(el.id + "-tiplabels").checked;
       if (labeltips === true) { phyloTree.removeLabels(domtree);}
        phyloTree.zoomIn(domtree, 1.4,  700);
        if (labeltips === true) {
          phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5,5);
    }});

    // Modal Call backs Here
    // Add callbacks to close the modal.
    d3.select('.modal-close').on("click", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

    d3.select('.modal-background').on("dblclick", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

    d3.select('.modal').on("dblclick", function(d) {
      d3.select('.modal').attr("class", "modal")
    });

};


////////////////////////////////////////////////////////////////////////////////
// Tooltips
const addDataToTooltip = function(node, el, excludes=["parent", 'clade', 'attr', 'shell']) {

    //get tooltip div
    var tooltipdiv = d3.select("#" + el.id + "-tooltip")
    tooltipdiv.transition()
          .duration(200)
          .style("opacity", .9);
    tooltipdiv.html( node.n.strain )
          .style("left", (d3.event.pageX) + "px")
          .style("top",  (d3.event.pageY - 28) + "px");
};

const removeDataFromTooltip = function(node, el, excludes=["parent", 'clade', 'attr', 'shell']) {
    //get tooltip div
    var tooltipdiv = d3.select("#" + el.id + "-tooltip")
    tooltipdiv.transition()
          .duration(500)
          .style("opacity", 0);
};


////////////////////////////////////////////////////////////////////////////////
// Modal
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



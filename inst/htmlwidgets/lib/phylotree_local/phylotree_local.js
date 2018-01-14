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

    d3.select("#" + el.id + "-regexselectbox")
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

const cladeZoom = function(d, tree, el) {
  var labeltips = document.getElementById(el.id + "-tiplabels").checked;
  if (labeltips === true) { phyloTree.removeLabels(domtree);}
  phyloTree.zoomIntoClade(tree, d, 500);
  if (labeltips === true) {
    phyloTree.tipLabels(tree, tipText, function(){return params.tipFontSize;}, 5,5);
  }
}


// there are the on-click events that fire when the control boxes are pushed
const add_listener_functions = function(el, params, domtree) {

      // handle layout here.
    	d3.select("#" + el.id + "-layout").on("change", function(){

        var layout    = document.getElementById(el.id + "-layout").value;
        var labeltips = document.getElementById(el.id + "-tiplabels").checked;

        if (labeltips === true) { phyloTree.removeLabels(domtree)}

        phyloTree.changeLayout(domtree, 1000, layout);

        if (labeltips === true) { phyloTree.tipLabels(domtree, tipText, function(){return params.tipFontSize;}, 5, 5);}

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
              tipcolvar = d.n[colval] //tip data held under the 'n' field

              // note this is fragile and depends on the color input model
              tipcol    = params.colors[colval][tipcolvar]

              d.tipAttributes.fill = tipcol;
              d.tipAttributes.stroke = d3.rgb(tipcol).darker();
              d.branchAttributes.stroke = d.tipAttributes.stroke;
              d.tipAttributes.class = "tip nip";
          }else{
              //d.branchAttributes.stroke = d3.rgb(params.colors[(dummy+i)%10]).darker();
              //d.branchAttributes["stroke-width"] = 1+i%7;
          }
      });

      phyloTree.updateTips(domtree, ['class'], ['fill', 'class'], 1000);
      phyloTree.updateBranches(domtree, [], ['stroke', 'stroke-width'], 1000);
      console.log(domtree);
       });

    // control the size of the tips
    d3.select("#" + el.id + "-sizeby").on("click", function(){

        var sizeval   = document.getElementById(el.id + "-sizeby").value;
        var tiplabels = document.getElementById(el.id + "-tiplabels").checked;

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

    d3.select("#" + el.id + "-regexinput").on('input', function(d){
      textval = document.getElementById(el.id + '-regexinput').value
      colval  = document.getElementById(el.id + '-regexselectbox').value

      console.log(colval);
      console.log(params.highlight_size);
      console.log(params.highlight_color);

      if (textval.length > 3) {
              domtree.tips
        //.filter( function(tip) {
        //      return tip.n[colval].match(new RegExp(textval, "i")) ? true : false;})
        .forEach( function(tip,i) {

            tipmatches = tip.n[colval].match(new RegExp(textval, "i"))
            if (tipmatches === true) {
              tip.tipAttributes['r'] =      params.highlight_size
            } else {
              tip.tipAttributes['r'] =      params.tipRadius
            }

            console.log(tip);
        });

        phyloTree.updateTips(domtree, [], ['fill', 'stroke'], 500);
        phyloTree.updateTipAttribute(domtree, 'r')
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

const removeDataFromTooltip = function(node, el) {
    //get tooltip div
    var tooltipdiv = d3.select("#" + el.id + "-tooltip")
    tooltipdiv.transition()
          .duration(500)
          .style("opacity", 0);
};


////////////////////////////////////////////////////////////////////////////////
// Modal
const addDataToModal = function(node, excludes=["parent", 'clade', 'attr', 'shell', 'strain', 'name']) {

  // update title with Node ID
  d3.select(".modal-card-title").text(node.n.name);

  // update Body with Node information
  var modalbody = document.getElementsByClassName("modal-card-body")[0];

  // reset the body
  modalbody.innerHTML = ""

  // add the data to the modal
  var table = d3.select(".modal-card-body")
                .append("table")
                .attr('class', 'table is-fullwidth')

  var	tbody = table.append('tbody');

	// exclude columns based on exclusion list
	table_entries = d3.entries(node.n).filter(function(d) {return !excludes.includes(d.key)})

	var rows = tbody.selectAll('tr')
    .data(table_entries)
    .enter()
    .append('tr')

  rows.append('th').text( function(d) {return d.key})
  rows.append('td').text( function(d) {return d.value})

  // Make Node Visible
  d3.select('.modal').attr("class", "modal is-active")

};


const highlight_tips = function(tree, params) {

  params.highlights.forEach(function(d,i){
    tree.tips
      .filter( function(tip) {
          return tip.n[d.column].match(new RegExp(d.tipregex, "i")) ? true : false;})
      .forEach( function(tip,i) {
          tip.tipAttributes['r'] =      d.highlight_size
          tip.tipAttributes['fill'] =   d.highlight_color
          tip.tipAttributes['stroke'] = d.highlight_color
      });
  });

  phyloTree.updateTips(tree, [], ['fill', 'stroke'], 500);
  phyloTree.updateTipAttribute(tree, 'r')

};

const highlight_tips_list = function(tree, params) {

  params.highlightlists.forEach(function(d,i){
    tree.tips
      .filter( function(tip) {
          return d.nodenames.includes( tip.n[d.column])})
      .forEach( function(tip, i) {
          tip.tipAttributes['r'] =      d.highlight_size
          tip.tipAttributes['fill'] =   d.highlight_color
          tip.tipAttributes['stroke'] = d.highlight_color
      });
  });

  phyloTree.updateTips(tree, [], ['fill', 'stroke'], 500);
  phyloTree.updateTipAttribute(tree, 'r')

};


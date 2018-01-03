(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3'], factory) :
	(factory((global.phyloTree = {}),global.d3));
}(this, (function (exports,d3) { 'use strict';

const preOrderIteration = function(node, callback){
    callback(node);
    if (node.children){
        for (var i=0; i<node.children.length; i++){
            preOrderIteration(node.children[i], callback);
        }
    }
};

const postOrderIteration = function(node, callback){
    if (node.children){
        for (var i=0; i<node.children.length; i++){
            postOrderIteration(node.children[i], callback);
        }
    }
    callback(node);
};

/**
 *
 * @param  {object} tree the phyloTree data structure
 * @param  {object} callbacks object with callback that specify the appearance of each tip
 */
const drawBranches = function(tree, callbacks){
    setupBranches(tree);
    makePathStem(tree);
    makePathTbar(tree);
	const tmp_callbacks = Object.assign({}, callbacks);
	if (!tmp_callbacks.stroke){tmp_callbacks.stroke = function(d){return tree.branchStroke;};}
    if (!tmp_callbacks.strokeWidth){tmp_callbacks["stroke-width"] = function(d){return tree.branchStrokeWidth;};}

    tree.nodes.forEach(function(d){
        d.branchAttributes.stroke = tmp_callbacks.stroke(d);
        d.branchAttributes["stroke-width"] = tmp_callbacks["stroke-width"](d);
        d.branchAttributes.idTbar = "branch_T_" + d.n.clade;
        d.branchAttributes.idStem = "branch_S_" + d.n.clade;
    });
    tree.branchStemElements
        .attr("d", function(d){return d.branchAttributes.pathStem;})
        .attr("id", function(d){return d.branchAttributes.idStem;})
        .style("stroke", function(d){return d.branchAttributes.stroke;})
        .style("stroke-width", function(d){return d.branchAttributes["stroke-width"];});
    tree.branchTbarElements
        .attr("d", function(d){return d.branchAttributes.pathTbar;})
        .attr("id", function(d){return d.branchAttributes.idTbar;})
        .style("stroke", function(d){return d.branchAttributes.stroke;})
        .style("stroke-width", function(d){return d.branchAttributes["stroke-width"];});
};

/**
 * create the d3 objects for tips and bind the callbacks
 * @param  {[type]} tree [description]
 * @return {[type]}      [description]
 */
const setupBranches = function(tree){
    tree.svg.selectAll(".branch").remove();
    tree.branchTbarElements = tree.topLevelGroup.selectAll(".branch T")
        .data(tree.nodes)
        .enter()
        .append("path")
        .attr("class", "branch T")
        .on("mouseover", function(d) {tree.callbacks.onBranchHover(d);})
        .on("mouseout", function(d) {tree.callbacks.onBranchLeave(d);})
        .on("click", function(d) {tree.callbacks.onBranchClick(d);})
        .style("fill","none")
        .style("pointer-events", "auto")
        .style("cursor", "pointer");

    tree.branchStemElements = tree.topLevelGroup.selectAll(".branch S")
        .data(tree.nodes)
        .enter()
        .append("path")
        .attr("class", "branch S")
        .on("mouseover", function(d) {tree.callbacks.onBranchHover(d);})
        .on("mouseout", function(d) {tree.callbacks.onBranchLeave(d);})
        .on("click", function(d) {tree.callbacks.onBranchClick(d);})
        .style("stroke-linecap","round")
        .style("fill","none")
        .style("pointer-events", "auto")
        .style("cursor", "pointer");

};


const makePathStem = function(tree){
    const stem_offset = tree.nodes.map(function(d){
                return (0.5*(d.parent.branchAttributes["stroke-width"]
                           - d.branchAttributes["stroke-width"]) || 0.0);
            });
    if (tree.layout === "rect"){
        tree.nodes.forEach(function(d,i){
            d.branchAttributes.pathStem = `M ${d.SVGcoords.xBase - stem_offset[i]}, ${d.SVGcoords.yBase} L ${d.SVGcoords.xTip}, ${d.SVGcoords.yTip}`;
        });
    }else if (tree.layout==="radial"){
        tree.nodes.forEach(function(d,i){
            d.branchAttributes.pathStem = `M ${d.SVGcoords.xBase - stem_offset[i]*Math.sin(d.layout.angle)}, ${d.SVGcoords.yBase - stem_offset[i]*Math.cos(d.layout.angle)} L ${d.SVGcoords.xTip}, ${d.SVGcoords.yTip}`;
        });
    }else{
        tree.nodes.forEach(function(d,i){
            d.branchAttributes.pathStem = `M ${d.SVGcoords.xBase}, ${d.SVGcoords.yBase} L ${d.SVGcoords.xTip}, ${d.SVGcoords.yTip}`;
        });
    }
};

const makePathTbar = function(tree){
    if (tree.layout === "rect"){
        tree.internals.forEach(function(d){
            d.branchAttributes.pathTbar = `M ${d.SVGcoords.xTBarStart}, ${d.SVGcoords.yTBarStart} L ${d.SVGcoords.xTBarEnd}, ${d.SVGcoords.yTBarEnd}`;
        });
    }else if (tree.layout === "radial"){
        tree.internals.forEach(function(d){
            d.branchAttributes.pathTbar = `M ${d.SVGcoords.xTBarStart}, ${d.SVGcoords.yTBarStart} A ${d.SVGcoords.rx} ${d.SVGcoords.ry} 0  ${(d.smallBigArc?" 1 ":" 0 ")} 0  ${d.SVGcoords.xTBarEnd}, ${d.SVGcoords.yTBarEnd}`;
        });
    }else{
        tree.internals.forEach(function(d){
            d.branchAttributes.pathTbar = '';
        });
    }
};

const addScaleBar = function (tree, fontsize){
    tree.svg.selectAll('.scalebar').remove();
    if (!fontsize){
        fontsize = 10;
    }
    const extend = tree.xScale.domain()[1] - tree.xScale.domain()[0];
    var magnitude = Math.pow(10,Math.floor(Math.log10(extend)-1));
    magnitude *= Math.ceil(extend/magnitude*0.1);
    const xMin = tree.xScale.range()[0] + 0.05*(tree.xScale.range()[1]-tree.xScale.range()[0]);
    const xMax = xMin+tree.xScale(magnitude) - tree.xScale(0);
    const y = tree.yScale.range()[0] + 0.95*(tree.yScale.range()[1]-tree.yScale.range()[0]);
    const pathLine = `M ${xMin}, ${y} L ${xMax}, ${y}`;
    tree.svg.append("g").selectAll(".scalebar").data([{xMin, xMax, y}]).enter()
    .append("path")
    .attr("d", pathLine)
    .attr("class", "scalebar")
    .style('stroke-linecap', 'round')
    .style("stroke","#CCC")
    .style("stroke-width",2);

    tree.svg.append("g").selectAll(".scalebar text").data([{xMin, xMax, y}]).enter()
    .append("text")
    .text(magnitude.toFixed(-Math.log10(magnitude)+1))
    .attr('x', 0.5*(xMax+xMin))
    .attr('y', y + fontsize*1.3)
    .attr("class", "scalebar text")
    .style('text-anchor', 'middle')
    .style("stroke","#CCC")
    .style("fill","#CCC")
    .style('font-size',fontsize+'px');

};

//function in here go from node.layout -> node.SVGcoords
/**
 * convert all coordinates in layout into values in SVG space
 * @param {object} tree the tree data structure
 */
const setScales = function(tree){
    const width = tree.dimensions.width;
    const height = tree.dimensions.height;
    const margins = tree.margins || {left:0, right:0, top:0, bottom:0};
    if (tree.layout === "radial" || tree.layout === "unrooted") {
        //Force Square: TODO, harmonize with the map to screen
        const xExtend = width - margins.left - margins.right;
        const yExtend = height - margins.top - margins.top;
        const minExtend = d3.min([xExtend, yExtend]);
        const xSlack = xExtend - minExtend;
        const ySlack = yExtend - minExtend;
        tree.xScale.range([0.5 * xSlack + margins.left, width - 0.5 * xSlack - margins.right]);
        tree.yScale.range([0.5 * ySlack + margins.top, height - 0.5 * ySlack - margins.bottom]);

    } else {
        // for rectancular layout, allow flipping orientation of left right and top/botton
        if (tree.orientation.x>0){
          tree.xScale.range([margins.left, width - margins.right]);
        }else{
          tree.xScale.range([width - margins.right, margins.left]);
        }
        if (tree.orientation.y>0){
          tree.yScale.range([margins.top, height - margins.bottom]);
        } else {
          tree.yScale.range([height - margins.bottom, margins.top]);
        }
    }

    if (!tree.visibleRectangle){
        console.log(tree.visibleRectangle);
        resetView(tree);
    }
    if (tree.layout === "radial" || tree.layout === "unrooted"){
        // handle "radial and unrooted differently since they need to be square
        // since branch length move in x and y direction
        // TODO: should be tied to svg dimensions
        const minX = tree.visibleRectangle.left;
        const minY = tree.visibleRectangle.bottom;
        const spanX = tree.visibleRectangle.right-minX;
        const spanY = tree.visibleRectangle.top-minY;
        const maxSpan = d3.max([spanY, spanX]);
        const ySlack = (spanX>spanY) ? (spanX-spanY)*0.5 : 0.0;
        const xSlack = (spanX<spanY) ? (spanY-spanX)*0.5 : 0.0;
        tree.xScale.domain([minX-xSlack, minX+maxSpan-xSlack]);
        tree.yScale.domain([minY-ySlack, minY+maxSpan-ySlack]);
    }else if (tree.layout === "clock"){
        tree.xScale.domain([tree.visibleRectangle.left, tree.visibleRectangle.right]);
        tree.yScale.domain([tree.visibleRectangle.top, tree.visibleRectangle.bottom]);
    }else{
        tree.xScale.domain([tree.visibleRectangle.left, tree.visibleRectangle.right]);
        tree.yScale.domain([tree.visibleRectangle.bottom, tree.visibleRectangle.top]);
    }
};


/**
 * wrapper function that converts the previously calculated layout into svg coordinates
 * @param  {object} tree object containing nodes, dimensions, margins, visibleRectangle
 * @return {null}       everything is changed in place.
 */
const treeCanvas = function(tree){
    setScales(tree);
    const tmp_xScale=tree.xScale;
    const tmp_yScale=tree.yScale;
    tree.nodes.forEach(
        function(d){
            d.SVGcoords.xTip = tmp_xScale(d.layout.x);
            d.SVGcoords.yTip = tmp_yScale(d.layout.y);
            d.SVGcoords.xBase = tmp_xScale(d.layout.px);
            d.SVGcoords.yBase = tmp_yScale(d.layout.py);
        }
    );
    if (tree.layout==="radial"){
        const offset = tree.nodes[0].layout.depth;
        tree.nodes.forEach(
            function(d){
                d.SVGcoords.rx = tmp_xScale(d.layout.depth) - tmp_xScale(offset);
                d.SVGcoords.ry = tmp_yScale(d.layout.depth) - tmp_yScale(offset);
            }
        );
    }
    if (tree.layout==="rect" || tree.layout==="radial"){
        tree.internals.filter(function(d){return !d.terminal;}).forEach(
            function(d)
            {
                d.SVGcoords.yTBarStart = tmp_yScale(d.layout.yTBarStart);
                d.SVGcoords.yTBarEnd =   tmp_yScale(d.layout.yTBarEnd);
                d.SVGcoords.xTBarStart = tmp_xScale(d.layout.xTBarStart);
                d.SVGcoords.xTBarEnd =   tmp_xScale(d.layout.xTBarEnd);
            }
        );
    }
    if (tree.scaleBar || tree.scalebar){
        addScaleBar(tree);
    }
};

const branchOpacity = function(tree, opacity, dt){
    tree.branchStemElements
        .transition().duration(dt)
        .style("opacity", opacity);
    tree.branchTbarElements
        .transition().duration(dt)
        .style("opacity", opacity);
};

/**
 * To be called after SVGcoordinates have been recalculated
 * @param  {object} tree the phyloTree data structure
 */
const updateGeometry = function(tree, dt){
    treeCanvas(tree);
    if (!dt){
        dt=0;
    }
    tree.tipElements
        .transition().duration(dt)
        .attr("cx", function(d){return d.SVGcoords.xTip;})
        .attr("cy", function(d){return d.SVGcoords.yTip;});

    makePathStem(tree);
    tree.branchStemElements
        .transition().duration(dt)
        .attr("d", function(d){return d.branchAttributes.pathStem;});
    makePathTbar(tree);
    tree.branchTbarElements
        .transition().duration(dt)
        .attr("d", function(d){return d.branchAttributes.pathTbar;});
    if (tree.confidenceElements){
        //TODO
    }
};

/**
 * To be called after SVGcoordinates have been recalculated
 * @param  {object} tree the phyloTree data structure
 */
const updateGeometryFade = function(tree, dt){
    if (!dt){
        updateGeometry(tree, 0);
        return;
    }
    treeCanvas(tree);
    branchOpacity(tree, 0.0, dt*0.25);

    tree.tipElements
        .transition().duration(dt*0.5)
        .attr("cx", function(d){return d.SVGcoords.xTip;})
        .attr("cy", function(d){return d.SVGcoords.yTip;});

    setTimeout(function(){
        makePathStem(tree);
        tree.branchStemElements
            .attr("d", function(d){return d.branchAttributes.pathStem;});
        makePathTbar(tree);
        tree.branchTbarElements
            .attr("d", function(d){return d.branchAttributes.pathTbar;});
        }, 0.25*dt);

    setTimeout(function(){return branchOpacity(tree, 1.0, dt*0.25);}, dt*0.75);
    if (tree.confidenceElements){
        //TODO
    }
};


/**
 * change the layout of the tree. if newLayout is set, it will be used.
 * otherwise the layout will be recalculated as specified in tree.layout
 * @param  {object} tree      phyloTree object
 * @param  {int} dt        duration of the transition animation in milliseconds
 * @param  {string} newLayout layout to use, one of "rect", "radial", "unrooted", or "clock"
 */
const changeLayout = function(tree, dt, newLayout){
    if (newLayout){
        tree.layout = newLayout;
    }
    if (tree.layout==="clock" && tree.distance==="num_date"){
        tree.distance = "div";
    }
    treeLayout(tree);
    updateGeometryFade(tree, dt);
};

/**
 * change distance scale of the tree. if newDistance is set, it will be used.
 * otherwise the distance will be recalculated as specified in tree.distance
 * @param  {object} tree      phyloTree object
 * @param  {int} dt        duration of the transition animation in milliseconds
 * @param  {string} newDistance distance to use, default is "div", needs to be set in node.attr
 */
const changeDistance = function(tree, dt, newDistance){
    if (newDistance){
        tree.distance = newDistance;
    }
    treeLayout(tree);
    updateGeometry(tree, dt);
};


/**
 * update style of tips
 */
const updateTipStyle = function(tree, style, dt) {
    if (dt){
        tree.tipElements.transition().duration(dt)
            .style(style, function(d){return d.tipAttributes[style];});
    }else{
        tree.tipElements
            .style(style, function(d){return d.tipAttributes[style];});
    }
};

/**
 * update attr of tips
 */
const updateTipAttribute = function(tree, attr, dt) {
    if (dt){
        tree.tipElements.transition().duration(dt)
            .attr(attr, function(d){return d.tipAttributes[attr];});
    }else{
        tree.tipElements
            .attr(attr, function(d){return d.tipAttributes[attr];});
    }
};

/**
 * update style of branches
 */
const updateBranchStyle = function(tree, style, dt) {
    if (dt){
        tree.branchStemElements.transition().duration(dt)
            .style(style, function(d){return d.branchAttributes[style];});
        tree.branchTbarElements.transition().duration(dt)
            .style(style, function(d){return d.branchAttributes[style];});
    }else{
        tree.branchStemElements
            .style(style, function(d){return d.branchAttributes[style];});
        tree.branchTbarElements
            .style(style, function(d){return d.branchAttributes[style];});
    }
};

/**
 * update attr of branches
 */
const updateBranchAttribute = function(tree, attr, dt) {
    if (dt){
        tree.branchStemElements.transition().duration(dt)
            .attr(attr, function(d){return d.branchAttributes[attr];});
        tree.branchTbarElements.transition().duration(dt)
            .attr(attr, function(d){return d.branchAttributes[attr];});
    }else{
        tree.branchStemElements
            .attr(attr, function(d){return d.branchAttributes[attr];});
        tree.branchTbarElements
            .attr(attr, function(d){return d.branchAttributes[attr];});
    }
};

/**
 * Update multiple style or attributes of  tree elements at once
 * @param {object} tree phyloTree object
 * @param {list} attr list of things to change
 * @param {list} styles list of things to change
 * @param {int} dt time in milliseconds
 */
const updateTips = function(tree, attrs, styles, dt) {
  // function that return the closure object for updating the svg
  function update() {
    return function(selection) {
      for (var i=0; i<styles.length; i++) {
        var prop = styles[i];
        selection.style(prop, function(d) {
          return d.tipAttributes[prop];
        });
      }
      for (var i = 0; i < attrs.length; i++) {
        var prop = attrs[i];
        selection.attr(prop, function(d) {
          return d.tipAttributes[prop];
        });
      }
    };
  }
  // update the svg
  if (dt) {
    tree.tipElements.transition().duration(dt).call(update());
  } else {
    tree.tipElements.call(update());
  }
};


/**
 * Update multiple style or attributes of  tree elements at once
 * @param {object} tree phyloTree object
 * @param {list} attr list of things to change
 * @param {list} styles list of things to change
 * @param {int} dt time in milliseconds
 */
const updateBranches = function(tree, attrs, styles, dt) {
  // function that return the closure object for updating the svg
  function update() {
    return function(selection) {
      for (var i=0; i<styles.length; i++) {
        var prop = styles[i];
        selection.style(prop, function(d) {
          return d.branchAttributes[prop];
        });
      }
      for (var i = 0; i < attrs.length; i++) {
        var prop = attrs[i];
        selection.attr(prop, function(d) {
          return d.branchAttributes[prop];
        });
      }
    };
  }
  // update the svg
  if (dt) {
    tree.branchStemElements.transition().duration(dt).call(update());
    tree.branchTbarElements.transition().duration(dt).call(update());
  } else {
    tree.branchStemElements.call(update());
    tree.branchTbarElements.call(update());
  }
};

/**
 * restrict the visible rectangle to a particular clade
 * @param  {[type]} tree tree objecct
 * @param  {[type]} d    clade to zoom into
 * @param  {[type]} dt   transition duration
 */
const zoomIntoClade = function(tree, d, dt, setSelected){
    tree.nodes.forEach(function (d){d.state.inView = false;});
    preOrderIteration(d, function(d){d.state.inView=true;});
    if (setSelected){
        tree.nodes.forEach(function (d){d.state.selected = d.state.inView;});
    }
    visibleRectangleFromNodes(tree);
    updateGeometry(tree, dt);
};

/**
 * calculate the visible rectangle based on a selection of nodes marked "inView"
 * @param  {[type]} tree [description]
 */
const visibleRectangleFromNodes = function(tree){
    const xVals = tree.nodes.filter(function(d){return d.state.inView;})
                            .map(function (d){return d.layout.x;});
    const yVals = tree.nodes.filter(function(d){return d.state.inView;})
                            .map(function (d){return d.layout.y;});

    const xValsAll = tree.nodes.map(function (d){return d.layout.x;});
    const yValsAll = tree.nodes.map(function (d){return d.layout.y;});
    const dXAll = (d3.max(xValsAll) - d3.min(xValsAll));
    const dYAll = (d3.max(yValsAll) - d3.min(yValsAll));
    const dXmin = 0.03*dXAll;

    tree.visibleTips = tree.tips.filter(function(d){return d.state.inView;});
    tree.zoomLevel.x = dXAll/(dXmin + d3.max(xVals) - d3.min(xVals));
    tree.zoomLevel.y = dYAll/(d3.max(yVals) - d3.min(yVals));
    if (yVals.length){
        tree.visibleRectangle = {top:d3.max(yVals), bottom:d3.min(yVals),
                                 left:d3.min(xVals)-0.5*dXmin, right:d3.max(xVals)+0.5*dXmin};

    }else{
        tree.visibleRectangle = null;
    }
};

/**
 * determine the "inView" state of nodes from a rectanglet that is visible
 * @param  {[type]} tree tree object
 */
const inViewFromVisibleRectangle = function(tree, updateSelected){
    const visR = tree.visibleRectangle;
    tree.nodes.forEach(function(d){
        d.state.inView = ((d.layout.x>=visR.left)&&(d.layout.x<=visR.right)
                        &&(d.layout.y>=visR.bottom)&&(d.layout.y<=visR.top));
        if (updateSelected){d.state.selected = d.state.inView;}
     });
    tree.visibleTips = tree.tips.filter(function(d){return d.state.inView;});
};

/**
 * determine the full extend of the tree by taking min and max of x and y coordinates of every node
 * @param  {array} nodes array of all nodes
 * @return {object}       object with min/max x/y as left, right, top, bottom
 */
const resetView = function(tree){
    tree.nodes.forEach(function (d){d.state.inView = true;});
    visibleRectangleFromNodes(tree, true);
};


/**
 * zomming functions. either zoom both directions by the same factor,
 * or zoom x and y separatly
 * @param  {float} factor factor to zoom
 * @param  {object}} tree   the tree object, this function will change visibleRectabgle
 * @param  {int} dt     transition duration
 */
const zoomIn = function(tree, factor, dt, updateSelected){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);
    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);
    tree.zoomLevel.x *= factor;
    tree.zoomLevel.y *= factor;

    tree.visibleRectangle.bottom = cY - dY/factor;
    tree.visibleRectangle.top = cY + dY/factor;
    tree.visibleRectangle.right = cX + dX/factor;
    tree.visibleRectangle.left = cX - dX/factor;
    inViewFromVisibleRectangle(tree, updateSelected);
    updateGeometry(tree, dt);
};



const zoomInY = function(tree, factor, dt, updateSelected){
    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);
    tree.zoomLevel.y *= factor;

    tree.visibleRectangle.bottom = cY - dY/factor;
    tree.visibleRectangle.top = cY + dY/factor;
    inViewFromVisibleRectangle(tree, updateSelected);
    updateGeometry(tree, dt);
};


const zoomInX = function(tree, factor, dt, updateSelected){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);
    tree.zoomLevel.x *= factor;

    tree.visibleRectangle.left = cX - dX/factor;
    tree.visibleRectangle.right = cX + dX/factor;
    inViewFromVisibleRectangle(tree, updateSelected);
    updateGeometry(tree, dt);
};


const pan = function(tree, dx, dy, updateSelected){
    const cX = 0.5*(tree.visibleRectangle.right + tree.visibleRectangle.left);
    const dX = 0.5*(tree.visibleRectangle.right - tree.visibleRectangle.left);

    const cY = 0.5*(tree.visibleRectangle.top + tree.visibleRectangle.bottom);
    const dY = 0.5*(tree.visibleRectangle.top - tree.visibleRectangle.bottom);

    var zoomX = 10.*tree.zoomLevel.x;
    var zoomY = 10.*tree.zoomLevel.y;

    var xRange = (tree.xScale.range()[1] - tree.xScale.range()[0]);
    var yRange = (tree.yScale.range()[1] - tree.yScale.range()[0]);

    var xDomain = (tree.xScale.domain()[1] - tree.xScale.domain()[0]);
    var yDomain = (tree.yScale.domain()[1] - tree.yScale.domain()[0]);

    // console.log('X', dx, zoomX, xRange, xDomain);
    // console.log('Y', dy, zoomY, yRange, yDomain);
    tree.visibleRectangle.left -= dx/zoomX/xRange*xDomain;
    tree.visibleRectangle.right -= dx/zoomX/xRange*xDomain;
    tree.visibleRectangle.top -= dy/zoomY/yRange*yDomain;
    tree.visibleRectangle.bottom -= dy/zoomY/yRange*yDomain;

    inViewFromVisibleRectangle(tree, updateSelected);
    updateGeometry(tree, 0);
};

//function in here go from node.n -> node.layout
/**
 * assign each node a rank depending on where in the tree layout its sits.
 * @param  {array} nodes the nested tree structure
 * @return {null}        chances happen in place
 */
const calculateNodeRank = function(nodes){
  let rank = 0;
  const assignNodeOrder = function(node){
    if (node.terminal){
      rank++;
      node.layout.rank = rank;
      node.layout.maxRank = rank;
      node.layout.minRank = rank;
    }else{
      node.layout.rank = d3.mean(node.children.map(function(d){return d.layout.rank;}));
      node.layout.maxRank = node.children[node.children.length-1].layout.rank;
      node.layout.minRank = node.children[0].layout.rank;
    }
  };
  postOrderIteration(nodes[0], assignNodeOrder);
};

/*
 * adds the total number of descendant leaves to each node in the tree
 * the functions works recursively.
 * @>=:
 *   node -- root node of the tree.
 */
const addLeafCount = function(nodes) {
    const callback = function(node){
      if (node.terminal) {
          node.stats.leafCount = 1;
      }else{
          node.stats.leafCount = d3.sum(node.children.map(function(d){return d.stats.leafCount;}));
      }
    };
    postOrderIteration(nodes[0], callback);
};


/*
 * set the property that is used as distance along branches
 * this is set to "depth" of each node. depth is later used to
 * calculate coordinates. Parent depth is assigned as well.
 */
const setDistance = function(tree) {
  let dis = "div";
  if (tree.distance) {
    dis = tree.distance; // default is "div" for divergence
  }
  if (dis==="level"){
    tree.nodes[0].n.attr.level=0;
    preOrderIteration(tree.nodes[0], function(d){d.n.attr.level=d.parent.n.attr.level+1;});
  }
  if (typeof tree.nodes[0].n.attr[dis]==="undefined"){
      console.log("distance measure ", dis, "is undefined", tree.nodes[0].n);
      return;
  }

  // assign node and parent depth
  tree.nodes.forEach(function(d) {
    const layout = {};
    layout.depth = d.n.attr[dis];
    layout.pDepth = d.n.parent.attr[dis];
    if (d.n.attr[dis+"_confidence"]){
      layout.conf = d.n.attr[dis+"_confidence"];
    }else{
      layout.conf = [d.layout.depth, d.layout.depth];
    }
    d.layout = layout;
  });
};



/**
 * calculates corrdiantes for the rectangular treeLayou
 * @param  {object} tree object containing the nodes and distance measure
 * @return {[type]}        [description]
 */
const rectangularLayout = function(tree) {
  const dis = tree.distance;
  tree.nodes.forEach(function(d) {
    d.layout.y = d.layout.rank; // precomputed y-values
    d.layout.x = d.layout.depth;
    d.layout.px = d.layout.pDepth;  // parent positions
    d.layout.py = d.layout.y;
    if (!d.terminal){
      d.layout.yTBarStart = d.layout.minRank;
      d.layout.xTBarStart = d.layout.depth;
      d.layout.yTBarEnd = d.layout.maxRank;
      d.layout.xTBarEnd = d.layout.depth;
    }
  });
};


/**
 * calculates and assigns x,y coordinates for the radial layout.
 * in addition to x,y, this calculates the end-points of the radial
 * arcs and whether that arc is more than pi or not
 * @return {null}
 */
const radialLayout = function(tree) {
  const nTips = tree.nodes[0].stats.leafCount;
  const offset = tree.nodes[0].layout.depth;
  let circleFraction = 0.95;
  if (tree.circleFraction){
    circleFraction = tree.circleFraction;
  }
  tree.nodes.forEach(function(d) {
    d.layout.angle = 2.0 * 0.95 * Math.PI * d.layout.rank / nTips;
    d.layout.y = (d.layout.depth - offset) * Math.cos(d.layout.angle);
    d.layout.x = (d.layout.depth - offset) * Math.sin(d.layout.angle);
    d.layout.py = d.layout.y * (d.layout.pDepth - offset) / (d.layout.depth - offset + 1e-15);
    d.layout.px = d.layout.x * (d.layout.pDepth - offset) / (d.layout.depth - offset + 1e-15);
    if (!d.terminal){
        const angleCBar1 = 2.0 * circleFraction * Math.PI * d.layout.minRank / nTips;
        const angleCBar2 = 2.0 * circleFraction * Math.PI * d.layout.maxRank / nTips;
        d.layout.yTBarStart = (d.layout.depth - offset) * Math.cos(angleCBar1);
        d.layout.xTBarStart = (d.layout.depth - offset) * Math.sin(angleCBar1);
        d.layout.yTBarEnd = (d.layout.depth - offset) * Math.cos(angleCBar2);
        d.layout.xTBarEnd = (d.layout.depth - offset) * Math.sin(angleCBar2);
        d.layout.smallBigArc = Math.abs(angleCBar2 - angleCBar1) > Math.PI * 1.0;
    }
  });
};

/**
 * calculates x,y coordinates for the unrooted layout. this is
 * done recursively via a the function placeSubtree
 * @return {null}
 */
const unrootedLayout = function(tree){
  const nTips=tree.nodes[0].stats.leafCount;
  //calculate branch length from depth
  tree.nodes.forEach(function(d){d.layout.branchLength = d.layout.depth - d.layout.pDepth;});

  // do preorder iteration for find locations for all subtrees
  const placeSubtree = function(node){
    node.layout.px = node.parent.layout.x;
    node.layout.py = node.parent.layout.y;
    node.layout.angle = node.layout.tau + node.layout.w*0.5;
    node.layout.x = node.layout.px+node.layout.branchLength*Math.sin(node.layout.angle);
    node.layout.y = node.layout.py+node.layout.branchLength*Math.cos(node.layout.angle);
    var eta = node.layout.tau; //eta is the cumulative angle for the wedges in the layout
    if (!node.terminal){
        for (var i=0; i<node.children.length; i++){
            var ch = node.children[i];
            ch.layout.w = 2*Math.PI*ch.stats.leafCount/nTips;
            ch.layout.tau = eta;
            eta += ch.layout.w;
            placeSubtree(ch);
        }
    }
  };

  // set values for the root
  tree.nodes[0].layout.x = 0;
  tree.nodes[0].layout.y = 0;
  tree.nodes[0].layout.tau = 0.0*Math.PI;
  tree.nodes[0].layout.w = 2*Math.PI;
  placeSubtree(tree.nodes[0]);
};

/**
 * calculates corrdiantes for the rectangular treeLayou
 * @param  {object} tree object containing the nodes and distance measure
 * @return {[type]}        [description]
 */
const clockLayout = function(tree) {
  if (typeof tree.nodes[0].n.attr["num_date"]==="undefined"){
      console.log("clock layout requires numerical dates in attr ", tree.nodes[0].n);
      return;
  }
  const dis = tree.distance;
  tree.nodes.forEach(function(d) {
    d.layout.x = d.n.attr["num_date"];
    d.layout.y = d.layout.depth;
    d.layout.px = d.n.parent.attr["num_date"];
    d.layout.py = d.layout.pDepth;
  });
};


/**
 * wrapper function that calls the different specific layouts
 * @param  {object} tree object containing nodes, layout, and distance, the latter two are optional
 * @return {null}       everything is changed in place.
 */
const treeLayout = function(tree){
    //determine x and y locations of nodes in abstract space
    setDistance(tree);
    calculateNodeRank(tree.nodes);
    addLeafCount(tree.nodes);

    // depending on the chosen layout, determine the location in tree scaled 2d
    if (tree.layout === "radial"){
        radialLayout(tree);
    }else if (tree.layout === "unrooted"){
        unrootedLayout(tree);
    }else if (tree.layout === "clock"){
        clockLayout(tree);
    }else{
        rectangularLayout(tree);
    }
    //reset the visible rectancle -- as this lives in tree space,
    visibleRectangleFromNodes(tree);
};

/**
 * takes an augur json and converts it into the a tree structure
 * that included information needed for drawing and manipulation
 * of the tree.
 * @param  {object} treeJson hierarchical json where .children are the descending branches
 * @return {object}       object storing treeJson and other information about tree display
 */
const phyloTree = function(treeJson, params) {
    const defaultsParams = {
      layout:"rect",
      distance:"div",
      orientation:{x:1, y:1},
      callbacks:{},
      zoomLevel:{x:1.0, y:1.0},
      pan:{x:0.0, y:0.0},
      tipRadius:4.0,
      tipStroke:"#555",
      tipFill:"#555",
      tipStrokeWidth:2.0,
      branchStroke:"#555",
      branchStrokeWidth:2.0,
      autoTipSize:true
    };

    const phyloNodes = [];
    const nodeArray = [];
    const treeParams = Object.assign(defaultsParams, params);
    const makeNodeArray = function(node){
        if (node.children){
          var child;
          for (var ni=0; ni<node.children.length; ni++){
            child = node.children[ni];
            child.parent = node;
            // if no div attribute is given, construct from branch length
            if (!child.attr){
              child.attr={};
            }
            if (!child.attr.div){
              if (child.branch_length){
                child.attr.div = node.attr.div + child.branch_length;
              }else{
                child.attr.div = node.attr.div;
              }
            }
          }
        }
        //add clade (serves as a unique node identifier) if not set
        if (!node.clade){node.clade = nodeArray.length+1;}
        nodeArray.push(node);
    };
    //if (!treeJson.attr){
    if (!treeJson.attr){
          //console.log(treeJson);
        treeJson.attr = {};
        treeJson.attr.div=0.0;
    }
    preOrderIteration(treeJson, makeNodeArray);
    nodeArray[0].parent = nodeArray[0];
    nodeArray.forEach(function(d){
        const nodeShell = {n:d, stats:{}, layout:{}, SVGcoords:{}, state:{},
                           tipAttributes:{}, branchAttributes:{}};
        d.shell = nodeShell;
        nodeShell.parent = d.parent.shell;
        phyloNodes.push(nodeShell);
    });

    phyloNodes.forEach(function(d){
        d.terminal = (d.n.children)?false:true;
        if (d.terminal){
            d.children = null;
        }else{
            d.children = d.n.children.map(function(x){return x.shell;});
        }
    });
    const nc=100.0;
    if (treeParams.autoTipSize){
    treeParams.tipRadius = Math.max(1.0, nc*treeParams.tipRadius/(nc+nodeArray.length));
    treeParams.branchStrokeWidth = Math.max(1.0, nc*treeParams.branchStrokeWidth/(nc+nodeArray.length));
    }
    const newTree = Object.assign(
                        {nodes:phyloNodes,
                         tips: phyloNodes.filter(function(d){return d.terminal;}),
                         internals: phyloNodes.filter(function(d){return !d.terminal;}),
                         xScale: d3.scale.linear(),
                         yScale: d3.scale.linear(),
                        },
                        treeParams);
    if (!newTree.dimension && newTree.svg){
        newTree.dimensions = {width:parseInt(newTree.svg.attr("width"), 10),
                              height:parseInt(newTree.svg.attr("height"), 10)};

    }
    // calculate layout and coordinates using defaults if not otherwise specified
    treeLayout(newTree);
    if (newTree.svg){
      newTree.topLevelGroup = newTree.svg.append("g");
      treeCanvas(newTree);
    }
    return newTree;
};

/**
 *
 * @param  {object} tree the phyloTree data structure
 * @param  {object} callbacks object with callback that specify the appearance of each tip
 */
const drawTips = function(tree, callbacks){
    setupTips(tree);

	const tmp_callbacks = Object.assign({}, callbacks);
	if (!tmp_callbacks.r){tmp_callbacks.r = function(d){return tree.tipRadius;};}
	if (!tmp_callbacks.fill){tmp_callbacks.fill = function(d){return tree.tipFill;};}
	if (!tmp_callbacks.stroke){tmp_callbacks.stroke = function(d){return tree.tipStroke;};}
    if (!tmp_callbacks.strokeWidth){tmp_callbacks.strokeWidth = function(d){return tree.tipStrokeWidth;};}

    tree.tips.forEach(function(d){
        d.tipAttributes.r = tmp_callbacks.r(d);
        d.tipAttributes.fill = tmp_callbacks.fill(d);
        d.tipAttributes.stroke = tmp_callbacks.stroke(d);
        d.tipAttributes["stroke-width"] = tmp_callbacks.strokeWidth(d);
        d.tipAttributes.id = "tip_" + d.n.clade;
    });
    tree.tipElements
        .attr("r", function(d){return d.tipAttributes.r;})
        .attr("cx", function(d){return d.SVGcoords.xTip;})
        .attr("cy", function(d){return d.SVGcoords.yTip;})
        .attr("id", function(d) {return d.tipAttributes.id;})
        .style("fill", function(d){return d.tipAttributes.fill;})
        .style("stroke", function(d){return d.tipAttributes.stroke;})
        .style("stroke-width", function(d){return d.tipAttributes["stroke-width"];});
};

/**
 * create the d3 objects for tips and bind the callbacks
 * @param  {[type]} tree [description]
 * @return {[type]}      [description]
 */
const setupTips = function(tree){
    tree.svg.selectAll('.tip').remove();
    tree.tipElements = tree.topLevelGroup.selectAll(".tip")
        .data(tree.tips)
        .enter()
        .append("circle")
        .attr("class", "tip")
        .on("mouseover", function(d) {tree.callbacks.onTipHover(d);})
        .on("mouseout", function(d) {tree.callbacks.onTipLeave(d);})
        .on("click", function(d) {tree.callbacks.onTipClick(d);})
        .style("pointer-events", "auto")
        .style("cursor", "pointer");
};

const drawTree = function(tree, callbacks, features){
    if (callbacks && callbacks.branch){
        drawBranches(tree, callbacks.branch);
    }else{
        drawBranches(tree, {});
    }
    if (callbacks && callbacks.tip){
        drawTips(tree, callbacks.tip);
    }else{
        drawTips(tree, {});
    }
    if (tree.scaleBar || tree.scalebar){
        addScaleBar(tree);
    }
};

const removeLabels = function(tree){
    tree.svg.selectAll(".tipLabel").remove();
    tree.svg.selectAll(".branchLabel").remove();
};

const branchLabels = function(tree, labelText, fontSize, yPad, xPad, align){
    const tmpAlign = align || "end";
    tree.branchLabels = tree.topLevelGroup.selectAll(".branchLabel")
        .data(tree.nodes.filter(function(d){return (fontSize(d) && labelText(d).length);}))
        .enter().append("text")
        .text(labelText)
        .attr("class", "branchLabel")
        .attr("x", function(d){return d.SVGcoords.xTip + xPad;})
        .attr("y", function(d){return d.SVGcoords.yTip + yPad;})
        .style("text-anchor", tmpAlign)
        .style("font-size", function(d){return fontSize(d).toString()+"px";});
};

const tipLabels = function(tree, labelText, fontSize, yPad, xPad, align){
    const tmpAlign = align || "start";
    if (tree.layout==="rect"){
        tree.branchLabels = tree.topLevelGroup.selectAll(".tipLabel")
            .data(tree.nodes.filter(function(d){return (fontSize(d) && labelText(d).length);}))
            .enter().append("text")
            .text(labelText)
            .attr("class", "tipLabel")
            .attr("x", function(d){return d.SVGcoords.xTip + xPad;})
            .attr("y", function(d){return d.SVGcoords.yTip + yPad;})
            .style("text-anchor", tmpAlign)
            .style("font-size", function(d){return fontSize(d).toString()+"px";});
    }else if (tree.layout==="radial" ||tree.layout==="unrooted"){
        const dr = Math.sqrt(xPad*xPad + yPad*yPad);
        tree.branchLabels = tree.topLevelGroup.selectAll(".tipLabel")
            .data(tree.nodes.filter(function(d){return (fontSize(d) && labelText(d).length);}))
            .enter().append("text")
            .text(labelText)
            .attr("class", "tipLabel")
            .attr("x", function(d){return d.SVGcoords.xTip + dr*Math.sin(d.layout.angle);})
            .attr("y", function(d){return d.SVGcoords.yTip + dr*Math.cos(d.layout.angle);})
            .style("text-anchor", function(d){return (d.layout.angle>Math.PI)?"end":"start";})
            .attr("transform",function(d){
                return `rotate(${(-180/Math.PI*d.layout.angle)%180+90},${d.SVGcoords.xTip + dr*Math.sin(d.layout.angle)}, ${d.SVGcoords.yTip + dr*Math.cos(d.layout.angle)})`;})
//            .attr("rotate",function(d){return 180/Math.Pi*d.layout.angle;})
            .style("font-size", function(d){return fontSize(d).toString()+"px";});

    }
};

exports.phyloTree = phyloTree;
exports.drawTree = drawTree;
exports.updateGeometry = updateGeometry;
exports.updateGeometryFade = updateGeometryFade;
exports.changeLayout = changeLayout;
exports.changeDistance = changeDistance;
exports.updateTipStyle = updateTipStyle;
exports.updateTipAttribute = updateTipAttribute;
exports.updateBranchStyle = updateBranchStyle;
exports.updateBranchAttribute = updateBranchAttribute;
exports.updateTips = updateTips;
exports.updateBranches = updateBranches;
exports.zoomIntoClade = zoomIntoClade;
exports.visibleRectangleFromNodes = visibleRectangleFromNodes;
exports.inViewFromVisibleRectangle = inViewFromVisibleRectangle;
exports.resetView = resetView;
exports.zoomIn = zoomIn;
exports.zoomInY = zoomInY;
exports.zoomInX = zoomInX;
exports.pan = pan;
exports.removeLabels = removeLabels;
exports.branchLabels = branchLabels;
exports.tipLabels = tipLabels;

Object.defineProperty(exports, '__esModule', { value: true });

})));

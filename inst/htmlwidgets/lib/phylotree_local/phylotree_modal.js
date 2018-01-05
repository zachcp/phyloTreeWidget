//
// Code To Control the Modal
//
// Note this is all based on html modal classes created in phyotree.R
// css is the bulma modal css.


// add modal processing function
var addDataToModal = function(node, modaltitleclass="") {

  // update title with Node ID
  d3.select(".modal-card-title").text("New Text!")

  // update Body with Node information
  var modalbody = document.getElementsByClassName("modal-card-body")[0];

  for (nodekey in d3.keys(node.n)){
    console.log(nodekey)
    keycontent = document.createTextNode(nodekey);
    modalbody.appendChild(keycontent)
    valcontent = document.createTextNode(node.n[nodekey]);
    modalbody.appendChild(valcontent)
  }

  // Make Node Visible
  d3.select('.modal').attr("class", "modal is-active")

}





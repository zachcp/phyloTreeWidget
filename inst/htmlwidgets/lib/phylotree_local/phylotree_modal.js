//
// Code To Control the Modal
//
// Note this is all based on html modal classes created in phyotree.R
// css is the bulma modal css.


// add modal processing function
var addDataToModal = function(node, excludes=["parent", 'clade', 'attr', 'shell']) {

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

}





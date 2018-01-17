#' process_tree_python
#'
#' DEPRECATED
#'
#' Convert a tree and a corresponding data frame to JSON consumable
#' by phyloTree JS. RIght now this means we do the following:
#'
#'  R (tree + df ) -> Disk -> Python (tree + df) -> Python(JSON) -> Disk -> R ->
#'     HTMLWidget
#'
#'  Eventually writing the conversion script in R would allow you to simply do:
#'
#'   R( tree + df ) -> R (JSON) -> HTMLWidget
#'
#'  But this will take some time. Initial focus are on features. However,
#'  this dance requires that python is on your PATH and that you have the
#'  following libraries installed: click, biopython, pandas.
#'
#'
#@importFrom ape read.tree
#@importFrom ape write.tree
#@importFrom jsonlite read_json
#@export
process_tree_python <- function(tree, data, python="python") {

  stop("DEPRECATED. Will remove this once the R code has been extensiely tested")

  # intermediate files will be run in temp if no output is sent
  # clean up the tempdir when we are done.
  wd <- tempdir()
  on.exit(unlink(list.files(wd)))

  treetemp <- paste0(wd, "/tree.nw")
  datatemp <- paste0(wd, "/data.txt")
  jsontemp <- paste0(wd, "/tree.json")

  ape::write.tree(tree, file = treetemp)
  write.table(data, file = datatemp, sep="\t", row.names=FALSE, quote=FALSE)

  process_script   <- system.file("scripts/tree_to_json.py", package="phylotree")
  cli  <- paste(python,    process_script,
                "--newick",   treetemp,
                "--nodedata", datatemp,
                "--jsonout",  jsontemp)

  print("Converting tree to JSON")
  system(cli)

  print("Loading tree JSON")
  treejson <- jsonlite::read_json(jsontemp)

  return(treejson)

}

#' process_tree
#' 
#' 
#' @importFrom ape read.tree
#' @importFrom ape write.tree
#' @importFrom jsonlite read_json
#' @export
process_tree <- function(tree, data, python="python") {
  
  #intermediate files will be run in temp if no output is sent, andl lets cleaup the tempdir when we are done.
  wd <- tempdir()
  #on.exit(unlink(list.files(wd)))
  
  
  tree <- ape::read.tree(text="(A, (B, C), (D, E), F);")
  data <- data.frame(
    node = c("A", "B", "C", "D", "E", "F"),
    lat = c(10,11,12,13,14, 15),
    kind = c("AA", "BA", "CA", "DA", "EA", "FA"))
  
  treetemp <- paste0(wd, "/tree.nw")
  datatemp <- paste0(wd, "/data.txt")
  jsontemp <- paste0(wd, "/tree.json")
                     
  ape::write.tree(tree, file = treetemp)
  write.table(data, file = datatemp, sep="\t", row.names=FALSE, quote=FALSE)
  
  ape::write.tree(tree, file = "inst/scripts/tree.nwk")
  write.table(data, file = "inst/scripts/data.txt", sep="\t", row.names=FALSE, quote=FALSE)
  
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

#' process_tree_in_R
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
#' @importFrom ape read.tree
#' @importFrom ape write.tree
#' @importFrom jsonlite read_json
#' @export
process_tree_in_R <- function(tree, data, python="python") {
  
  library(ape)
  library(data.tree)
  library(tidytree)
  library(dplyr)
  
  source("https://bioconductor.org/biocLite.R")
  biocLite("treeio")
  
  data(bird.families)
  bird.families <- ape::makeNodeLabel(bird.families)
  
  birddata <- data.frame(
    node = bird.families$tip.label,
    col1 = sample(1:5, length(bird.families$tip.label), replace=T),
    col2 = sample(1:500, length(bird.families$tip.label), replace=T),
    col4 = sample(LETTERS[1:10], length(bird.families$tip.label), replace=T),
    col5 = c(rep("CLADE1", 40), rep("CLADE2", 40), rep("CLADE3", 40), rep("CLADE4", 17)),
    stringsAsFactors = FALSE
  )
  
  x <- as_data_frame(bird.families)
  
  x <- x %>% left_join(birddata, by=c('label'='node'))
  
  x$pathString <- paste("root2", x$parent, x$node, sep="/")
  
  treenode <- as.Node(x, mode = c("table"),
          pathName = "pathString", pathDelimiter = "/", colLevels = NULL,
          na.rm = TRUE)
  
  l1 <- as.list(treenode, childrenName = "children", nameName = "node")
  
  ToListExplicit(treenode, unname=TRUE, childrenName = "children", nameName = "label") %>%
    jsonlite::toJSON(auto_unbox = TRUE)
  #%>%
    jsonlite::unbox()
  
  return(treenode)
  
}

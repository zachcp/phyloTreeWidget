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
#' @import data.tree
#' @import dplyr
#' @importFrom purrr map_chr
#' @importFrom ape nodepath
#' @importFrom ape makeNodeLabel
#' @export
process_tree_in_R <- function(tree, data, python="python") {

  library(ape)
  library(data.tree)
  library(tidytree)
  library(dplyr)

  #source("https://bioconductor.org/biocLite.R")
  #biocLite("treeio")

  data(bird.families)

  # labal internal nodes
  bird.families <- bird.families %>%
    ape::makeNodeLabel() %>%
    ape::ladderize()

  birddata <- data.frame(
    node = bird.families$tip.label,
    col1 = sample(1:5, length(bird.families$tip.label), replace=T),
    col2 = sample(1:500, length(bird.families$tip.label), replace=T),
    col4 = sample(LETTERS[1:10], length(bird.families$tip.label), replace=T),
    col5 = c(rep("CLADE1", 40), rep("CLADE2", 40), rep("CLADE3", 40), rep("CLADE4", 17)),
    stringsAsFactors = FALSE
  )



  df <- as_data_frame(bird.families)

  # get name of node
  df$namedparent <- purrr::map_chr(df$parent, function(x){
     df[df$node==x,][['label']]
    })


  #combine the tre data with the datframe
  df <- df %>%
    left_join(birddata, by=c('label'='node')) %>%
    mutate(branch_length=branch.length) %>%
    select(-branch.length)

  # create node paths for JSON output.
  # This requires finding the path from the root to the individual node
  #
  rootnode <- df[df$parent==df$node,][['node']]
  df[df$node==rootnode,][['label']] <- 'root'

  df$pathString <- purrr::map_chr(df$node, function(p) {
    nodes      <-  ape::nodepath(bird.families, from=rootnode, to=p)
    nodechar   <-  purrr::map_chr(nodes, function(n) {
          df[df$node==n,][['label']]
      })
    paste(nodechar, collapse="/")
  })


  treenode <- as.Node(df, mode = c("table"),
          pathName = "pathString", pathDelimiter = "/",
          colLevels = NULL,
          na.rm = TRUE)

  treelist <- ToListExplicit(treenode, unname=TRUE, childrenName = "children", nameName = "strain")

  #%>% jsonlite::toJSON(auto_unbox = TRUE)
  return(treelist)

}

#' process_tree
#'
#' Convert a tree and a corresponding data frame to JSON consumable
#' by phyloTree JS.
#'
#' @import data.tree
#' @import dplyr
#' @importFrom purrr map_chr
#' @importFrom ape nodepath
#' @importFrom ape makeNodeLabel
#' @export
process_tree <- function(tree, data, python="python") {

  # labal internal nodes and convert to dataframe
  tree <- tree %>%
    ape::makeNodeLabel() %>%
    ape::ladderize()

  treedf <- as_data_frame(tree)

  # get name of node
  treedf$namedparent <- purrr::map_chr(treedf$parent, function(x) {
    treedf[treedf$node==x,][['label']]
  })


  #combine the tree data with the datframe
  treedf <- treedf %>%
    left_join(data, by=c('label'='node')) %>%
    mutate(branch_length=branch.length) %>%
    select(-branch.length)

  # create node paths for JSON output.
  # This requires finding the path from the root to the individual node
  #
  rootnode <- treedf[treedf$parent==treedf$node,][['node']]
  treedf[treedf$node==rootnode,][['label']] <- 'root'

  treedf$pathString <- purrr::map_chr(treedf$node, function(p) {
    nodes      <-  ape::nodepath(bird.families, from=rootnode, to=p)
    nodechar   <-  purrr::map_chr(nodes, function(n) {
        treedf[treedf$node==n,][['label']]
      })
    paste(nodechar, collapse="/")
  })


  treenode <- as.Node(treedf, mode = c("table"),
          pathName = "pathString", pathDelimiter = "/",
          colLevels = NULL,
          na.rm = TRUE)

  treelist <- ToListExplicit(treenode, unname=TRUE, childrenName = "children", nameName = "strain")

  return(treelist)

}

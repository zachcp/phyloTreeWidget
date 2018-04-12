#' process_tree
#'
#' Convert a tree and a corresponding data frame to JSON consumable
#' by phyloTree JS.
#'
#' @import data.tree
#' @import dplyr
#' @import tidytree
#' @importFrom purrr map_chr
#' @importFrom ape nodepath
#' @importFrom ape makeNodeLabel
#' @export
process_tree <- function(tree, data, use_python=FALSE, python="python") {

  if (use_python == TRUE) {
    return(process_tree_python(tree, data, python))
  }

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
  treedf[treedf$node==rootnode,][['label']] <- 'root2'

  # this computation is incredibly long for big trees.
  # I suspect that nodepath is a full tree traversal for each node.
  # a better version mapy generate the list-of-lists via direct iteration
  treedf$pathString <- purrr::map_chr(treedf$node, function(p) {
    nodes      <-  ape::nodepath(tree, from=rootnode, to=p)
    nodechar   <-  purrr::map_chr(nodes, function(n) {
        # note this will keep the name of the first node if there are duplicates
        treedf[treedf$node==n,][['label']][[1]]
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

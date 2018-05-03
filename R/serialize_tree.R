#' serialize_tree
#'
#' Convert a phylo4d object to a nested R object that is ready for JSON serialization.
#'

#' @importFrom phylobase getNode
#' @importFrom phylobase rootNode
#' @export
serialize_tree <- function(phy4) {

  nodeLabels(phy4) <- sprintf("NODE%02d", 1:nNodes(phy4))
  rootnode         <- rootNode(phy4)
  df               <- phylobase:::.phylo4ToDataFrame(phy4)

  convert_to_json_ready(node=rootnode, tree=phy4, dataframe=df)
}



#' @importFrom dplyr %>%
#' @importFrom dplyr filter
#' @importFrom phylobase children
#' @importFrom phylobase getNode
convert_to_json_ready <- function(node, tree, dataframe, exclude_attr = c('node', 'ancestor', 'node.type')) {

  #print(dataframe)
  nodename <- names(node)
  #print(nodename)
  #nodedata <- dataframe %>% filter(label == nodename)
  nodedata <- dataframe[dataframe$label == nodename,]
  #print(nodedata)


  # annotate treejson with current node
  treejson <- list()
  treejson[['strain']] <- nodename

  for (name in names(nodedata)) {
    if (!name %in% exclude_attr) {
      if (length(nodedata[[name]]) > 0 ) {
        treejson[[name]] <- nodedata[[name]]
      }
    }
  }

  # add children
  ch <- children(tree, node)

  if (length(ch) > 0) {

    treejson[['children']] <- list()

    for (i in seq_along(ch)) {

      childname <- names(ch)[i]
      childidx  <- ch[i]
      treejson[['children']] <- c(treejson[['children']],
                                  list(convert_to_json_ready(getNode(tree, childidx), tree, dataframe)))

    }
  }
  return(treejson)
}


#' serialize_tree
#'
#' Convert a phylo4d object to a nested R object that is ready for JSON serialization.
#'
#' @importFrom phylobase getNode
#' @importFrom phylobase rootNode
#' @importFrom phylobase nNodes
#' @importFrom phylobase nodeLabels<-
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
convert_to_json_ready <- function(node, tree, dataframe, exclude_attr = c('node', 'ancestor', 'node.type'), default_branch_length=0.01) {

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
          if (name=="edge.length") {
            # handle branch length using phylobases' built-in edge_length
            branch_length <- nodedata[[name]]

            if (is.na(branch_length)) {
              branch_length <- default_branch_length
            }
            if (branch_length < default_branch_length) {
              branch_length <- default_branch_length
            }

            treejson['branch_length'] <- branch_length

          } else {
            treejson[[name]] <- nodedata[[name]]
          }
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


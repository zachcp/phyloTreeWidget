#' coerce_to_phy4d
#'
#' coerce different phylo data types to phylo4d
#'
#' @import methods
#' @importFrom phylobase phylo4
#' @importFrom phylobase tipLabels
#' @export
setGeneric("coerce_to_phy4d", function(phy, data) standardGeneric("coerce_to_phy4d"))

#' @export
setMethod("coerce_to_phy4d", signature(phy="phylo", data="NULL"), function(phy, data) {
  phy <- as(phy, "phylo4")
  coerce_to_phy4d(phy, data=data)
})

#' @export
setMethod("coerce_to_phy4d", signature(phy="phylo", data="data.frame"), function(phy, data) {
  phy4 <- as(phy, "phylo4")
  coerce_to_phy4d(phy4, data)
})

#' @export
#' @importFrom phylobase tipLabels
setMethod("coerce_to_phy4d", signature(phy="phylo4", data="NULL"), function(phy, data) {
  # if there is no data make a single column data frame to use

  tip_labels <- as.character(tipLabels(phy))

  data = data.frame(
    node=tip_labels,
    col1=tip_labels)

  coerce_to_phy4d(phy, data)
})


#' @export
#' @importFrom phylobase phylo4d
setMethod("coerce_to_phy4d", signature(phy="phylo4", data="data.frame"), function(phy, data) {
  phylo4d(phy, data)
})



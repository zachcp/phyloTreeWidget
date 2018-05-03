
#' coerce_to_phy4d
#'
#' coerce different phylo data types to phylo4d
#'
#' @importFrom phylobase phylo4
#' @
setGeneric("coerce_to_phy4d", function(phy, data) standardGeneric("coerce_to_phy4d"))


setMethod("coerce_to_phy4d", signature(phy="phylo", data="NULL"), function(phy, data) {
  # if there is no data make a single column data frame to use
  data = data.frame(
    node=phy$tip.label,
    col1 =phy$tip.label)

  phy <- as(phy, "phylo4")

  coerce_to_phy4d(phy, data=data)
})


setMethod("coerce_to_phy4d", signature(phy="phylo", data="data.frame"), function(phy, data) {
  phy4 <- as(phy, "phylo4")
  coerce_to_phy4d(phy4, data)
})

# setMethod("coerce_to_phy4d", signature(phy="phylo4", data="NULL"), function(phy, data) {
#   # if there is no data make a single column data frame to use
#   data = data.frame(
#     node=phy$tip.label,
#     col1 =phy$tip.label)
#
#   coerce_to_phy4d(phy, data)
# })

setMethod("coerce_to_phy4d", signature(phy="phylo4", data="data.frame"), function(phy, data) {
  phylo4d(phy, data)
})



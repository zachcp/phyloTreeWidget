library(phylotree)
library(phylobase)

context("Testing Basic phylotree Serialization")


test_that("tree-only widget creation works", {

  data(geospiza)
  g1      <- as(geospiza_raw$tree, "phylo4")
  geodata <- geospiza_raw$data
  g2      <- phylo4d(g1, geodata)
  nodeLabels(g2) <- sprintf("NODE%02d", 1:nNodes(g2))
  rn      <- phylobase::rootNode(g2)
  df1     <- phylobase:::.phylo4ToDataFrame(g2)
  Robj    <- serialize_tree(rn, g2, df1)
  #jsonlite::toJSON(Robj, auto_unbox = TRUE)
  expect_is(Robj$strain, "NODE01")
  expect_equal(length(Robj$children), 2)
  expect_setequal(names(Robj), c("strain", "label", "edge.length", "wingL",
                                 "tarsusL", "culmenL","beakD", "gonysW",
                                 "children" ))

})


library(phylotree)
library(phylobase)

context("Testing Basic phylotree Serialization")


test_that("tree-only widget creation works", {

  data(geospiza)
  treedata <- serialize_tree(geospiza)
  expect_is(treedata, "list")
  expect_equal(treedata$strain, "NODE01")
  expect_equal(length(treedata$children), 2)
  expect_setequal(names(treedata), c("strain", "label", "edge.length", "wingL",
                                  "tarsusL", "culmenL","beakD", "gonysW",
                                  "children" ))

})


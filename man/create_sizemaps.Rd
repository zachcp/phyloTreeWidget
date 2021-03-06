% Generated by roxygen2: do not edit by hand
% Please edit documentation in R/create_sizemaps.R
\name{create_sizemaps}
\alias{create_sizemaps}
\title{create_sizemaps}
\usage{
create_sizemaps(df, custommaps = NULL, exclude_attr = c("node", "ancestor",
  "node.type"))
}
\arguments{
\item{df}{Required. A dataframe containing infornation about nodes in the tree.}

\item{exclude_attr}{a list of columns to exclude from the final output. The
defaults are the otputs from phylobase}

\item{custommaps.}{Optional. Curently a stub. There needs to be a way to pass in custom colors.}
}
\description{
create size-maps. Find numeric/integer columns of a dataframe and get the max/min values.
}

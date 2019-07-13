import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ChampBuilder from "../components/champbuilder"

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="TFT Builder" />
      <ChampBuilder></ChampBuilder>
    </Layout>
  )
}

export default IndexPage
